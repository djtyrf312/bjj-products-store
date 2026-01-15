#!/bin/bash

# VPS Initial Setup Script for BJJ Products Store
# Run this on your fresh Ubuntu server

echo "=========================================="
echo "Starting VPS Setup..."
echo "=========================================="

# Update system
echo "Step 1: Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "Step 2: Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "Step 3: Installing Docker Compose..."
sudo apt install docker-compose-plugin -y

# Install Git
echo "Step 4: Installing Git..."
sudo apt install git -y

# Configure Firewall
echo "Step 5: Configuring Firewall..."
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw --force enable

# Verify installations
echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
docker --version
docker compose version
git --version

echo ""
echo "Next steps:"
echo "1. Logout and login again: exit"
echo "2. ssh root@YOUR_SERVER_IP"
echo "3. Clone your repo: git clone YOUR_REPO_URL bjj-store"
echo "4. cd bjj-store"
echo "5. npm run docker:prod"
echo ""
echo "Your app will be available at: http://YOUR_SERVER_IP:8080"
