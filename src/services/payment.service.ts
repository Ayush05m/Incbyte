import { api } from './api';

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export const paymentService = {
  createOrder: async (amount: number): Promise<RazorpayOrder> => {
    const response = await api.post('/payments/create-order', { amount });
    return response.data;
  },

  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ success: boolean }> => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  }
};