FROM node:20-alpine

WORKDIR /app
COPY web/ web/
COPY index.html maintenance.html styles.css script.js logo.webp ./
COPY assets/ assets/

ENV PORT=3000
EXPOSE 3000
CMD ["node", "web/server.js"]