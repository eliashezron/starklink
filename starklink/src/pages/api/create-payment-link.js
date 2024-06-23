import { v4 as uuidv4 } from 'uuid';
import paymentLinks from '../../data/paymentLinks';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { reason, amount, currency, address } = req.body;

    if (!reason || !amount || !currency || !address) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const id = uuidv4();
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/payments/${id}`;

    paymentLinks.set(id, { reason, amount, currency, address });

    res.status(200).json({ success: true, link });
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
