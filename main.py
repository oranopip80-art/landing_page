from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse, Response
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os

# Initialize Limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize App
app = FastAPI()

# Add Session Middleware (MUST be before other middlewares)
app.add_middleware(
    SessionMiddleware,
    secret_key="penthu-secret-key-change-in-production-2025"
)

# Add Rate Limiter to App
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Initialize Jinja2 Templates
templates = Jinja2Templates(directory="templates")

# 1. Security: CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific domains in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "HEAD"],
    allow_headers=["*"],
    max_age=3600,
)

# 2. Security: Trusted Host Middleware
app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["*"]
)

# 3. Security: Request Size Limit Middleware
class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.headers.get("content-length"):
            content_length = int(request.headers["content-length"])
            if content_length > 1_000_000:  # 1MB
                return Response(status_code=413, content="Request too large")
        response = await call_next(request)
        return response

app.add_middleware(RequestSizeLimitMiddleware)

# 4. Security: Custom Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://unpkg.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https:; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
        )
        return response

app.add_middleware(SecurityHeadersMiddleware)

# Mount Static Files
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

# Helper: Set Notification in Session
def set_notification(request: Request, type: str, title: str, message: str):
    request.session['notification'] = {
        'type': type,
        'title': title,
        'message': message
    }

# Helper: Get Notification from Session
def get_notification(request: Request):
    return request.session.pop('notification', None)

# Serve Main Page with SSR
@app.get("/", response_class=HTMLResponse)
@limiter.limit("20/minute")
async def index(request: Request):
    notification = get_notification(request)
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "notification": notification}
    )

# Download Endpoint (Server-Side Logic)
@app.post("/download")
@limiter.limit("10/minute")
async def download_app(request: Request):
    # Set success notification
    set_notification(
        request,
        "info",
        "جاري التحميل...",
        "سيبدأ تحميل التطبيق خلال لحظات"
    )
    
    # Return file for download
    file_path = "assets/penthu_app.apk"
    
    if os.path.exists(file_path):
        # Get notification HTML
        notification = get_notification(request)
        notification_html = templates.TemplateResponse(
            "partials/notification.html",
            {"request": request, "notification": notification}
        ).body.decode()
        
        # Set success notification for after download
        set_notification(
            request,
            "success",
            "تم بدء التحميل! 🎉",
            "افتح الملف بعد التحميل لتثبيت التطبيق"
        )
        
        # Return notification HTML with download trigger
        return HTMLResponse(
            content=f"""
            {notification_html}
            <script>
                // Trigger download
                const link = document.createElement('a');
                link.href = '/assets/penthu_app.apk';
                link.download = 'Penthu-v3.5.7.apk';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success notification after delay
                setTimeout(() => {{
                    htmx.ajax('GET', '/notification', {{target: '#notification-container'}});
                }}, 1000);
            </script>
            """
        )
    else:
        set_notification(
            request,
            "warning",
            "تنبيه",
            "الملف غير متوفر حالياً. يرجى المحاولة لاحقاً."
        )
        notification = get_notification(request)
        return templates.TemplateResponse(
            "partials/notification.html",
            {"request": request, "notification": notification}
        )

# Store Not Available Endpoints
@app.post("/store/{store_name}")
@limiter.limit("10/minute")
async def store_not_available(request: Request, store_name: str):
    store_names = {
        "appstore": "App Store",
        "playstore": "Google Play"
    }
    
    display_name = store_names.get(store_name, "المتجر")
    
    set_notification(
        request,
        "info",
        f"{display_name} - قريباً! 🚀",
        f"التطبيق غير متوفر على {display_name} حالياً. يمكنك التحميل المباشر للـ APK."
    )
    
    notification = get_notification(request)
    return templates.TemplateResponse(
        "partials/notification.html",
        {"request": request, "notification": notification}
    )

# Get Notification (for HTMX polling)
@app.get("/notification")
async def notification_endpoint(request: Request):
    notification = get_notification(request)
    return templates.TemplateResponse(
        "partials/notification.html",
        {"request": request, "notification": notification}
    )

# Health check
@app.get("/health")
async def health_check():
    return {"status": "ok", "ssr": "enabled"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
