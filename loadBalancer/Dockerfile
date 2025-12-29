FROM node:18-alpine
WORKDIR /app
COPY loadBalancer.js .
RUN npm install express
CMD ["node", "loadBalancer.js"]
