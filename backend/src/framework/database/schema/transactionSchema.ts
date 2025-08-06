const mongoose = require('mongoose');

export const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'wallet'],
    required: true
  },
  transactionType: {
    type: String,
    enum: ['debit', 'credit'], // debit = payment, credit = refund
    required: true
  }
});

