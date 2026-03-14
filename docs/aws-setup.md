# AWS Deployment Setup

This document describes the AWS infrastructure required to deploy the Roadblock Remover static site.

## Architecture

```
Next.js build → /out/ static files → S3 Bucket → CloudFront CDN → Users
```

## S3 Bucket

1. **Create bucket**: e.g., `roadblock-remover-prod`
2. **Block all public access**: Yes (access only via CloudFront)
3. **Static website hosting**: Not needed (CloudFront handles this)
4. **Bucket policy**: Grant CloudFront OAI (Origin Access Identity) read access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAI",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity <OAI_ID>"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::roadblock-remover-prod/*"
    }
  ]
}
```

## CloudFront Distribution

### Origin Settings

- **Origin domain**: S3 bucket (use the S3 REST endpoint, not the website endpoint)
- **Origin Access Identity**: Create a new OAI and grant it bucket read access
- **Origin protocol policy**: HTTPS only

### Default Cache Behavior

- **Viewer protocol policy**: Redirect HTTP to HTTPS
- **Compress objects automatically**: Yes
- **Cache policy**: `CachingOptimized` for static assets

### Custom Error Responses (Critical for SPA Routing)

Configure these error responses to enable client-side routing:

| HTTP Error Code | Response Page Path | HTTP Response Code | Error Caching Min TTL |
| --------------- | ------------------ | ------------------ | --------------------- |
| 403             | `/index.html`      | 200                | 0                     |
| 404             | `/index.html`      | 200                | 0                     |

This ensures that direct navigation to any route (e.g., `/dashboard/`, `/roadblocks/?id=xxx`) serves the SPA shell, which then handles routing client-side.

### Default Root Object

Set to `index.html`.

### SSL Certificate

- Request an ACM certificate in `us-east-1` for your domain
- Attach it to the CloudFront distribution

## Deployment

Run the deploy script:

```bash
chmod +x scripts/deploy.sh
S3_BUCKET=roadblock-remover-prod CF_DIST_ID=E1234567890 ./scripts/deploy.sh
```

The script:
1. Builds the Next.js static export (`npm run build` → `/out/`)
2. Syncs the output to S3 (with `--delete` to remove stale files)
3. Invalidates the CloudFront cache

## PocketBase CORS

Ensure your PocketBase instance allows requests from the CloudFront domain. Configure CORS headers either in PocketBase settings or via a reverse proxy in front of PocketBase.
