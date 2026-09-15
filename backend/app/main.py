from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import upload, chat

app = FastAPI(title="NotesGenie API")

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

@app.get("/health")
def health_check():
return {"status": "ok", "service": "NotesGenie API"}

app.mount("/", StaticFiles(directory="static", html=True), name="static")
