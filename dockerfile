FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm i

FROM build AS production
COPY . .
RUN npm run build:prod

FROM nginx:alpine as prod-runtime
COPY --from=production /app/dist/bonprof/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
