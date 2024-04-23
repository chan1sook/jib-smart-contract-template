"use client";

import { useEffect, useState } from "react";
import { BloatContainer } from "./_components/BloatContainer";
import { ErrorQuote } from "./_components/ErrorQuote";
import { GreetingQuote } from "./_components/GreetingQuote";
import { NextPage } from "next";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { InputBase, IntegerInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { contracts } from "~~/utils/scaffold-eth/contract";

interface LogOutput {
  greetingSetter: string;
  newGreeting: string;
  premium: boolean;
  value: bigint;
}
const GreetingPage: NextPage = () => {
  const contractName = "YourContract";

  const { address: connectedAddress } = useAccount();

  const [txValue, setTxValue] = useState<string | bigint>("");
  const [message, setMessage] = useState<string>("Loading Greeting Text");
  const [messageOwner, setMessageOwner] = useState<string>(connectedAddress || "");
  const [preminum, setPreimum] = useState<boolean>(false);
  const [formMessage, setFormMessage] = useState<string>("Hello World");

  const { targetNetwork } = useTargetNetwork();
  const writeTxn = useTransactor();
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
  const { refetch: refetchGreeting } = useReadContract({
    address: deployedContractData?.address,
    functionName: "greeting",
    abi: deployedContractData?.abi,
    chainId: targetNetwork.id,
    scopeKey: "greeting",
  });
  const { refetch: refetchPremium } = useReadContract({
    address: deployedContractData?.address,
    functionName: "premium",
    abi: deployedContractData?.abi,
    chainId: targetNetwork.id,
    scopeKey: "premium",
  });
  const { refetch: refetchMessageOwner } = useReadContract({
    address: deployedContractData?.address,
    functionName: "messageOwner",
    abi: deployedContractData?.abi,
    chainId: targetNetwork.id,
    scopeKey: "messageOwner",
  });
  useWatchContractEvent({
    address: deployedContractData?.address,
    chainId: targetNetwork.id,
    eventName: "GreetingChange",
    abi: deployedContractData?.abi,
    onLogs(logs) {
      const lastestLog = logs[logs.length - 1];
      const data = (lastestLog as unknown as { args: LogOutput }).args;
      setMessageOwner(data.greetingSetter);
      setMessage(data.newGreeting);
      setPreimum(data.premium);
    },
  });

  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const contractNames = contracts ? contracts[targetNetwork.id] || {} : {};
  const hasYourContract = Object.keys(contractNames).includes(contractName);

  async function updateMessageBlockchain() {
    if (writeContractAsync && deployedContractData) {
      try {
        const makeWriteWithParams = () =>
          writeContractAsync({
            address: deployedContractData?.address,
            functionName: "setGreeting",
            abi: deployedContractData?.abi,
            args: [formMessage],
            value: BigInt(txValue),
          });
        await writeTxn(makeWriteWithParams);
        // await updateValues();
      } catch (e: any) {
        console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
      }
    }
  }

  async function updateValues() {
    const [v1, v2, v3] = await Promise.all([refetchGreeting(), refetchPremium(), refetchMessageOwner()]);

    if (v1 && typeof v1.data === "string") {
      setMessage(v1.data);
    }
    if (v2 && typeof v2.data === "boolean") {
      setPreimum(v2.data);
    }

    if (v3 && typeof v3.data === "string") {
      setMessageOwner(v3.data);
    }
  }

  useEffect(() => {
    updateValues().catch(console.error);
  });

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 w-full">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Greeting DAPP</span>
          </h1>
          {hasYourContract ? (
            deployedContractLoading ? (
              <div className="text-center text-2xl">
                <span className="loading loading-spinner loading-xs"></span> Loading...
              </div>
            ) : (
              <>
                <GreetingQuote message={message} address={messageOwner} isPremium={preminum} />
                <div className="flex flex-col gap-y-4">
                  <BloatContainer title="Greeting">
                    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="flex items-center ml-2">
                          <span className="text-xs font-medium mr-2 leading-none">Message</span>
                          <span className="block text-xs font-extralight leading-none">string</span>
                        </div>
                        <InputBase value={formMessage} onChange={setFormMessage} placeholder="Enter your message" />
                      </div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="flex items-center ml-2">
                          <span className="text-xs font-medium mr-2 leading-none">Payment</span>
                          <span className="block text-xs font-extralight leading-none">payable wei</span>
                        </div>
                        <IntegerInput name="Payment" value={txValue} onChange={setTxValue} placeholder="value (wei)" />
                      </div>
                      <div className="flex flex-col justify-end gap-1.5 w-full">
                        <button
                          className="self-end btn btn-secondary btn-sm"
                          onClick={updateMessageBlockchain}
                          disabled={isPending || (isConfirming && !isConfirmed)}
                        >
                          {(isPending || (isConfirming && !isConfirmed)) && (
                            <span className="loading loading-spinner loading-xs"></span>
                          )}
                          Submit
                        </button>
                      </div>
                    </div>
                  </BloatContainer>
                </div>
              </>
            )
          ) : (
            <ErrorQuote messages={["Wrong chain: JBC Only", "Wrong chain: Local chain is OK"]} />
          )}
        </div>
      </div>
    </>
  );
};

export default GreetingPage;
