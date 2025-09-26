import { api } from './api';
import { Purchase, RazorpayOrder } from '@/types/purchase.types';

interface PurchaseResponse {
  purchase: Purchase;
  order: RazorpayOrder;
}

interface VerifyPaymentRequest {
  order_id: string;
  payment_id: string;
  signature: string;
}

export const paymentService = {
  initiatePurchase: async (sweetId: number, quantity: number): Promise<PurchaseResponse> => {
    const response = await api.post('/purchases/initiate', {
      sweet_id: sweetId,
      quantity: quantity,
    });
    return response.data;
  },

  verifyPayment: async (paymentData: VerifyPaymentRequest): Promise<{ message: string }> => {
    const response = await api.post('/purchases/verify', paymentData);
    return response.data;
  },
};