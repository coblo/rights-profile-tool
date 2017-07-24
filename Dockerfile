FROM alpine:3.5
RUN apk --no-cache add nodejs-lts git php5-cli php5-curl php5-phar php5-json php5-openssl php5-zlib php5-dom
COPY . /opt/app
RUN cd /opt/app && npm --silent run live-setup
RUN find /opt/app/vendor -name .git -type d -print0 | xargs -0 rm -rf

FROM alpine:3.5
RUN apk --no-cache add php5-fpm php5-curl php5-json php5-openssl php5-mysqli php5-dom php5-ctype php5-zlib ca-certificates openssl
RUN wget -O - "https://caddyserver.com/download/linux/amd64" | tar --no-same-owner -C /usr/bin/ -xz caddy
COPY --from=0 /opt/app /opt/app
RUN echo -e "0.0.0.0:80\nfastcgi / 127.0.0.1:9000 php\nstartup php-fpm\nerrors stdout\nroot /opt/app" > /etc/Caddyfile
EXPOSE 80
# This must be given in array form, otherwise caddy isn't shut down properly on docker-compose down:
CMD ["caddy", "--conf", "/etc/Caddyfile", "--log", "stdout"]
