# build environment
FROM node:16-alpine as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn ui build

# server environment
FROM nginx:alpine

COPY --from=react-build /app/ui-mgr/nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=react-build /app/ui-mgr/build /usr/share/nginx/html

ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"