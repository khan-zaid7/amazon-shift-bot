
# stage 1: base
FROM node:22-alpine AS base 

WORKDIR /app

COPY ./package*.json ./


# stage 2: dependencies 
FROM base AS dependencies 

# run the clean install for production
RUN npm ci --omit=dev 

# stage 3: build 
FROM base AS build 

# run the npm clean install with all modules
RUN npm ci 

# copy the entire project directory into /app 
COPY . .

# stage 4: Production 
FROM node:22-alpine

WORKDIR /app

RUN mkdir -p /app/db && chown -R node:node /app/db

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/package*.json ./
COPY --from=build /app/knexfile.js ./

EXPOSE 3000 

USER node

CMD ["node", "src/server.js"]







