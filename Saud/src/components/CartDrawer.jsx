import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const FREE_SHIPPING_THRESHOLD = 300;

const CartDrawer = () => {
  const {
    isCartOpen,
    closeCart,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    onNavigate,
    showToast,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsCheckingOut(false);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'ROYALE10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      showToast('10% Royal Privilege discount applied!', 'success');
    } else if (cleanCode === 'SAARTE20' || cleanCode === 'WELCOME20') {
      setDiscountPercent(20);
      setPromoApplied(true);
      showToast('20% Exclusive discount applied!', 'success');
    } else {
      showToast('Invalid promotional code. Try ROYALE10', 'error');
    }
  };

  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    setIsCheckingOut(true);
  };

  const confirmOrder = () => {
    clearCart();
    setIsCheckingOut(false);
    closeCart();
    showToast('Order confirmed! A confirmation email has been dispatched.', 'success');
  };

  return (
    <div className="fixed inset-0 z-[125] flex justify-end bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      {/* Click outside to close */}
      <div className="flex-1" onClick={closeCart} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] text-white border-l border-white/10 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#b8860b]" />
            <h3 className="font-serif text-lg tracking-[0.2em] uppercase">
              Shopping Bag
            </h3>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/70">
              {cartCount}
            </span>
          </div>

          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-6 py-3.5 bg-white/[0.03] border-b border-white/10">
          <div className="flex items-center justify-between text-[11px] mb-2 tracking-wider">
            {amountToFreeShipping > 0 ? (
              <span className="text-white/70">
                Add <span className="text-white font-semibold">${amountToFreeShipping.toFixed(2)}</span> more for complimentary delivery
              </span>
            ) : (
              <span className="text-[#b8860b] flex items-center gap-1 font-medium">
                <Sparkles size={12} />
                Complimentary Worldwide Shipping Unlocked!
              </span>
            )}
            <span className="text-white/40 text-[10px]">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#b8860b] to-white transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Content Area */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-16 h-16 rounded-full border border-white/15 flex items-center justify-center mb-4 text-white/30">
              <ShoppingBag size={26} />
            </div>
            <h4 className="font-serif text-xl tracking-widest uppercase mb-2">
              Your Bag is Empty
            </h4>
            <p className="text-xs text-white/40 max-w-xs leading-relaxed mb-6">
              Explore the timeless silhouettes of the Saarte collections and add pieces to your private wardrobe.
            </p>
            <button
              onClick={() => {
                closeCart();
                if (onNavigate) onNavigate('women');
              }}
              className="px-6 py-3 bg-white text-black hover:bg-[#b8860b] hover:text-white text-[10px] tracking-[0.25em] uppercase font-semibold transition-colors cursor-pointer"
            >
              Explore Collections
            </button>
          </div>
        ) : isCheckingOut ? (
          /* Simulated Checkout View */
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#b8860b] mb-4">
                <ShieldCheck size={20} />
                <span className="text-xs tracking-[0.25em] uppercase font-serif">
                  Bespoke Checkout
                </span>
              </div>
              <h4 className="font-serif text-xl tracking-wider uppercase mb-3">
                Complete Your Order
              </h4>
              <p className="text-xs text-white/50 leading-relaxed mb-6">
                Your luxury garments will be prepared in handcrafted Saarte boxes with insured priority delivery.
              </p>

              <div className="bg-white/5 border border-white/10 p-4 space-y-2 mb-6 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Items Count:</span>
                  <span className="text-white">{cartCount} pieces</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping:</span>
                  <span className="text-white">Complimentary</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#b8860b]">
                    <span>Privilege Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-serif text-base pt-2 border-t border-white/10">
                  <span>Total Payable:</span>
                  <span className="font-semibold">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Delivery Address"
                  defaultValue="221B Baker Street, London"
                  className="w-full bg-white/5 border border-white/15 p-3 text-xs tracking-wide text-white outline-none focus:border-white"
                />
                <input
                  type="text"
                  placeholder="Card Number (Demo)"
                  defaultValue="•••• •••• •••• 4242"
                  className="w-full bg-white/5 border border-white/15 p-3 text-xs tracking-wide text-white outline-none focus:border-white"
                />
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <button
                onClick={confirmOrder}
                className="w-full py-4 bg-white text-black hover:bg-[#b8860b] hover:text-white font-serif text-xs tracking-[0.25em] uppercase font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check size={16} />
                <span>Place Order (${finalTotal.toFixed(2)})</span>
              </button>
              <button
                onClick={() => setIsCheckingOut(false)}
                className="w-full py-2.5 text-white/40 hover:text-white text-[10px] tracking-widest uppercase cursor-pointer"
              >
                Back to Bag
              </button>
            </div>
          </div>
        ) : (
          /* Normal Cart Items View */
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-white/10">
              {cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#141414] border border-white/10 overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] tracking-[0.25em] uppercase text-white/40">
                          {item.category}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/30 hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h4 className="font-serif text-sm text-white tracking-wide line-clamp-1 mt-0.5">
                        {item.name}
                      </h4>
                      <p className="text-xs text-white/80 mt-1 font-mono">
                        ${item.price}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-white/15 bg-white/5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="px-6 py-3 border-t border-white/10 bg-white/[0.02]">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code (e.g. ROYALE10)"
                  className="flex-1 bg-white/5 border border-white/15 px-3 py-2 text-xs tracking-wider text-white placeholder-white/30 outline-none uppercase focus:border-white"
                />
                <button
                  type="submit"
                  className="px-4 bg-white/10 hover:bg-white text-white hover:text-black text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            </div>

            {/* Footer Summary */}
            <div className="p-6 border-t border-white/10 bg-[#070707] space-y-3">
              <div className="space-y-1.5 text-xs text-white/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">${cartSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#b8860b]">
                    <span>Privilege Discount ({discountPercent}%)</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Worldwide Delivery</span>
                  <span className="text-white">Complimentary</span>
                </div>
                <div className="flex justify-between text-base font-serif text-white pt-2 border-t border-white/10">
                  <span className="tracking-widest uppercase">Estimated Total</span>
                  <span className="font-semibold font-mono">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-white text-black hover:bg-[#b8860b] hover:text-white font-serif text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={clearCart}
                  className="text-[10px] tracking-wider uppercase text-white/30 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Clear Bag
                </button>
                <button
                  onClick={closeCart}
                  className="text-[10px] tracking-wider uppercase text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
