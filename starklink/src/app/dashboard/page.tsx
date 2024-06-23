// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config"
import { useRouter } from "next/navigation";

// Define the type for payment link
interface PaymentLink {
  id: string;
  reason: string;
  amount: string;
  currency: string;
  address: string;
  user: string;
  createdAt: Date;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]); // Use PaymentLink[] as type

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
            ...doc.data() as Omit<PaymentLink, 'id'> // Ensure data is correctly typed
          }));
          setPaymentLinks(links);
        } catch (error) {
          console.error("Error fetching payment links: ", error);
        }
      };

      fetchPaymentLinks();
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-4">Dashboard</h1>
        {paymentLinks.length === 0 ? (
          <p>No payment links found</p>
        ) : (
          <ul>
            {paymentLinks.map(link => (
              <li key={link.id} className="mb-4">
                <a href={`/payments/${link.id}`} className="text-blue-500 underline">
                  {link.reason} - {link.amount} {link.currency}
                </a>
              </li>
            ))}
          </ul>
        )}
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
