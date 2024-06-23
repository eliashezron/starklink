// src/app/home.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter amount"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Currency</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter currency"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            Create Link
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
