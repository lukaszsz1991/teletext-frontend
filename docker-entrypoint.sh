#!/bin/sh
set -e

: "${BACKEND_URL:?BACKEND_URL is required}"

envsubst '${BACKEND_URL}' \
  < /etc/nginx/templates/nginx.conf.template \
  > /etc/nginx/nginx.conf

exec "$@"
