FROM php:8.1.10-fpm-bullseye

# General settings
WORKDIR /usr/share/nginx/html/api
ENV TZ=Asia/Tokyo \
    LC_ALL=en_US.UTF-8
RUN apt-get update && \
    apt-get -qq -y install libicu-dev libonig-dev unzip locales && \
    localedef -f UTF-8 -i en_US en_US.UTF-8 && \
    docker-php-ext-install intl

# composer
COPY --from=composer:2.4.1 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_HOME=/composer
RUN composer config -g process-timeout 3600 && \
    composer config -g repos.packagist composer https://packagist.jp

# DB setting
# mysql
RUN docker-php-ext-install pdo_mysql

# other
# apfd
RUN pecl install apfd && \
    docker-php-ext-enable apfd
# GD library
RUN apt-get -qq -y install libfreetype6-dev libjpeg62-turbo-dev libpng-dev && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) gd

# cleaning
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ./docker/php/prod/php.ini /usr/local/etc/php/php.ini
COPY ./api /usr/share/nginx/html/api

RUN composer install -q --optimize-autoloader --no-dev && \
    chmod -R 777 storage bootstrap/cache && \
    php artisan config:cache && \
    php artisan route:cache