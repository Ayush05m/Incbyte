import React, { useState } from 'react';
import { useCartStore, useCartTotals, CartItem } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { paymentService } from '@/services/payment.service';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

declare const Razorpay: any;

export const CartSheet = () => {
  const { items, isCartOpen, toggleCart, removeItem, updateItemQuantity } = useCartStore();
  const { cartCount } = useCartTotals();
  const { user } = useAuthStore();
  const [payingItemId, setPayingItemId] = useState<number | null>(null);

  const handlePayment = async (item: CartItem) => {
    if (!user) {
      toast.error("Please log in to proceed with the payment.");
      return;
    }
    
    setPayingItemId(item.id);
    
    try {
      const { order } = await paymentService.initiatePurchase(item.id, item.quantityInCart);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Sweet Shop',
        description: `Purchase of ${item.quantityInCart} x ${item.name}`,
        image: '/favicon.ico',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await paymentService.verifyPayment({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Your order is confirmed.');
            removeItem(item.id);
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setPayingItemId(null);
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: '#db2777',
        },
        modal: {
          ondismiss: function() {
            setPayingItemId(null);
          }
        }
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
        setPayingItemId(null);
      });
      rzp.open();

    } catch (error) {
      toast.error("Could not initiate payment. Please try again later.");
      console.error("Payment initiation error:", error);
      setPayingItemId(null);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <img
                      src={item.imageUrl || '/placeholder.svg'}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price} x {item.quantityInCart} = ₹{item.price * item.quantityInCart}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.id, item.quantityInCart - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantityInCart}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.id, item.quantityInCart + 1)}
                          disabled={item.quantityInCart >= item.quantity}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => handlePayment(item)}
                        disabled={payingItemId !== null}
                        className="w-full"
                      >
                        {payingItemId === item.id ? 'Processing...' : 'Pay Now'}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="text-gray-500">Add some sweets to get started!</p>
            <SheetClose asChild>
              <Button variant="outline" className="mt-4">Continue Shopping</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};