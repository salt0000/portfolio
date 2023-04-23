FROM mysql:8.0.32

ENV TZ=Asia/Tokyo \
    MYSQL_DATABASE=portfolio \
    MYSQL_ROOT_PASSWORD=secret

COPY ./docker/mysql/initdb.d /docker-entrypoint-initdb.d