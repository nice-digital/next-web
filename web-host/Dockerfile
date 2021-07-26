FROM keymetrics/pm2:14-alpine

EXPOSE 8092

# We assume the app itself is mounted into /web as a volume at run time,
# so that the ecosystem pwd folder points to the correct place
COPY pm2.ecosystem.json .

CMD ["pm2-runtime", "start", "pm2.ecosystem.json", "--env", "production"]
