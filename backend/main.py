from fastapi import FastAPI
from db.db import db
from routers import user, auth, task, programme, calendar, meeting
app = FastAPI()

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(task.router)
app.include_router(programme.router)
app.include_router(calendar.router)
app.include_router(meeting.router)


@app.on_event("startup")
async def startup_db_client():
    await db.connect_db()


@app.on_event("shutdown")
async def shutdown_db_client():
    await db.close_db()
