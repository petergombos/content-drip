# Content Drip

Simple email drip subscriptions powered by Next.js.

## Run Locally

```bash
npm install
npm run dev
```

## Cron Endpoint

`GET /api/cron` requires `Authorization: Bearer <CRON_SECRET>`.

Example:

```bash
curl -X GET "http://localhost:3000/api/cron" \
  -H "Authorization: Bearer $CRON_SECRET"
```
