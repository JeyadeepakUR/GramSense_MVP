"""
Python security utilities for backend data encryption and hashing.
"""
import hashlib
import secrets
from typing import Tuple
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend


def generate_key() -> bytes:
    """Generate a random 256-bit AES key"""
    return secrets.token_bytes(32)


def encrypt_data(data: bytes, key: bytes) -> Tuple[bytes, bytes]:
    """
    Encrypt data using AES-256-GCM
    Returns (encrypted_data, nonce)
    """
    nonce = secrets.token_bytes(12)
    cipher = Cipher(
        algorithms.AES(key),
        modes.GCM(nonce),
        backend=default_backend()
    )
    encryptor = cipher.encryptor()
    encrypted = encryptor.update(data) + encryptor.finalize()
    return encrypted, nonce


def decrypt_data(encrypted: bytes, key: bytes, nonce: bytes) -> bytes:
    """Decrypt data using AES-256-GCM"""
    cipher = Cipher(
        algorithms.AES(key),
        modes.GCM(nonce),
        backend=default_backend()
    )
    decryptor = cipher.decryptor()
    decrypted = decryptor.update(encrypted) + decryptor.finalize()
    return decrypted


def hash_data(data: str) -> str:
    """Generate SHA-256 hash of data"""
    return hashlib.sha256(data.encode()).hexdigest()


def verify_hash(data: str, expected_hash: str) -> bool:
    """Verify data against a hash"""
    computed_hash = hash_data(data)
    return secrets.compare_digest(computed_hash, expected_hash)
