from googleapiclient.discovery import build
from service.auth_service import AuthService
from typing import List, Dict
import json
import base64
from google.oauth2.credentials import Credentials
from service.openapi_service import (
    ShortEmailSummaryAIService,
    LongEmailSummaryAIService,
)
import os


class EmailService:
    @staticmethod
    async def build_gmail_service(user_id: str):
        """Build Gmail service with refreshed credentials"""
        try:
            credentials_json = await AuthService.handle_credentials_refresh(user_id)
            credentials_dict = json.loads(credentials_json)
            credentials = Credentials.from_authorized_user_info(
                credentials_dict, scopes=AuthService.SCOPES
            )
            return build("gmail", "v1", credentials=credentials)
        except Exception as e:
            raise ValueError(f"Failed to build Gmail service: {str(e)}")

    @staticmethod
    def decode_message_part(payload) -> str:
        """Decode message body from payload"""
        if "parts" in payload:
            # Multipart message - recursively get text parts
            text_parts = []
            for part in payload["parts"]:
                text_parts.append(EmailService.decode_message_part(part))
            return "\n".join(text_parts)

        if payload["mimeType"] == "text/plain" and "data" in payload["body"]:
            # Base64 encoded text
            data = payload["body"]["data"]
            return base64.urlsafe_b64decode(data).decode()

        return ""

    @staticmethod
    def get_thread_messages(thread) -> List[Dict]:
        """Extract messages from thread with proper ordering"""
        messages = []
        for msg in thread["messages"]:
            headers = msg["payload"]["headers"]
            messages.append(
                {
                    "id": msg["id"],
                    "sender": next(
                        (h["value"] for h in headers if h["name"] == "From"),
                        "Unknown Sender",
                    ),
                    "date": next(
                        (h["value"] for h in headers if h["name"] == "Date"),
                        "",
                    ),
                    "body": EmailService.decode_message_part(msg["payload"]),
                    "timestamp": msg["internalDate"],
                }
            )
        # Sort by timestamp
        return sorted(messages, key=lambda x: x["timestamp"])

    @staticmethod
    async def get_emails(user_id: str, max_results: int = 10) -> List[Dict]:
        """Get recent emails for a user"""
        try:
            service = await EmailService.build_gmail_service(user_id)

            # Get list of messages
            results = (
                service.users()
                .messages()
                .list(userId="me", maxResults=max_results, labelIds=["INBOX"])
                .execute()
            )

            messages = results.get("messages", [])
            emails = []

            for message in messages:
                # Get full message details
                msg = (
                    service.users()
                    .messages()
                    .get(userId="me", id=message["id"], format="full")
                    .execute()
                )

                headers = msg["payload"]["headers"]
                subject = next(
                    (h["value"] for h in headers if h["name"] == "Subject"),
                    "No Subject",
                )
                sender = next(
                    (h["value"] for h in headers if h["name"] == "From"),
                    "Unknown Sender",
                )
                to = next(
                    (h["value"] for h in headers if h["name"] == "To"),
                    "Unknown Recipient",
                )
                date = next(
                    (h["value"] for h in headers if h["name"] == "Date"),
                    "",
                )
                importance = next(
                    (h["value"] for h in headers if h["name"] == "Importance"),
                    "normal",
                ).lower()

                # Get message body
                body = EmailService.decode_message_part(msg["payload"])

                # Get thread details
                thread = (
                    service.users()
                    .threads()
                    .get(userId="me", id=msg["threadId"])
                    .execute()
                )

                # Get thread history
                thread_messages = EmailService.get_thread_messages(thread)

                emails.append(
                    {
                        "id": msg["id"],
                        "subject": subject,
                        "sender": sender,
                        "timestamp": msg["internalDate"],
                        "thread_size": len(thread["messages"]),
                        "thread_messages": thread_messages,
                        "body": body,
                        "is_unread": "UNREAD" in msg["labelIds"],
                        "is_important": (
                            "IMPORTANT" in msg["labelIds"]
                            or importance == "high"
                            or "!" in subject
                        ),
                    }
                )
            return emails

        except Exception as e:
            raise ValueError(f"Failed to get emails: {str(e)}")

    @staticmethod
    async def get_emails_with_short_summary(user_id: str, max_results: int = 10):
        short_email_summary_ai_service = ShortEmailSummaryAIService(
            os.getenv("OPEN_API_KEY")
        )
        emails = await EmailService.get_emails(user_id, max_results)
        emails_with_summary = []
        for email in emails:
            email["short_summary"] = short_email_summary_ai_service.get_response(
                email["body"]
            )
            del email["body"]
            del email["thread_messages"]
            emails_with_summary.append(email)
        return emails_with_summary

    @staticmethod
    async def get_email_by_id(user_id: str, email_id: str) -> Dict:
        """Get a specific email by ID with full details"""
        try:
            service = await EmailService.build_gmail_service(user_id)

            # Get full message details
            msg = (
                service.users()
                .messages()
                .get(userId="me", id=email_id, format="full")
                .execute()
            )

            headers = msg["payload"]["headers"]
            subject = next(
                (h["value"] for h in headers if h["name"] == "Subject"),
                "No Subject",
            )
            sender = next(
                (h["value"] for h in headers if h["name"] == "From"),
                "Unknown Sender",
            )
            to = next(
                (h["value"] for h in headers if h["name"] == "To"),
                "Unknown Recipient",
            )
            date = next(
                (h["value"] for h in headers if h["name"] == "Date"),
                "",
            )
            importance = next(
                (h["value"] for h in headers if h["name"] == "Importance"),
                "normal",
            ).lower()

            # Get message body
            body = EmailService.decode_message_part(msg["payload"])

            # Get thread details
            thread = (
                service.users().threads().get(userId="me", id=msg["threadId"]).execute()
            )

            # Get thread history
            thread_messages = EmailService.get_thread_messages(thread)

            return {
                "id": msg["id"],
                "subject": subject,
                "sender": sender,
                "recipient": to,
                "date": date,
                "body": body,
                "timestamp": msg["internalDate"],
                "thread_size": len(thread["messages"]),
                "thread_messages": thread_messages,
                "is_unread": "UNREAD" in msg["labelIds"],
                "is_important": (
                    "IMPORTANT" in msg["labelIds"]
                    or importance == "high"
                    or "!" in subject
                ),
            }

        except Exception as e:
            raise ValueError(f"Failed to get email: {str(e)}")

    @staticmethod
    async def get_email_by_id_with_long_summary(user_id: str, email_id: str) -> Dict:
        long_email_summary_ai_service = LongEmailSummaryAIService(
            os.getenv("OPEN_API_KEY")
        )
        email = await EmailService.get_email_by_id(user_id, email_id)
        email["long_summary"] = long_email_summary_ai_service.get_response(
            json.dumps(email["thread_messages"])
        )
        del email["body"]
        del email["thread_messages"]
        email["link"] = f"https://mail.google.com/mail/u/0/#inbox/{email_id}"
        return email
