import { useEffect, useState } from "react";
import { MinusIcon } from "@heroicons/react/24/outline";

interface ErrorQuoteProps {
  message?: string;
  messages?: string[];
}

/**
 * Error Quote
 */
export const ErrorQuote = ({ message, messages }: ErrorQuoteProps) => {
  const [errorText, setErrorText] = useState("Loading error");
  const [writer, setWriter] = useState("Developer");

  useEffect(() => {
    const avaliableMessages: string[] = [];
    if (messages && messages.length > 0) {
      avaliableMessages.push(...messages);
    }

    if (avaliableMessages.length === 0) {
      if (message) {
        avaliableMessages.push(message);
      } else {
        avaliableMessages.push("Error is here", "E-R-R-O-R", "Default error value");
      }
    }

    setErrorText(avaliableMessages[Math.floor(Math.random() * avaliableMessages.length)]);

    const writers = ["Developer", "MachineBot", "BrowserSoul", "ReactLikeRenderer"];
    setWriter(writers[Math.floor(Math.random() * writers.length)]);
  }, [message, messages]);

  return (
    <blockquote className="w-full max-w-2xl mx-auto transition duration-200 my-4 border rounded-lg px-4 py-3 flex flex-col gap-y-2 bg-red-200 border-red-400">
      <div className="text-lg italic">{errorText}</div>
      <div className="flex flex-row justify-end items-center gap-x-2">
        <MinusIcon className="w-4 h-4" /> {writer}
      </div>
    </blockquote>
  );
};
