# Nuach-Client

### Deploy

```
  chmod +x deploy.sh
  ./deploy.sh
```

### Run locally with docker:

```
  docker build -t nuach .
  docker run -p 7700:7700 nuach
```

### .env

```
  DEV_SERVER_URL=http://localhost:8080
  PROD_SERVER_URL
  NEXT_PUBLIC_NUACH_ENV=dev
```
