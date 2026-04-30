# Sote Dev Log

## Session 1 — 29 April 2026

### What was built
- Created GitHub repo: github.com/subzero555/sote
- Set up PostgreSQL database `sote` on 192.168.1.165
- Built full Express API (`apps/api`) on port 4001
  - Auth routes: request-otp, verify-otp, profile, me
  - Listings routes: GET feed, GET stats, GET by id, POST, DELETE
  - Prisma schema: User, Otp, Listing, Exchange, Review, SafeSpot
- Scaffolded Next.js 16 web app (`apps/web`) on port 3001
  - Feed page with mode filter and stats strip
  - BottomNav, TopBar, ListingCard components
  - lib/api.ts for API communication

### Blocked
- SWC binary download failing on current network
- Fix: `npm install @next/swc-win32-x64-msvc --save-dev` on better internet

### Server setup (pending)
- NGINX config created at /etc/nginx/sites-available/sote
- PM2 ecosystem.config.js created for both api and web
- Deploy script at /opt/sote/deploy.sh
- DNS: add A record sote.kenyaproductindex.co.ke → server IP

### Next steps
1. Get better internet → install SWC → test frontend locally
2. SSH into server → clone repo → npm install → pm2 start
3. Build auth pages (phone OTP signup)
4. Build post listing page
5. Build listing detail page