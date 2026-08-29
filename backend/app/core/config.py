from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str
    upload_dir: str = "data/uploads"
    chroma_db_dir: str = "data/chroma_db"

    class Config:
        env_file = ".env"


settings = Settings()
