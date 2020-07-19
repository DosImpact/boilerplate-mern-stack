FROM node:12.14.1

RUN mkdir -p /app
WORKDIR /app
ADD ./ /app


RUN npm install
RUN npm install pm2 -g
RUN npm install prisma -g
RUN npm run build
ENV NODE_ENV=production

RUN cd /app/src/api
RUN find . -name '*.graphql' -exec cp --parents \{\} /app/build/api \;

EXPOSE 4000
#CMD pm2 start ./src/server.js -i max
CMD ["pm2-runtime", "ecosystem.config.js"]