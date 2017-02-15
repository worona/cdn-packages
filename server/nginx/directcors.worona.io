server {
  listen 443 ssl;
  listen 80;

  # SSL cert
  ssl_certificate /etc/nginx/ssl/nginx.crt;
  ssl_certificate_key /etc/nginx/ssl/nginx.key;

  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

  server_name directcors.worona.io;

  merge_slashes off;

  location ~* ^/(https?://)(.*) {
    add_header 'cors' $1$2$is_args$args;
    proxy_pass http://127.0.0.1:4500/api/v1/cors/$1$2$is_args$args;
  }
}
