const Faq = require('../models/Faq');

/* =======================
   GET PUBLIC FAQs
======================= */
exports.getAllFaqs = async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {
      status: 'published',
      ...(category && category !== 'All' && { category }),
      ...(search && {
        $or: [
          { question: { $regex: search, $options: 'i' } },
          { answer: { $regex: search, $options: 'i' } },
        ],
      }),
    };

    const faqs = await Faq.find(query).sort({ createdAt: -1 }).select('-__v');

    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
  }
};

/* =======================
   GET ADMIN FAQs
======================= */
exports.getAllFaqsAdmin = async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {
      ...(category && category !== 'All' && { category }),
      ...(search && {
        $or: [
          { question: { $regex: search, $options: 'i' } },
          { answer: { $regex: search, $options: 'i' } },
        ],
      }),
    };

    const faqs = await Faq.find(query).sort({ createdAt: -1 }).select('-__v');

    res.json({ success: true, count: faqs.length, data: faqs });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
  }
};

/* =======================
   GET SINGLE FAQ
======================= */
exports.getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });

    res.json({ success: true, data: faq });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch FAQ' });
  }
};


exports.createFaq = async (req, res) => {
  try {
    const { category, question, answer, status = 'draft' } = req.body;

    if (!category || !question || !answer) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const faq = await Faq.create({ category, question, answer, status });
    res.status(201).json({ success: true, data: faq });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create FAQ' });
  }
};


exports.updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });

    res.json({ success: true, data: faq });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update FAQ' });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });

    res.json({ success: true, message: 'FAQ deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete FAQ' });
  }
};
