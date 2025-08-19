# 1. Build the React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock
COPY package*.json ./
# If using yarn, also:
# COPY yarn.lock ./

# Install dependencies
RUN yarn install
# Or, if using yarn:
# RUN yarn install

# Copy the rest of the source code
COPY . .

# Build the app
RUN yarn build:prod
# Or, if using yarn:
# RUN yarn build

# 2. Serve with Nginx
FROM nginx:alpine

# Copy React build from previous stage
COPY --from=build /app/dist-prod /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]