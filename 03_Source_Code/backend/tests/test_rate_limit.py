import pytest

from app.core import rate_limit


@pytest.fixture(autouse=True)
def reset_rate_limit_state(monkeypatch):
    monkeypatch.setattr(rate_limit, "RATE_LIMIT_REQUESTS_PER_MINUTE", 2)
    monkeypatch.setattr(rate_limit, "RATE_LIMIT_WINDOW_SECONDS", 60)
    rate_limit._RATE_LIMIT_BUCKETS.clear()
    yield
    rate_limit._RATE_LIMIT_BUCKETS.clear()


def test_login_endpoint_returns_429_after_limit(client):
    for _ in range(2):
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "wrong-user", "password": "wrong-pass"},
        )
        assert response.status_code in (401, 422)

    response = client.post(
        "/api/v1/auth/login",
        data={"username": "wrong-user", "password": "wrong-pass"},
    )

    assert response.status_code == 429
    assert response.json()["detail"] == "Too many requests. Please try again later."
