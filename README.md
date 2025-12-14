# Penthu Landing Page - Server-Side Rendering

Landing page احترافية لتطبيق Penthu الصحي مع Server-Side Rendering للحماية الكاملة.

## 🎯 Features

- ✅ **Server-Side Rendering** - حماية 100% للكود
- ✅ **HTMX Integration** - تفاعلية بدون JavaScript مخصص
- ✅ **Jinja2 Templates** - قوالب ديناميكية
- ✅ **Session Management** - إشعارات آمنة
- ✅ **Security Headers** - HSTS, CSP, CORS
- ✅ **Rate Limiting** - حماية من الهجمات
- ✅ **Responsive Design** - متجاوب على جميع الأجهزة

## 🏗️ Architecture

```
Browser → HTMX Request → FastAPI Server
                             ↓
                        Jinja2 Template
                             ↓
              HTML Response (No custom JS!)
```

## 📂 Project Structure

```
landing_page/
├── templates/          # Jinja2 Templates
│   ├── base.html      # Base template
│   ├── index.html     # Main page
│   └── partials/
│       └── notification.html
├── css/
│   └── style.css      # Styles
├── assets/            # Images, APK file
├── main.py            # FastAPI Server
└── requirements.txt   # Dependencies
```

## 🚀 Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run Server

```bash
python main.py
```

Server will start on: `http://localhost:8000`

## 📦 Dependencies

- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Jinja2** - Template engine
- **SlowAPI** - Rate limiting
- **itsdangerous** - Session security

## 🔒 Security Features

1. **Server-Side Rendering** - No exposed JavaScript logic
2. **Rate Limiting** - 20 requests/minute
3. **CORS Protection** - Cross-origin request filtering
4. **Security Headers**:
   - Content-Security-Policy
   - X-Frame-Options
   - HSTS (Strict-Transport-Security)
   - X-Content-Type-Options
5. **Session Management** - Secure notifications
6. **Request Size Limit** - Max 1MB

## 🎨 Responsive Design

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 📱 Download Functionality

- Direct APK download
- Store availability notifications (App Store/Google Play)
- Server-side download logic
- Session-based success messages

## 🛠️ Deployment

### Environment Variables

```bash
PORT=8000                              # Server port
SESSION_SECRET="your-secret-key"       # Session encryption key
```

### Railway Deployment

1. Push to GitHub
2. Connect to Railway
3. Set environment variables
4. Deploy

### Manual Deployment

```bash
# Production mode
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 📝 License

© 2025 Penthu. All rights reserved.

## 📧 Contact

- Email: support@penthu.com
- Website: https://penthu.com

---

Made with ❤️ using FastAPI + Jinja2 + HTMX
