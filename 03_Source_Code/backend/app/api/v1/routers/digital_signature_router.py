from fastapi import APIRouter, UploadFile, File
from app.digital_signature.service import DigitalSignatureService

router = APIRouter(
    prefix="/digital-signature",
    tags=["Digital Signature"]
)

service = DigitalSignatureService()

@router.post("/verify")
async def verify_digital_signature(
    file_signed: UploadFile = File(...)
):
    """Verifikasi dan simpan dokumen PDF tanda tangan digital."""
    signed_url = await service.validate_and_upload(file_signed, folder="digital_signature")
    return {
        "message": "Dokumen tanda tangan digital berhasil diverifikasi dan disimpan.",
        "signed_url": signed_url
    }
