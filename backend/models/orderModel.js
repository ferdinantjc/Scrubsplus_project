import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    
    // Updated status field with clear stages
    status: {
        type: String,
        enum: ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'],
        default: 'Order Placed',
        required: true
    },

    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true }
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);
export default orderModel;
