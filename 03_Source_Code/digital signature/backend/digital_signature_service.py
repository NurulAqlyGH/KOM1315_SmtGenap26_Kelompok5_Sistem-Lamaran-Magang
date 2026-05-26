from fastapi import UploadFile, HTTPException
from app.core.storage import storage_client

class DigitalSignatureService:
    SUPPORTED_MIME_TYPES = ["application/pdf"]
    MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

    async def validate_signed_document(self, file_signed: UploadFile) -> bytes:
        if file_signed.content_type not in self.SUPPORTED_MIME_TYPES:
            raise HTTPException(status_code=400, detail="File tanda tangan digital harus berformat PDF.")

        contents = await file_signed.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="File tanda tangan digital tidak boleh kosong.")

        if len(contents) > self.MAX_FILE_SIZE_BYTES:
            raise HTTPException(status_code=400, detail="File tanda tangan terlalu besar (maks 5MB).")

        return contents

    async def validate_and_upload(self, file_signed: UploadFile, folder: str = "surat_rekomendasi") -> str:
        contents = await self.validate_signed_document(file_signed)
        return storage_client.upload(
            file_data=contents,
            file_name=file_signed.filename,
            content_type=file_signed.content_type,
            folder=folder
        )
