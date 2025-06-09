# Production Deployment Checklist

## ✅ Pre-Deployment Verification

### Environment Configuration
- [ ] Copy `.env.example` to `.env` and configure all variables
- [ ] Set `NODE_ENV=production` in production environment
- [ ] Configure `NEXT_PUBLIC_API_URL` for production API endpoint
- [ ] Set `NEXT_PUBLIC_USE_MOCK_DATA=false` for production

### Security
- [ ] Review and update API tokens
- [ ] Ensure secure communication (HTTPS) is configured
- [ ] Verify CORS settings for production domain
- [ ] Check firewall rules for Docker port (3000)

### Docker Setup
- [ ] Verify Docker and docker-compose are installed on target server
- [ ] Test Docker build locally: `docker build -t kaira-blog .`
- [ ] Verify docker-compose configuration
- [ ] Test deployment script: `./deploy.sh`

## 🚀 Deployment Commands

### Quick Deployment
```bash
# Use the automated deployment script
./deploy.sh
```

### Manual Deployment
```bash
# Build and start with docker-compose
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

### Health Check
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

## 🔧 Troubleshooting

### Common Issues
1. **Port 3000 already in use**
   ```bash
   # Find and kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Container fails to start**
   ```bash
   # Check logs for errors
   docker-compose logs
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Permission issues**
   ```bash
   # Make deploy script executable
   chmod +x deploy.sh
   
   # Fix Docker permissions (Linux)
   sudo usermod -aG docker $USER
   ```

## 📊 Monitoring

### Container Status
```bash
# Check running containers
docker ps

# Monitor resource usage
docker stats

# Check container health
docker inspect kaira-blog | grep Health -A 5
```

### Application Monitoring
- Health endpoint: `http://localhost:3000/api/health`
- Application logs: `docker-compose logs -f`
- Performance monitoring: Consider adding tools like PM2 or monitoring services

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
./deploy.sh
```

### Backup Considerations
- Backup environment configuration files
- Consider container volume backups if using persistent data
- Document restore procedures

## 📝 Notes
- Default port: 3000 (configurable via DOCKER_PORT environment variable)
- Health check endpoint: `/api/health`
- Container runs as non-root user for security
- Uses multi-stage build for optimized image size
