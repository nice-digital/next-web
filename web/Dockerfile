FROM node:18-alpine AS dummy-next
# Create a dummy .next in case it doesn't exist
RUN mkdir -p /tmp/.next

FROM node:18-alpine

# Create app directory
RUN mkdir -p /next-web

# Copy package files
COPY package.json /next-web
COPY package-lock.json /next-web

WORKDIR /next-web

# Install curl (needed for some build scripts)
RUN apk --no-cache add curl

# Install dependencies quietly
RUN npm ci --no-audit --quiet

# Copy the built Next.js app
# If .next exists, it will overwrite the dummy; if not, the dummy ensures the build doesn't fail
COPY --from=dummy-next /tmp/.next /next-web/.next
COPY ./public /next-web/public
COPY ./config /next-web/config
COPY ./next.config.js /next-web/next.config.js

# Start the app
CMD ["npm", "run", "host"]
