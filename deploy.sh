#!/usr/bin/env bash
# ── CFI EC2 Bootstrap — Amazon Linux 2023 ────────────────────────────────────
# Usage: DOMAIN=your-domain.com bash deploy.sh
# Run once on a fresh t3.micro. Safe to re-run (idempotent).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DOMAIN="${DOMAIN:-YOUR_DOMAIN.com}"
APP_DIR="$HOME/app"
NODE_PORT=3001

echo "==> Updating system packages"
sudo dnf update -y

echo "==> Installing Node 20"
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

echo "==> Installing nginx"
sudo dnf install -y nginx
sudo systemctl enable nginx

echo "==> Installing certbot via pip"
sudo dnf install -y python3-pip augeas-libs
sudo python3 -m venv /opt/certbot
sudo /opt/certbot/bin/pip install --quiet certbot certbot-nginx
sudo ln -sf /opt/certbot/bin/certbot /usr/bin/certbot

echo "==> Installing PM2"
sudo npm install -g pm2

echo "==> Installing Node dependencies"
cd "$APP_DIR"
npm install --omit=dev

echo "==> Building React app"
npm run build

echo "==> Configuring nginx"
sudo sed "s/YOUR_DOMAIN.com/$DOMAIN/g" "$APP_DIR/nginx.conf" \
  | sudo tee /etc/nginx/conf.d/cfi.conf > /dev/null
sudo rm -f /etc/nginx/conf.d/default.conf
sudo nginx -t
sudo systemctl restart nginx

echo "==> Starting API server with PM2"
cd "$APP_DIR"
pm2 delete cfi-api 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

echo ""
echo "======================================================"
echo "  Deploy complete!"
echo "  App serving on http://$DOMAIN"
echo ""
echo "  REQUIRED — upload your .env file first:"
echo "    scp .env ec2-user@<EC2-IP>:$APP_DIR/.env"
echo ""
echo "  THEN enable HTTPS (after DNS A record is set):"
echo "    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "    pm2 restart cfi-api"
echo "======================================================"
