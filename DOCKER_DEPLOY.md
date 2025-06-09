# Docker Deploy Rehberi

## 🚀 Sunucu Kurulumu

### 1. Sunucuda Docker Kurulumu
```bash
# Docker kurulumu (Ubuntu/Debian)
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker

# Kullanıcıyı docker grubuna ekle
sudo usermod -aG docker $USER
# Logout/login gerekli
```

### 2. Sunucuda Klasör Yapısı
```bash
# Uygulama klasörü oluştur
sudo mkdir -p /opt/kaira-blog
sudo chown $USER:$USER /opt/kaira-blog
cd /opt/kaira-blog

# Docker compose dosyasını kopyala
scp docker-compose.yml user@server:/opt/kaira-blog/
```

### 3. GitHub Secrets Ayarları

Repository Settings > Secrets and variables > Actions > New repository secret:

```
SERVER_HOST=your-server-ip-or-domain
SERVER_USER=your-ssh-username
SERVER_SSH_KEY=your-private-ssh-key
SERVER_PORT=22
NEXT_PUBLIC_API_TOKEN=your-api-token
NEXT_PUBLIC_API_URL=https://gw.kaira.me/api
NEXT_PUBLIC_USE_MOCK_DATA=false
DOCKER_USERNAME=optional-docker-hub-username
DOCKER_PASSWORD=optional-docker-hub-password
```

### 4. SSH Key Kurulumu
```bash
# Local makinede key oluştur
ssh-keygen -t rsa -b 4096 -C "deploy@kaira.me"

# Public key'i sunucuya kopyala
ssh-copy-id -i ~/.ssh/id_rsa.pub user@server

# Private key'i GitHub Secrets'a ekle
cat ~/.ssh/id_rsa
```

### 5. Nginx Reverse Proxy (Opsiyonel)
```nginx
# /etc/nginx/sites-available/kaira.me
server {
    listen 80;
    server_name kaira.me www.kaira.me;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. SSL Sertifikası (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d kaira.me -d www.kaira.me
```

## 📊 Monitoring

### Docker Container Durumu
```bash
# Container'ları listele
docker ps

# Logları görüntüle
docker-compose logs -f blog

# Resource kullanımı
docker stats
```

### System Monitoring
```bash
# RAM kullanımı
free -h

# CPU kullanımı
htop

# Disk kullanımı
df -h
```

## 🔧 Troubleshooting

### Build Hatası
```bash
# Manuel build test
docker build -t kaira-blog:test .
docker run -p 3000:3000 kaira-blog:test
```

### Container Restart
```bash
cd /opt/kaira-blog
docker-compose restart blog
```

### Logs Kontrolü
```bash
# Application logs
docker-compose logs blog

# System logs
journalctl -u docker.service
```

## 🚀 İlk Deploy

1. **GitHub'a push yap:**
   ```bash
   git add .
   git commit -m "Add Docker deployment"
   git push origin main
   ```

2. **GitHub Actions'ı takip et:**
   - Repository > Actions sekmesi
   - "Deploy Blog to Server" workflow'unu izle

3. **Sonucu kontrol et:**
   ```bash
   curl http://your-server-ip:3000/api/health
   ```

## 🎯 Performans Optimizasyonu

### Memory Limits
```yaml
# docker-compose.yml
services:
  blog:
    mem_limit: 512m
    mem_reservation: 256m
```

### Log Rotation
```yaml
# docker-compose.yml
services:
  blog:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```
