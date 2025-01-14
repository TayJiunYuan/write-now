from fastapi import FastAPI
from db.db import db
from routers import user, auth

app = FastAPI()

app.include_router(user.router)
app.include_router(auth.router)


@app.on_event("startup")
async def startup_db_client():
    await db.connect_db()


@app.on_event("shutdown")
async def shutdown_db_client():
    await db.close_db()
