# Production Deployment Guide

## Prerequisites
1. **Server with Public IP** (VPS/Cloud)
   - Ubuntu 22.04+ or similar Linux distribution
   - Minimum: 1GB RAM, 1 CPU core, 20GB storage
   - Providers: DigitalOcean, AWS, Linode, Hetzner

2. **Domain Name** (optional but recommended)
   - Purchase from Namecheap, GoDaddy, Cloudflare
   - Point DNS A record to your server's IP

3. **Server Requirements**
   - Docker installed
   - Docker Compose installed
   - Git installed (to clone your repo)

## Step 1: Prepare Your Server

### Install Docker
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### Configure Firewall
```bash
# Allow SSH (important!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

## Step 2: Deploy Your Application

### Clone Your Repository
```bash
cd /home/$USER
git clone <your-repo-url> bjj-products-store
cd bjj-products-store
```

### Start Production Containers
```bash
# Build and start in detached mode
docker compose -f docker-compose.prod.yml up -d --build

# Check containers are running
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

### Test Your Application
```bash
# Test locally on server
curl http://localhost

# Test from your computer
# Open browser: http://YOUR_SERVER_IP
```

## Step 3: Add HTTPS with Let's Encrypt (Recommended)

### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Stop containers temporarily
```bash
docker compose -f docker-compose.prod.yml down
```

### Get SSL Certificate
```bash
# Replace your-domain.com with your actual domain
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Certificates will be stored in:
# /etc/letsencrypt/live/your-domain.com/
```

### Update docker-compose for SSL
Create `docker-compose.prod-ssl.yml`:
```yaml
version: '3.8'

services:
  db:
    build:
      context: .
      dockerfile: Dockerfile.db
    container_name: bjj-db-prod
    volumes:
      - db-data:/app/data
    networks:
      - bjj-network
    restart: unless-stopped

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    container_name: bjj-api-prod
    volumes:
      - db-data:/app/data
    depends_on:
      - db
    networks:
      - bjj-network
    environment:
      - NODE_ENV=production
      - PORT=4000
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend.prod
    container_name: bjj-frontend-prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./nginx-ssl.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - api
    networks:
      - bjj-network
    restart: unless-stopped

volumes:
  db-data:

networks:
  bjj-network:
    driver: bridge
```

### Update nginx-ssl.conf with your domain
```bash
# Edit nginx-ssl.conf and replace "your-domain.com" with your actual domain
nano nginx-ssl.conf
```

### Start with SSL
```bash
docker compose -f docker-compose.prod-ssl.yml up -d --build

# Your site is now available at:
# https://your-domain.com
```

### Auto-renew SSL Certificate
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically adds cron job for renewal
# Check: sudo systemctl status certbot.timer
```

## Step 4: Maintenance Commands

### View Logs
```bash
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs api
docker compose -f docker-compose.prod.yml logs frontend
```

### Restart Services
```bash
docker compose -f docker-compose.prod.yml restart
docker compose -f docker-compose.prod.yml restart api
```

### Update Application
```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### Backup Database
```bash
# Create backup
docker cp bjj-api-prod:/app/data/products.db ./backup-$(date +%Y%m%d).db

# Restore backup
docker cp ./backup-20260115.db bjj-api-prod:/app/data/products.db
docker compose -f docker-compose.prod.yml restart api
```

### Stop Everything
```bash
docker compose -f docker-compose.prod.yml down
```

### Clean Up (removes data!)
```bash
docker compose -f docker-compose.prod.yml down -v
```

## Step 5: Monitoring & Security

### Check Resource Usage
```bash
docker stats
htop
```

### Enable Automatic Updates (Ubuntu)
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### Set up Log Rotation
Docker handles this automatically, but you can verify:
```bash
docker inspect bjj-api-prod | grep -A 10 LogConfig
```

### Regular Backups
Create a cron job:
```bash
crontab -e

# Add this line for daily backups at 2 AM:
0 2 * * * docker cp bjj-api-prod:/app/data/products.db /home/$USER/backups/db-$(date +\%Y\%m\%d).db
```

## Troubleshooting

### Container won't start
```bash
docker compose -f docker-compose.prod.yml logs
docker ps -a
```

### Port 80/443 already in use
```bash
sudo lsof -i :80
sudo lsof -i :443
# Kill the process using the port
```

### Database issues
```bash
docker exec -it bjj-api-prod sqlite3 data/products.db "SELECT COUNT(*) FROM products;"
```

### Nginx configuration errors
```bash
docker exec bjj-frontend-prod nginx -t
```

## Access Your App
- **HTTP**: `http://YOUR_SERVER_IP` or `http://your-domain.com`
- **HTTPS**: `https://your-domain.com` (after SSL setup)

---

## Quick Commands Reference

```bash
# Start production
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart
docker compose -f docker-compose.prod.yml restart

# Stop
docker compose -f docker-compose.prod.yml down

# Update code
git pull && docker compose -f docker-compose.prod.yml up -d --build
```
