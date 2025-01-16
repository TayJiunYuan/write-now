from pydantic import BaseModel


class EmailWithLongSummary(BaseModel):
    id: str
    subject: str
    sender: str
    recipient: str
    date: str
    timestamp: str
    thread_size: int
    is_unread: bool
    is_important: bool
    long_summary: str
    link: str


class EmailWithShortSummary(BaseModel):
    id: str
    subject: str
    sender: str
    timestamp: str
    thread_size: int
    is_unread: bool
    is_important: bool
    short_summary: str
