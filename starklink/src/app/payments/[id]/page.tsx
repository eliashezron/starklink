// src/app/payments/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConnect, useDisconnect, useAccount } from "@starknet-react/core";
import Modal from "../../../components/Connect-Modal";
import starknetAbi from "../../utils/abi.json";
import { Contract, cairo } from "starknet";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

interface PaymentDetailsType {
  reason: string;
  amount: number;
  currency: string;
  address: string;
  sharedWith?: string[]; // New field for sharing information
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
    const fetchPaymentDetails = async () => {
      if (id) {
        try {
          const docRef = doc(db, "paymentLinks", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPaymentDetails(docSnap.data() as PaymentDetailsType);
          } else {
            router.push('/404');
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
          router.push('/404');
        }
      }
    };
    
    fetchPaymentDetails();
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
      const starknetUsdcAddress = "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
      const starknetStrkAddress = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
      if (!paymentDetails) return;
      const starknetRecipientAddress = paymentDetails.address;
      const amount = paymentDetails.amount;
      const starknetContract = new Contract(
        starknetAbi,
        paymentDetails.currency === 'USDC' ? starknetUsdcAddress : starknetStrkAddress,
        account
      );
      const approve = await starknetContract.approve(
        starknetRecipientAddress,
        paymentDetails.currency === 'USDC' ? cairo.uint256(String(amount * 1000000)) : cairo.uint256(String(amount * 1000000000000000000))
      );
      console.log("Approve", approve);
      await starknetContract.transfer(
        starknetRecipientAddress,
        paymentDetails.currency === 'USDC' ? cairo.uint256(String(amount * 1000000)) : cairo.uint256(String(amount * 1000000000000000000))
      );
      const docRef = doc(db, "paymentLinks", id);
      await updateDoc(docRef, { status: "completed" }); // Update status to completed
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
        {paymentDetails.sharedWith && paymentDetails.sharedWith.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-center mt-4 mb-2">Shared With</h2>
            <ul>
              {paymentDetails.sharedWith.map(email => (
                <li key={email} className="text-gray-700">{email}</li>
              ))}
            </ul>
          </>
        )}
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
