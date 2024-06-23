import paymentLinks from '../../data/paymentLinks';

export default function handler(req, res) {
  const { id } = req.query;

  if (!id || !paymentLinks.has(id)) {
    return res.status(404).json({ success: false, message: 'Payment details not found' });
  }

  const paymentDetails = paymentLinks.get(id);
  res.status(200).json(paymentDetails);
}
