import React from 'react';
import { motion } from 'framer-motion';
import { useUiStore, FlyingItemData } from '@/store/uiStore';

const FlyingItem: React.FC<{ item: FlyingItemData }> = ({ item }) => {
  const { cartIconRef, removeFlyingItem } = useUiStore();
  const [targetRect, setTargetRect] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    if (cartIconRef?.current) {
      setTargetRect(cartIconRef.current.getBoundingClientRect());
    }
  }, [cartIconRef]);

  if (!targetRect) return null;

  return (
    <motion.img
      src={item.imageUrl}
      alt="flying sweet"
      className="fixed rounded-lg object-cover z-50"
      initial={{
        top: item.sourceRect.top,
        left: item.sourceRect.left,
        width: item.sourceRect.width,
        height: item.sourceRect.height,
        opacity: 1,
      }}
      animate={{
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.left + targetRect.width / 2,
        width: 0,
        height: 0,
        opacity: 0.5,
        transition: {
          duration: 0.7,
          ease: [0.5, 0, 0.75, 0], // EaseIn
        },
      }}
      onAnimationComplete={() => removeFlyingItem(item.id)}
    />
  );
};

export const FlyToCartAnimation = () => {
  const { flyingItems } = useUiStore();

  return (
    <>
      {flyingItems.map((item) => (
        <FlyingItem key={item.id} item={item} />
      ))}
    </>
  );
};