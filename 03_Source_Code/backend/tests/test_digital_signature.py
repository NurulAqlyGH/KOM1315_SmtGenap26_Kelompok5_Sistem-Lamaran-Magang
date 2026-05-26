import pytest

PREFIX = "/api/v1"

def test_verify_digital_signature_success(client):
    files = {"file_signed": ("signed_surat.pdf", b"dummy pdf content", "application/pdf")}
    response = client.post(f"{PREFIX}/digital-signature/verify", files=files)

    assert response.status_code == 200
    body = response.json()
    assert body["message"] == "Dokumen tanda tangan digital berhasil diverifikasi dan disimpan."
    assert "signed_url" in body
    assert body["signed_url"] is not None


def test_verify_digital_signature_invalid_file_type(client):
    files = {"file_signed": ("signed_surat.txt", b"dummy text content", "text/plain")}
    response = client.post(f"{PREFIX}/digital-signature/verify", files=files)

    assert response.status_code == 400
    assert response.json()["detail"] == "File tanda tangan digital harus berformat PDF."
