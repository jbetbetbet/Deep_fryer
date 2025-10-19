FROM php:7.4-fpm

# system deps for common extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl zip unzip libzip-dev libonig-dev libxml2-dev \
      && rm -rf /var/lib/apt/lists/*

# PHP extensions you likely need; add as desired
RUN docker-php-ext-install -j$(nproc) mbstring zip pdo pdo_mysql

# ---- ionCube loader ----
# 1) Download the proper loader tarball locally and drop the .so here:
#    web/php74/ioncube/ioncube_loader_lin_7.4.so
# (We avoid downloading in the Dockerfile to keep it deterministic.)
COPY ioncube/ioncube_loader_lin_7.4.so /usr/local/lib/php/extensions/no-debug-non-zts-20190902/ioncube_loader_lin_7.4.so

# Enable ionCube
RUN echo "zend_extension=/usr/local/lib/php/extensions/no-debug-non-zts-20190902/ioncube_loader_lin_7.4.so" \
      > /usr/local/etc/php/conf.d/00-ioncube.ini

# Trust deep-fryer CA inside the image.
# Copy the CA cert file from your mitm folder into the build context before building.
# Put a copy here as web/php74/mitmproxy-ca-cert.pem
COPY mitmproxy-ca-cert.pem /etc/ssl/certs/mitmproxy-ca.crt
RUN chmod 0644 /etc/ssl/certs/mitmproxy-ca.crt && update-ca-certificates || true

# PHP settings (curl.cainfo & openssl.cafile point to the CA)
COPY php.ini /usr/local/etc/php/conf.d/zz-custom.ini

WORKDIR /var/www
