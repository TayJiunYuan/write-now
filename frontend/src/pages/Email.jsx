import { useState, useEffect } from "react";
import { Button, Spinner, Badge, Link, useDisclosure } from "@heroui/react";
import {
  getEmailsShortSum,
  getEmailsLongSum,
  getTaskDetailsWithAI,
} from "../services/api";
import CreateTaskDrawer from "../components/CreateTaskDrawer";

export const Email = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailThread, setEmailThread] = useState(null);
  const [relatedEmails, setRelatedEmails] = useState([]);
  const [isInboxLoading, setIsInboxLoading] = useState(false);
  const [isEmailThreadLoading, setIsEmailThreadLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [withAIData, setWithAIData] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const userId = String(localStorage.getItem("userId"));

  const fetchEmails = async () => {
    try {
      const response = await getEmailsShortSum(userId);
      return response;
    } catch (error) {
      console.error("Error fetching short summaries:", error);
    }
  };

  const fetchEmailThread = async (userId, emailId) => {
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
        setIsInboxLoading(false);
      });
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

  const onOpenChangeWithAI = async (summary) => {
    try {
      setIsLoadingAI(true);
      const data = await getTaskDetailsWithAI(summary);
      setWithAIData(data);
    } catch (error) {
      console.error("Error fetching AI data:", error);
      setWithAIData(null);
    } finally {
      setIsLoadingAI(false);
    }

    onOpen(); // Open the drawer
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-50 pt-[65px]">
      {/* Left Section: Inbox */}
      <div className="sm:w-1/3 bg-white shadow-lg rounded-lg p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inbox</h2>
        {isInboxLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        ) : !emails ? (
          <p className="text-gray-500">Error fetching emails!</p>
        ) : emails.length === 0 ? (
          <p className="text-gray-500">Inbox is empty.</p>
        ) : (
          <div className="flex flex-col w-full">
            {Object.values(emails).map((email) => (
              <Badge
                color="primary"
                shape="circle"
                size="lg"
                content="Unread"
                placement="top-right"
                isInvisible={!email.is_unread}
              >
                <div
                  key={email.id}
                  className="relative w-full cursor-pointer p-4 bg-gray-100 rounded-lg mb-3 hover:bg-gray-200 transition duration-300"
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
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Right Section: Email Preview */}
      <div className="sm:w-2/3 bg-white shadow-lg rounded-lg p-6 overflow-y-auto relative">
        {selectedEmail && !isEmailThreadLoading ? (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Long Summary
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-lg text-gray-800">
                {emailThread?.long_summary}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {emailThread?.thread_size} emails in this thread
              </p>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-4">
              <Link
                href={emailThread.link}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                size="lg"
                isExternal
                showAnchorIcon
              >
                <Button
                  color="primary"
                  className="px-6 py-2 transition duration-200"
                  radius="full"
                >
                  Go to Email Thread
                </Button>
              </Link>
              <Button
                color="primary"
                className="px-6 py-2 transition duration-200"
                onPress={onOpen}
              >
                Create Task
              </Button>
              <Button
                isLoading={isLoadingAI}
                color="secondary"
                radius="full"
                className="px-6 py-2 transition duration-200"
                onPress={() => onOpenChangeWithAI(emailThread.long_summary)}
              >
                Create Task with AI
              </Button>
            </div>
          </div>
        ) : isEmailThreadLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        ) : (
          <p className="text-gray-500">
            Select an email to view the long summary.
          </p>
        )}
      </div>
      <CreateTaskDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        withAIData={withAIData}
      />
    </div>
  );
};

export default Email;
