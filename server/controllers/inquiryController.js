import Inquiry from '../models/Inquiry.js';
import Product from '../models/Product.js';

// @desc    Create a new client inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message, productId, productTitle, projectType } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.',
      });
    }

    let finalProductTitle = productTitle || '';
    if (productId && !finalProductTitle) {
      try {
        const prod = await Product.findById(productId).select('name');
        if (prod) finalProductTitle = prod.name;
      } catch (e) {
        // ignore lookup error if invalid ID
      }
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      subject: subject || '',
      message,
      productId: productId || null,
      productTitle: finalProductTitle,
      projectType: projectType || '',
      status: 'New',
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully.',
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin)
export const getInquiries = async (req, res, next) => {
  try {
    const { status, search, limit = 100, page = 1 } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = new RegExp(`^${status}$`, 'i');
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { productTitle: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('productId', 'name sku slug images');

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status or details
// @route   PUT /api/inquiries/:id
// @access  Private (Admin)
export const updateInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    Object.assign(inquiry, req.body);
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin)
export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
