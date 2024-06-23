// src/pages/api/create-payment-link.js
import { v4 as uuidv4 } from 'uuid';

const paymentLinks = new Map();

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { reason, amount, currency, address } = req.body;
    const id = uuidv4();
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/payments/${id}`;

    paymentLinks.set(id, { reason, amount, currency, address });

    res.status(200).json({ success: true, link });
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
