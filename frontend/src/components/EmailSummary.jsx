import React, { useState, useEffect } from "react";
import { Spinner, Badge } from "@heroui/react";
import { getEmailsShortSum } from "../services/api";

export const EmailSummary = () => {
  const [emails, setEmails] = useState([]);
  const [isInboxLoading, setIsInboxLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  const fetchEmails = async () => {
    try {
      const response = await getEmailsShortSum(userId);
      return response;
    } catch (error) {
      console.error("Error fetching short summaries:", error);
    }
  };

  useEffect(() => {
    setIsInboxLoading(true);
    fetchEmails(userId)
      .then((data) => {
        setEmails(data);
      })
      .catch((err) => {
        console.error("Error fetching emails:", err);
      })
      .finally(() => {
        setIsInboxLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {isInboxLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      ) : !emails ? (
        <p className="text-gray-500">Error fetching emails!</p>
      ) : emails.length === 0 ? (
        <p className="text-gray-500">Inbox is empty.</p>
      ) : (
        <div className="flex flex-col w-full mt-2">
          {Object.values(emails).map((email) => (
            <Badge
              color="primary"
              shape="rectangle"
              size="lg"
              content="Unread"
              placement="top-right"
              isInvisible={!email.is_unread}
            >
              <div
                key={email.id}
                className="relative w-full cursor-pointer p-4 bg-gray-100 rounded-lg mb-3 hover:bg-gray-200 transition duration-300"
              >
                <p className="font-semibold text-lg text-gray-800">
                  {email.subject}
                </p>
                <p className="text-sm text-gray-600">{email.sender}</p>
                <p className="text-xs text-gray-400">{email.date}</p>
                <p className="text-sm text-gray-700 mt-1">
                  {email.short_summary}
                </p>
              </div>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
