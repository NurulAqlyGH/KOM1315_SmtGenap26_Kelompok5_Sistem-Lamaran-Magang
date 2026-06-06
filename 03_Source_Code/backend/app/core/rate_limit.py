import time
from collections import defaultdict

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

RATE_LIMIT_REQUESTS_PER_MINUTE = 60
RATE_LIMIT_WINDOW_SECONDS = 60
RATE_LIMIT_EXEMPT_PATHS = ("/", "/docs", "/openapi.json", "/redoc")

# In-memory bucket per client IP + path.
# This is enough for the current app and keeps the feature lightweight.
_RATE_LIMIT_BUCKETS = defaultdict(list)


def _get_client_key(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    return request.client.host if request.client else "unknown-client"


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        path = request.url.path
        if path in RATE_LIMIT_EXEMPT_PATHS:
            return await call_next(request)

        now = time.time()
        client_key = _get_client_key(request)
        bucket_key = f"{client_key}:{path}"
        timestamps = _RATE_LIMIT_BUCKETS[bucket_key]

        # Prune stale timestamps.
        timestamps[:] = [stamp for stamp in timestamps if now - stamp < RATE_LIMIT_WINDOW_SECONDS]

        if len(timestamps) >= RATE_LIMIT_REQUESTS_PER_MINUTE:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
            )

        timestamps.append(now)
        return await call_next(request)
