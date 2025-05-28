import Newsletter from '../models/newsletterModel.js';
import { Parser } from 'json2csv'; // ✅ needed for CSV export

// ✅ Subscribe controller
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(200).json({ message: "Already subscribed" });

    await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ (Optional) Get all subscribers - used by admin panel
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
};

// ✅ Export all subscribers to CSV
export const exportSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find();

    const fields = [
      { label: 'email', value: 'email' },
      { label: 'subscribedAt', value: 'subscribedAt' }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(subscribers);

    res.header('Content-Type', 'text/csv');
    res.attachment('subscribers_export.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ message: 'Export failed', error });
  }
};
