import uuid
from io import BytesIO

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

from app.core.config import settings


class StorageService:
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            endpoint_url=settings.minio_endpoint_url,
            aws_access_key_id=settings.minio_root_user,
            aws_secret_access_key=settings.minio_root_password,
            config=Config(signature_version="s3v4"),
            region_name="us-east-1",
            use_ssl=False,
        )
        self.bucket = settings.minio_bucket_curriculos

    def _ensure_bucket_exists(self):
        """Garante que o bucket configurado existe."""
        try:
            self.s3.head_bucket(Bucket=self.bucket)
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "404":
                self.s3.create_bucket(Bucket=self.bucket)
            else:
                raise

    def upload_file(self, file_content: bytes, filename: str, content_type: str = "application/pdf") -> str:
        """
        Faz upload de um arquivo para o MinIO com um nome único.
        Retorna o caminho (object_key) salvo.
        """
        self._ensure_bucket_exists()
        
        # Gera nome único para evitar colisões
        ext = filename.split(".")[-1] if "." in filename else "bin"
        unique_filename = f"{uuid.uuid4()}.{ext}"
        
        # Faz o upload
        self.s3.put_object(
            Bucket=self.bucket,
            Key=unique_filename,
            Body=BytesIO(file_content),
            ContentType=content_type,
        )
        
        return unique_filename

    def get_presigned_url(self, object_key: str, expires_in: int = 900) -> str:
        """Gera uma URL temporária para visualização do arquivo."""
        return self.s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": object_key},
            ExpiresIn=expires_in,
        )


storage_service = StorageService()
