// src/pages/api/create-payment-link.js
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reason, amount, currency, address, userId } = req.body;

    if (!reason || !amount || !currency || !address || !userId) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
      const id = uuidv4();
      const link = `${process.env.NEXT_PUBLIC_BASE_URL}/payments/${id}`;

      await addDoc(collection(db, 'payments'), {
        id,
        reason,
        amount,
        currency,
        address,
        link,
        userId,
        createdAt: new Date().toISOString(),
      });

      res.status(200).json({ success: true, link });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      res.status(500).json({ success: false, message: 'Error saving payment details' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
