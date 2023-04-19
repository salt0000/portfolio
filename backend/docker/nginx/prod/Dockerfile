FROM nginx:1.23.4-alpine

ENV TZ=Asia/Tokyo

COPY ./api/public /usr/share/nginx/html/api/public
COPY ./docker/nginx/*.conf /etc/nginx/conf.d/