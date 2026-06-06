import hashlib
import hmac
import os
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse


DEFAULT_SIGNATURE_SECRET = os.getenv("DIGITAL_SIGNATURE_SECRET", "dev-signature-secret")


def generate_signature(file_bytes: bytes, signer_name: str) -> str:
    """Buat tanda tangan HMAC-SHA256 sederhana untuk dokumen yang diunggah."""
    payload = f"{signer_name}:{len(file_bytes)}:".encode("utf-8") + file_bytes
    return hmac.new(DEFAULT_SIGNATURE_SECRET.encode("utf-8"), payload, hashlib.sha256).hexdigest()


def attach_signature_to_url(public_url: str, file_bytes: bytes, signer_name: str) -> str:
    """Tambahkan parameter signature dan signer ke URL dokumen yang diunggah."""
    signature = generate_signature(file_bytes, signer_name)
    parsed = urlparse(public_url)
    query = dict(parse_qs(parsed.query))
    query["sig"] = [signature]
    query["signer"] = [signer_name]
    return urlunparse(parsed._replace(query=urlencode(query, doseq=True)))


def verify_signature(file_bytes: bytes, signer_name: str, signature: str) -> bool:
    """Verifikasi tanda tangan yang dihasilkan dari isi file dan nama penandatangan."""
    return hmac.compare_digest(generate_signature(file_bytes, signer_name), signature)
