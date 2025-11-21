# Nginx API Gateway Configuration for Core Banking System

## Overview
This document provides the complete Nginx configuration for the CBS API Gateway, including load balancing, SSL, rate limiting, and security headers.

## Complete Nginx Configuration

### Main Configuration File: `/etc/nginx/nginx.conf`

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    log_format api_log '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_referer" "$http_user_agent" '
                       'request_time=$request_time '
                       'upstream_response_time=$upstream_response_time';

    access_log /var/log/nginx/access.log api_log;

    # Performance Optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # Buffer Size
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 16k;
    output_buffers 1 32k;
    postpone_output 1460;

    # Rate Limiting Zones
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=report_limit:10m rate=20r/m;
    limit_req_zone $binary_remote_addr zone=transaction_limit:10m rate=50r/m;

    # Connection Limiting
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Include virtual host configs
    include /etc/nginx/conf.d/*.conf;
}
```

---

## API Gateway Configuration: `/etc/nginx/conf.d/cbs-api.conf`

```nginx
# Django Backend Upstream
upstream django_backend {
    least_conn;
    server 127.0.0.1:8000 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:8001 weight=1 max_fails=3 fail_timeout=30s backup;
    keepalive 32;
}

# Microservices Upstreams
upstream customer_service {
    server 127.0.0.1:8010;
}

upstream transaction_service {
    server 127.0.0.1:8020;
}

upstream loan_service {
    server 127.0.0.1:8030;
}

upstream report_service {
    server 127.0.0.1:8040;
}

# HTTP Server (Redirect to HTTPS in production)
server {
    listen 80;
    server_name api.corebank.local localhost;

    # For SSL certificate verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all HTTP to HTTPS (uncomment in production)
    # return 301 https://$server_name$request_uri;

    # Development: Allow HTTP
    include /etc/nginx/conf.d/api-locations.conf;
}

# HTTPS Server (Production)
server {
    listen 443 ssl http2;
    server_name api.corebank.local;

    # SSL Certificates (Update paths)
    ssl_certificate /etc/nginx/ssl/corebank.crt;
    ssl_certificate_key /etc/nginx/ssl/corebank.key;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Include API locations
    include /etc/nginx/conf.d/api-locations.conf;
}
```

---

## API Locations: `/etc/nginx/conf.d/api-locations.conf`

```nginx
# Health Check
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}

# Authentication APIs (Rate Limited)
location /api/auth/ {
    limit_req zone=login_limit burst=10 nodelay;
    limit_conn addr 10;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Customer Service APIs
location /api/customers {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://customer_service;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Account Management APIs
location /api/accounts {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Transaction APIs
location /api/transactions {
    limit_req zone=transaction_limit burst=30 nodelay;

    proxy_pass http://transaction_service;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Transfer APIs
location /api/transfers {
    limit_req zone=transaction_limit burst=20 nodelay;

    proxy_pass http://transaction_service;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Loan APIs
location /api/loans {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://loan_service;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Fixed Deposit APIs
location /api/fixed-deposits {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Recurring Deposit APIs
location /api/recurring-deposits {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# SIP APIs
location /api/sip {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Forex APIs
location /api/forex {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# NFT APIs
location /api/nft {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Teller APIs
location /api/teller {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Approval APIs
location /api/approvals {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Report APIs (Separate limit)
location /api/reports {
    limit_req zone=report_limit burst=10 nodelay;

    proxy_pass http://report_service;
    include /etc/nginx/conf.d/proxy-params.conf;

    # Larger timeout for reports
    proxy_read_timeout 120s;
}

# User Management APIs
location /api/users {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Branch APIs
location /api/branches {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Audit APIs
location /api/audit {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Settings APIs
location /api/settings {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Catch-all for other API routes
location /api/ {
    limit_req zone=api_limit burst=20 nodelay;

    proxy_pass http://django_backend;
    include /etc/nginx/conf.d/proxy-params.conf;
}

# Static files (if needed)
location /static/ {
    alias /var/www/cbs/static/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Media files
location /media/ {
    alias /var/www/cbs/media/;
    expires 30d;
    add_header Cache-Control "public";
}
```

---

## Proxy Parameters: `/etc/nginx/conf.d/proxy-params.conf`

```nginx
# Proxy Headers
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Port $server_port;

# WebSocket Support
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";

# Timeouts
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;

# Buffering
proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 8 4k;
proxy_busy_buffers_size 8k;

# CORS Headers
add_header 'Access-Control-Allow-Origin' '*' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-Requested-With' always;
add_header 'Access-Control-Max-Age' 1728000 always;

# Handle OPTIONS preflight
if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-Requested-With';
    add_header 'Access-Control-Max-Age' 1728000;
    add_header 'Content-Type' 'text/plain charset=UTF-8';
    add_header 'Content-Length' 0;
    return 204;
}
```

---

## Installation and Setup

### 1. Install Nginx (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Install Nginx (CentOS/RHEL)
```bash
sudo yum install epel-release
sudo yum install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. Copy Configuration Files
```bash
# Backup existing config
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Copy new configurations
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo cp cbs-api.conf /etc/nginx/conf.d/
sudo cp api-locations.conf /etc/nginx/conf.d/
sudo cp proxy-params.conf /etc/nginx/conf.d/
```

### 4. Test Configuration
```bash
sudo nginx -t
```

### 5. Reload Nginx
```bash
sudo systemctl reload nginx
```

---

## SSL Certificate Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d api.corebank.local

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Monitoring and Logs

### View Access Logs
```bash
sudo tail -f /var/log/nginx/access.log
```

### View Error Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check Nginx Status
```bash
sudo systemctl status nginx
```

---

## Performance Tuning

### For High Traffic
```nginx
worker_processes auto;
worker_connections 4096;
keepalive_timeout 30;
keepalive_requests 100;
```

### Enable HTTP/2
```nginx
listen 443 ssl http2;
```

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Keep Nginx updated**
3. **Configure firewall rules**
4. **Use rate limiting**
5. **Monitor logs regularly**
6. **Disable unused modules**
7. **Set proper file permissions**

```bash
# Set permissions
sudo chmod 644 /etc/nginx/nginx.conf
sudo chmod 644 /etc/nginx/conf.d/*.conf
```

---

## Troubleshooting

### Check if port is in use
```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

### Test upstream connection
```bash
curl http://localhost:8000/health
```

### Debug mode
```nginx
error_log /var/log/nginx/error.log debug;
```

---

## Docker Compose Integration

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./conf.d:/etc/nginx/conf.d:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - django_backend
    restart: unless-stopped

  django_backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.production
    restart: unless-stopped
```

---

## Support
For Nginx configuration support: devops@corebank.local
