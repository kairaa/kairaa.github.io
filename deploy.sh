#!/bin/bash

# Kaira Blog Deployment Script
# Usage: ./deploy.sh [local|production|staging]

set -e

ENV=${1:-local}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Deploying Kaira Blog to $ENV environment..."

case $ENV in
  "local")
    echo "📦 Building and running locally..."
    
    # Stop existing containers
    docker compose down 2>/dev/null || true
    
    # Build and run with docker-compose
    NEXT_PUBLIC_USE_MOCK_DATA=true docker compose up --build -d
    
    echo "⏳ Waiting for application to start..."
    sleep 10
    
    # Test health endpoint
    echo "🏥 Testing health endpoint..."
    curl -f http://localhost:3000/api/health || {
      echo "❌ Health check failed"
      docker compose logs
      exit 1
    }
    
    echo "✅ Local deployment successful!"
    echo "🌐 Visit: http://localhost:3000"
    echo "📊 Health: http://localhost:3000/api/health"
    echo "📝 Logs: docker compose logs -f"
    ;;
    
  "staging")
    echo "🏗️ Building for staging..."
    
    # Build with staging configuration
    docker build -t kaira-blog:staging \
      --build-arg NEXT_PUBLIC_API_URL="" \
      --build-arg NEXT_PUBLIC_USE_MOCK_DATA="true" \
      .
    
    echo "✅ Staging build complete!"
    echo "🚀 Push to registry: docker push kaira-blog:staging"
    ;;
    
  "production")
    echo "🏭 Building for production..."
    
    # Check required environment variables
    if [[ -z "$NEXT_PUBLIC_API_URL" || -z "$NEXT_PUBLIC_API_TOKEN" ]]; then
      echo "❌ Missing required environment variables:"
      echo "   NEXT_PUBLIC_API_URL"
      echo "   NEXT_PUBLIC_API_TOKEN"
      exit 1
    fi
    
    # Build with production configuration
    docker build -t kaira-blog:latest \
      --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
      --build-arg NEXT_PUBLIC_USE_MOCK_DATA="false" \
      .
    
    echo "✅ Production build complete!"
    echo "🚀 Push to registry: docker push kaira-blog:latest"
    ;;
    
  *)
    echo "❌ Invalid environment: $ENV"
    echo "Usage: $0 [local|production|staging]"
    exit 1
    ;;
esac

echo "🎉 Deployment completed!"
