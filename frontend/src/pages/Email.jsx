import React from "react";
import EmailTopBar from "../components/EmailTopBar";
import Inbox from "../components/Inbox";
import EmailPreview from "../components/EmailPreview";

const Email = () => {
  return (
    <div className="flex flex-col">
      <div className="flex w-full">
        <EmailTopBar />
      </div>
      <div className="flex w-full">
        <div className="w-1/4">
          <Inbox />
        </div>
        <div>
          <EmailPreview />
        </div>
      </div>
    </div>
  );
};

export default Email;
