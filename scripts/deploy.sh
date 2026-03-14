#!/bin/bash
set -euo pipefail

# Roadblock Remover — Deploy to AWS S3 + CloudFront
#
# Required env vars:
#   S3_BUCKET       — S3 bucket name (e.g., roadblock-remover-prod)
#   CF_DIST_ID      — CloudFront distribution ID
#
# Usage:
#   S3_BUCKET=my-bucket CF_DIST_ID=E1234567890 ./scripts/deploy.sh

if [ -z "${S3_BUCKET:-}" ]; then
  echo "Error: S3_BUCKET is not set"
  exit 1
fi

if [ -z "${CF_DIST_ID:-}" ]; then
  echo "Error: CF_DIST_ID is not set"
  exit 1
fi

echo "Building Next.js static export..."
bun run build

echo "Syncing to S3 bucket: $S3_BUCKET"
aws s3 sync out/ "s3://${S3_BUCKET}" --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$CF_DIST_ID" \
  --paths "/*"

echo "Deploy complete!"
