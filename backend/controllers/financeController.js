const Finance = require('../models/Finance');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getAllTransactions = catchAsync(async (req, res) => {
  const transactions = await Finance.find()
    .populate('donor', 'firstName lastName')
    .sort('-date');

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: transactions
  });
});

exports.createTransaction = catchAsync(async (req, res) => {
  const newTransaction = await Finance.create({
    ...req.body,
    receiptNumber: generateReceiptNumber()
  });

  res.status(201).json({
    status: 'success',
    data: newTransaction
  });
});

exports.processPayment = catchAsync(async (req, res) => {
  const { amount, paymentMethodId, description } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    payment_method: paymentMethodId,
    confirmation_method: 'manual',
    confirm: true,
    description
  });

  if (paymentIntent.status === 'succeeded') {
    const transaction = await Finance.create({
      type: 'Donation',
      amount,
      currency: 'USD',
      donor: req.user.id,
      paymentMethod: 'Card',
      status: 'Completed',
      description,
      receiptNumber: generateReceiptNumber()
    });

    res.status(200).json({
      status: 'success',
      data: transaction
    });
  }
});

exports.getFinancialReport = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const report = await Finance.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: report
  });
});

exports.generateTaxReceipt = catchAsync(async (req, res) => {
  const transactions = await Finance.find({
    donor: req.params.userId,
    type: { $in: ['Tithe', 'Donation'] },
    date: {
      $gte: new Date(req.query.year, 0, 1),
      $lte: new Date(req.query.year, 11, 31)
    }
  });

  const receipt = await generatePDF({
    transactions,
    year: req.query.year,
    churchInfo: {
      name: process.env.CHURCH_NAME,
      address: process.env.CHURCH_ADDRESS,
      taxId: process.env.CHURCH_TAX_ID
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      receipt: receipt.url,
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0)
    }
  });
}); 