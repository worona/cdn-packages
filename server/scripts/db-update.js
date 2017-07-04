const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');

const updateDb = async () => {
  const db = await MongoClient.connect(config.MONGO_URL);
  const settingsDb = db.collection('settings-live');

  const settings = await settingsDb
    .find({
      'woronaInfo.name': 'publish-native-app-extension-worona',
      iconSrc: { $regex: /(worona\.imgix\.net|images\.worona\.io)/ },
    })
    .toArray();

  const paralel = 10;

  for (let i = 0; i < settings.length; i += paralel) {
    const settingPromises = settings.slice(i, i + paralel).map(setting => {
      const newIconSrc = setting.iconSrc.replace(
        /(worona\.imgix\.net|images\.worona\.io)/,
        'worona.sirv.com'
      );
      console.log(`updating ${setting.appName}`)
      return settingsDb.update({ _id: setting._id }, { $set: { iconSrc: newIconSrc } });
    });
    console.log('waiting...');
    await Promise.all(settingPromises);
    console.log('Finished!\n');
  }
};

process.on('unhandledRejection', err => {
  console.log(err.stack);
  process.exit(1);
});

updateDb();
