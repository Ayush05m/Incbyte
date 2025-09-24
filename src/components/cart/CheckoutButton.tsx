import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore, CartItem } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { paymentService } from '@/services/payment.service';

declare const Razorpay: any;

interface CheckoutButtonProps {
  items: CartItem[];
  totalPrice: number;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ items, totalPrice }) => {
  const { user } = useAuthStore();
  const { clearCart, setCartOpen } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please log in to proceed with the payment.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const order = await paymentService.createOrder(totalPrice * 100);

      const options = {
        key: 'rzp_test_your_key_here', // IMPORTANT: Replace with your actual Razorpay test key
        amount: order.amount,
        currency: order.currency,
        name: 'Sweet Shop',
        description: 'Your Delicious Order',
        image: '/favicon.ico',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Your order is confirmed.');
            clearCart();
            setCartOpen(false);
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: '#db2777',
        },
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      toast.error("Could not initiate payment. The backend service for creating orders is not available.");
      console.error("Payment initiation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button className="w-full" size="lg" onClick={handlePayment} disabled={isLoading || items.length === 0}>
      {isLoading ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
    </Button>
  );
};