import os
import uuid
import logging
from pathlib import Path
from app.core.config import settings

try:
    from supabase import create_client, Client
    _has_supabase = True
except Exception:
    _has_supabase = False

logger = logging.getLogger(__name__)

class SupabaseStorage:
    def __init__(self):
        self.client = None
        self.bucket = None

        if _has_supabase and settings.SUPABASE_URL and settings.SUPABASE_KEY and settings.SUPABASE_BUCKET:
            try:
                self.client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                self.bucket = settings.SUPABASE_BUCKET
            except Exception as e:
                logger.warning(f"Supabase init gagal, fallback ke local storage: {e}")
                self.client = None

    def upload(self, file_data: bytes, file_name: str, content_type: str, folder: str = "lowongan") -> str:
        """
        Upload file ke Supabase Storage jika tersedia, atau fallback ke local storage.
        """
        ext = file_name.split(".")[-1] if "." in file_name else ""
        filename = f"{uuid.uuid4()}{'.' + ext if ext else ''}"
        path = f"{folder}/{filename}"

        if self.client and self.bucket:
            try:
                self.client.storage.from_(self.bucket).upload(
                    path=path,
                    file=file_data,
                    file_options={"content-type": content_type}
                )
                return self.client.storage.from_(self.bucket).get_public_url(path)
            except Exception as e:
                logger.warning(f"Supabase upload gagal, fallback ke local storage: {e}")

        # Fallback local storage
        upload_dir = Path(__file__).resolve().parents[1].joinpath('uploads', folder)
        upload_dir.mkdir(parents=True, exist_ok=True)
        local_path = upload_dir.joinpath(filename)
        with open(local_path, 'wb') as f:
            f.write(file_data)

        # Return URL route for static serving
        return f"/uploads/{folder}/{filename}"

# Instance global untuk digunakan di router/service
storage_client = SupabaseStorage()
