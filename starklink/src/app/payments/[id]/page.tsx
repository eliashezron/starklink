// src/app/payments/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConnect, useDisconnect, useAccount } from "@starknet-react/core";
import Modal from "../../../components/Connect-Modal"; // Adjust the import path as necessary

interface PaymentDetailsType {
  reason: string;
  amount: string;
  currency: string;
  address: string;
}

export default function PaymentDetails() {
  const { account } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const params = useParams();
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      fetch(`/api/payment-details?id=${id}`)
        .then(res => res.json())
        .then(data => setPaymentDetails(data))
        .catch(() => router.push('/404'));
    }
  }, [id, router]);

  const handleConnect = async (connector: any) => {
    await connect({ connector });
    setShowModal(false); // Close modal after connection
  };

  const makePayment = async () => {
    if (!account || !paymentDetails) {
      alert("Please connect your wallet and ensure payment details are loaded.");
      return;
    }

    try {
      const transaction = await account.execute({
        contractAddress: paymentDetails.address,
        entrypoint: "transfer", // Update with the correct entrypoint for your contract
        calldata: [paymentDetails.amount], // Update with the correct calldata for your contract
      });

      console.log("Transaction submitted:", transaction);
      alert("Payment made successfully!");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed.");
    }
  };

  if (!paymentDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Payment Details</h1>
        <p><strong>Reason:</strong> {paymentDetails.reason}</p>
        <p><strong>Amount:</strong> {paymentDetails.amount} {paymentDetails.currency}</p>
        <p><strong>Address:</strong> {paymentDetails.address}</p>
        {account ? (
          <>
            <button
              onClick={makePayment}
              className="w-full mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            >
              Make Payment
            </button>
            <button
              onClick={() => disconnect()}
              className="w-full mt-2 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowModal(true)}
              className="w-full mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
              Connect Wallet
            </button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
              <h2 className="text-xl mb-4">Choose a Wallet</h2>
              {connectors.map(connector => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mb-2"
                >
                  Connect {connector.name}
                </button>
              ))}
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}
