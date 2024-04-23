import { PlaceholderWrapper } from "./PlaceholderWrapper";
import { MinusIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useAnimationConfig } from "~~/hooks/scaffold-eth";

interface GreetingQuoteProps {
  message?: string;
  address?: string;
  isPremium?: boolean;
}

/**
 * Greeting Quote
 */
export const GreetingQuote = ({ message, address, isPremium }: GreetingQuoteProps) => {
  const baseClasses =
    "w-full max-w-2xl mx-auto transition duration-200 my-4 border rounded-lg  px-4 py-3 flex flex-col gap-y-2";
  const premiumClasses = "bg-yellow-200 border-yellow-400";
  const basicClasses = "bg-white";

  const { showAnimation } = useAnimationConfig(message);

  return (
    <blockquote
      className={`${baseClasses} ${isPremium ? premiumClasses : basicClasses} ${
        showAnimation ? "animate-pulse-fast" : ""
      }`}
    >
      <PlaceholderWrapper>{message ? <div className="text-lg">{message}</div> : ""}</PlaceholderWrapper>
      <div className="flex flex-row justify-end items-center gap-x-2">
        <MinusIcon className="w-4 h-4" />
        <Address address={address} />
      </div>
    </blockquote>
  );
};
