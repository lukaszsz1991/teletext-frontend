#!/bin/sh
set -e

: "${BACKEND_URL:?BACKEND_URL is required}"
: "${REACT_APP_API_URL:?REACT_APP_API_URL is required}"

envsubst '${BACKEND_URL}' \
  < /etc/nginx/templates/nginx.conf.template \
  > /etc/nginx/nginx.conf

envsubst '${REACT_APP_API_URL}' \
  < /usr/share/nginx/html/env.template.js \
  > /usr/share/nginx/html/env.js

exec "$@"
