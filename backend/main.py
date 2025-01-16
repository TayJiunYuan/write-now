from fastapi import FastAPI
from db.db import db
from routers import user, auth, task, programme, calendar, meeting, email
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from these domains
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(task.router)
app.include_router(programme.router)
app.include_router(calendar.router)
app.include_router(meeting.router)
app.include_router(email.router)


@app.on_event("startup")
async def startup_db_client():
    await db.connect_db()


@app.on_event("shutdown")
async def shutdown_db_client():
    await db.close_db()
