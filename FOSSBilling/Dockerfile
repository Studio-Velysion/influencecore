FROM php:8.3-apache

RUN a2enmod rewrite headers

# PHP extensions (PostgreSQL + common deps)
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libpq-dev \
    libzip-dev \
    unzip \
  && docker-php-ext-install pdo_pgsql pgsql \
  && docker-php-ext-install zip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copy source (vendor is already included in this repo snapshot)
COPY . /var/www/html

# Apache: allow .htaccess overrides (FOSSBilling uses rewrite)
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

EXPOSE 80


