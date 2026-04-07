#!/usr/bin/env bash
# ── CFI EC2 Bootstrap — Amazon Linux 2023 ────────────────────────────────────
# Usage: DOMAIN=your-domain.com bash deploy.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DOMAIN="${DOMAIN:-YOUR_DOMAIN.com}"
APP_DIR="$HOME/app"

echo "==> Updating system packages"
sudo dnf update -y

echo "==> Installing Node 20"
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
fi

echo "==> Installing nginx & PM2"
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo npm install -g pm2

echo "==> Preparing App Directory"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ -f "package.json" ]; then
    echo "==> Installing Node dependencies"
    npm install --omit=dev
else
    echo "!! Warning: package.json not found in $APP_DIR"
fi

if [ ! -d "dist" ]; then
    echo "==> Dist folder not found, attempting build..."
    npm run build || echo "Build failed or no build script found."
fi

echo "==> Configuring nginx"
if [ -f "$APP_DIR/nginx.conf" ]; then
    sudo sed "s/YOUR_DOMAIN.com/$DOMAIN/g" "$APP_DIR/nginx.conf" \
      | sudo tee /etc/nginx/conf.d/cfi.conf > /dev/null
    sudo rm -f /etc/nginx/conf.d/default.conf
    sudo nginx -t && sudo systemctl restart nginx
else
    echo "!! Warning: nginx.conf not found in $APP_DIR"
fi

echo "==> Starting API server with PM2"
if [ -f "ecosystem.config.cjs" ] || [ -f "server.js" ]; then
    pm2 delete cfi-api 2>/dev/null || true
    if [ -f "ecosystem.config.cjs" ]; then
        pm2 start ecosystem.config.cjs
    else
        pm2 start server.js --name cfi-api
    fi
    pm2 save
    sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user
else
    echo "!! Warning: No entry point (ecosystem or server.js) found for PM2"
fi

echo ""
echo "======================================================"
echo "   Deploy complete for $DOMAIN!"
echo "======================================================"