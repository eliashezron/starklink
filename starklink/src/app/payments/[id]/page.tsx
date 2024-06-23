// src/app/payments/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Define the structure of payment details
interface PaymentDetailsType {
  reason: string;
  amount: string;
  currency: string;
  address: string;
}

export default function PaymentDetails() {
  const params = useParams();
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsType | null>(null);

  // Safely extract the `id` from params
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      // Fetch payment details from the server
      fetch(`/api/payment-details?id=${id}`)
        .then(res => res.json())
        .then(data => setPaymentDetails(data))
        .catch(() => router.push('/404'));
    }
  }, [id, router]);

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
      </div>
    </div>
  );
}
