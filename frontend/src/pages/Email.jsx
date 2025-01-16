import { useState, useEffect } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { getEmailsShortSum, getEmailsLongSum } from "../services/api";

export const Email = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailThread, setEmailThread] = useState(null);

  const [isInboxLoading, setIsInboxLoading] = useState(false);
  const [isEmailThreadLoading, setIsEmailThreadLoading] = useState(false);

  const userId = String(JSON.parse(localStorage.getItem("userId")));

  const fetchEmails = async () => {
    try {
      const response = await getEmailsShortSum(userId);
      return response;
    } catch (error) {
      console.error("Error fetching short summaries:", error);
    }
  };

  const fetchEmailThread = async (emailId) => {
    try {
      const response = await getEmailsLongSum(userId, emailId);
      return response;
    } catch (error) {
      console.error("Error fetching long summary:", error);
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
        setIsInboxLoading(false)
      })
  }, []);

  const handleEmailClick = async (emailId) => {
    setSelectedEmail(emailId);
    setIsEmailThreadLoading(true);
    try {
      const threadData = await fetchEmailThread(userId, emailId);
      setEmailThread(threadData);
    } catch (err) {
      console.error("Error fetching email thread:", err);
      setSelectedEmail(null);
    } finally {
      setIsEmailThreadLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-50">
      {/* Left Section: Inbox */}
      <div className="sm:w-1/3 bg-white shadow-lg rounded-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Inbox (Last 7 Days)
        </h2>
        {isInboxLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        ) : emails.length === 0 ? (
          <p className="text-gray-500">Inbox is empty.</p>
        ) : (
          <div>
            {Object.values(emails).map((email) => (
              <div
                key={email.id}
                className="cursor-pointer p-4 bg-gray-100 rounded-lg mb-3 hover:bg-gray-200 transition duration-300"
                onClick={() => handleEmailClick(email.id)}
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
            ))}
          </div>
        )}
      </div>

      {/* Right Section: Email Preview */}
      <div className="sm:w-2/3 bg-white shadow-lg rounded-lg p-6 overflow-y-auto">
        {selectedEmail && !isEmailThreadLoading ? (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Email Thread
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-lg text-gray-800">
                {emailThread?.long_summary}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {emailThread?.thread_size} emails in this thread
              </p>
            </div>
          </div>
        ) : isEmailThreadLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        ) : (
          <p className="text-gray-500">
            Select an email to view the full thread.
          </p>
        )}
      </div>

      {/* Bottom Section: Create Task Options */}
      {selectedEmail && (
        <div className="w-full bg-gray-100 p-4 shadow-inner mt-6 sm:mt-0 sm:border-t">
          <div className="flex justify-end gap-4">
            <Button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
              Create Task
            </Button>
            <Button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
              Create Task with AI
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Email;
