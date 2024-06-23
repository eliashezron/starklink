// src/app/home/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config"

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [paymentDetails, setPaymentDetails] = useState({
    reason: "",
    amount: "",
    currency: "USDC",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session || !session.user) {
      alert("Please sign in to create a payment link.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "paymentLinks"), {
        ...paymentDetails,
        user: session.user.email,
        createdAt: new Date(),
      });

      const link = `${process.env.NEXT_PUBLIC_BASE_URL}/payments/${docRef.id}`;
      alert(`Payment link created: ${link}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error creating payment link");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Create Payment Link</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Reason for Payment</label>
            <input
              type="text"
              name="reason"
              value={paymentDetails.reason}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter reason"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <select
              name="currency"
              value={paymentDetails.currency}
              onChange={handleChange}
              className="px-3 py-2 border rounded-l"
              required
            >
              <option value="USDC">USDC</option>
              <option value="STRK">STRK</option>
            </select>
            <input
              type="number"
              name="amount"
              value={paymentDetails.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-r"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Receiving Address</label>
            <input
              type="text"
              name="address"
              value={paymentDetails.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter receiving address"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            Create Payment Link
          </button>
        </form>
        <button
          onClick={() => signOut()}
          className="w-full mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
