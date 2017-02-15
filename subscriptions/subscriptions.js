/* eslint-disable */
window.dataLayer = window.dataLayer || [];

function getQueryByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(function() {
  var apiUrls = {
    'subscriptions.worona.org': 'https://backend.worona.io',
    'presubscriptions.worona.org': 'https://prebackend.worona.io',
    'local': 'http://localhost:4500',
  }
  var apiUrl = apiUrls[window.location.host] || apiUrls.local;
  var email = getQueryByName('email');
  var listSlug = getQueryByName('listSlug');
  var listName = getQueryByName('listName');

  // Show loading screen.
  $('#dynamic').html('\
    <h2>\
      <span class="button is-loading is-white"></span>\
      &nbsp;&nbsp;Unsubscribing <strong>' + email + '</strong> from\
      <strong>' + listSlug + '</strong> email list.\
    </h2>'
  );

  var request = $.ajax({
    type: 'post',
    url: apiUrl + '/api/v1/subscriptions/unsubscribe',
    data: { email: email, listSlug: listSlug },
    timeout: 10000,
  });

  var printSuccess = function(email, listSlug, listName) {
    $('#dynamic').html('\
      <h2>\
        <a class="button is-white"><span class="icon is-medium"><i class="fa fa-check"></i></span></a>\
        &nbsp;&nbsp;Unsubscribed <strong>' + email + '</strong> from \
        <strong>' + listName + ' (' + listSlug + ')</strong> email list.\
      </h2>\
      <h5><em>Please be aware that you may still be subscribed to other Worona lists.</em></h5>\
    ');
  };

  var printError = function(email, listSlug, error) {
    $('#dynamic').html('\
      <h2>\
        <a class="button is-white"><span class="icon is-medium"><i class="fa fa-times"></i></span></a>\
        There was a problem unsubscribing <strong>' + email + '</strong> from <strong>' +
        listSlug + '</strong> email list. <br />\
        <div style="padding-top: 12px;">\
          Please contact <a href="https://www.worona.org/get-help" target="_blank">support@worona.org</a>.\
        </div>\
      </h2> \
      <h5><em>Error: ' + error + '</em></h5>\
    ');
    dataLayer.push({
      event: 'Subscription error',
      props: {
        email: email,
        listSlug: listSlug,
        error: error
      }
    })
  }

  request.done(function (response){
    if (response.error)
      printError(email, listSlug, response.error);
    else
      printSuccess(email, listSlug, response.listName);
  });

  request.fail(function (jqXHR, textStatus, error){
    printError(email, listSlug, '');
  });
});
