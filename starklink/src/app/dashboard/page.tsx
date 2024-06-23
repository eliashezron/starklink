// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config"; 
import { useRouter } from "next/navigation";
import copy from 'copy-to-clipboard';

// Define the type for payment link
interface PaymentLink {
  id: string;
  reason: string;
  amount: string;
  currency: string;
  address: string;
  status: string;
  user: string;
  createdAt: Date;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      const fetchPaymentLinks = async () => {
        try {
          const q = query(collection(db, "paymentLinks"), where("user", "==", session?.user?.email));
          const querySnapshot = await getDocs(q);
          const links = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<PaymentLink, 'id'>
          }));
          setPaymentLinks(links);
        } catch (error) {
          console.error("Error fetching payment links: ", error);
        }
      };

      fetchPaymentLinks();
    }
  }, [status, session, router]);

  const handleCopyLink = (link: string) => {
    copy(link);
    alert('Link copied to clipboard!');
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-center mb-8">Dashboard</h1>
        {paymentLinks.length === 0 ? (
          <p className="text-center">No payment links found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentLinks.map(link => {
              const paymentLink = `${window.location.origin}/payments/${link.id}`;
              return (
                <div key={link.id} className="p-4 bg-gray-50 rounded shadow-sm flex flex-col justify-between">
                  <div className="mb-2">
                    <strong>Reason:</strong> {link.reason}
                  </div>
                  <div className="mb-2">
                    <strong>Amount:</strong> {link.amount} {link.currency}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> {link.status === "completed" ? (
                      <span className="text-green-500 font-bold">Completed ✔️</span>
                    ) : (
                      <span className="text-gray-500">Pending ⏳</span>
                    )}
                  </div>
                  {/* <div className="mb-2">
                    <strong>Link:</strong> <a href={paymentLink} className="text-blue-500 underline">{paymentLink}</a>
                  </div> */}
                  <button
                    onClick={() => handleCopyLink(paymentLink)}
                    className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Copy Link
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="w-full mt-8 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
