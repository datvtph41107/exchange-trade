# Stage 1: Build
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "start"]
