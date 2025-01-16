import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Toast = ({ message, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (message) {
      setIsOpen(true);
    }
  }, [message]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <motion.div
        className="fixed top-4 left-4 max-w-xs w-full p-4"
        initial={{ opacity: 0, scale: 0.5 }} // Start small and fade in
        animate={{ opacity: 1, scale: 1 }} // Fade in and grow to normal size
        exit={{ opacity: 0, scale: 0.5 }} // Fade out and shrink
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <DialogPanel className="bg-success rounded-lg p-4 shadow-lg">
          <DialogTitle className="font-bold">{message}</DialogTitle>
        </DialogPanel>
      </motion.div>
    </Dialog>
  );
};
