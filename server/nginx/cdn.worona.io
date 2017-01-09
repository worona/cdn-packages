# Expires map
map $sent_http_content_type $expires {
  default                       off;
  ~text/html                    epoch;
  ~application/json             epoch;
  ~text/css                     max;
  ~application/(x-)?javascript  max;
  ~image/                       max;
  ~application/octet-stream     max;
  ~application/.*font.*         max;
  ~font/                        max;
}

server {
  listen 80;
  listen 443 ssl;

  # SSL cert
  ssl_certificate /etc/nginx/ssl/nginx.crt;
  ssl_certificate_key /etc/nginx/ssl/nginx.key;

	# Disable SSLv3 (Poodle bug)
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

  server_name cdn.worona.io backend.worona.io;

  # Cache
  expires $expires;

  location /api {
    proxy_pass http://127.0.0.1:4500;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location /packages/dist {
    alias /var/www/worona-cdn/packages/dist/;
  }
}
