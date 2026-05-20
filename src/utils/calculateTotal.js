const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

const calculateDiscountedTotal = (total, discountAmount) => {
  const finalTotal = total - discountAmount;
  return finalTotal < 0 ? 0 : finalTotal;
};

export { calculateOrderTotal, calculateDiscountedTotal };
