# Node.js on AWS EC2 – Practice Project

## 1. Test locally
```bash
npm install
npm start
# open http://localhost:3000
```

## 2. Launch an EC2 instance
- AMI: Ubuntu 24.04 LTS
- Type: t2.micro / t3.micro (free tier)
- Create a key pair and download the `.pem` file
- Security group inbound rules:
  - SSH (22) – My IP
  - Custom TCP (3000) – 0.0.0.0/0   (or HTTP 80 if using Nginx)

## 3. Connect via SSH
```bash
chmod 400 my-key.pem
ssh -i my-key.pem ubuntu@<EC2_PUBLIC_IP>
```

## 4. Install Node.js on the server
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
node -v && npm -v
```

## 5. Get the code onto the server
Option A – Git (recommended):
```bash
git clone https://github.com/<you>/node-ec2-demo.git
cd node-ec2-demo
```
Option B – copy from your computer:
```bash
scp -i my-key.pem -r node-ec2-demo ubuntu@<EC2_PUBLIC_IP>:~/
```

## 6. Run it
```bash
npm install --omit=dev
npm start
```
Visit `http://<EC2_PUBLIC_IP>:3000`

## 7. Keep it running with PM2
```bash
sudo npm install -g pm2
pm2 start server.js --name node-app
pm2 save
pm2 startup        # run the command it prints
pm2 logs node-app
```

## 8. (Optional) Nginx reverse proxy on port 80
```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/default
```
Replace the `location /` block with:
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```
Then:
```bash
sudo nginx -t && sudo systemctl restart nginx
```
Open port 80 in the security group and visit `http://<EC2_PUBLIC_IP>`.

## Next things to practice
- Add a domain with Route 53 + HTTPS via Let's Encrypt (certbot)
- Automate deploys with GitHub Actions
- Containerize with Docker
- Put it behind an Application Load Balancer
