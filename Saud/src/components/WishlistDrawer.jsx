import React, { useEffect } from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const WishlistDrawer = () => {
  const {
    isWishlistOpen,
    closeWishlist,
    wishlist,
    removeFromWishlist,
    addToCart,
    wishlistCount,
    onNavigate,
  } = useShop();

  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isWishlistOpen) {
        closeWishlist();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  const handleMoveToBag = (item) => {
    addToCart(item);
  };

  return (
    <div className="fixed inset-0 z-[125] flex justify-end bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      {/* Click outside to close */}
      <div className="flex-1" onClick={closeWishlist} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] text-white border-l border-white/10 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-[#e11d48] fill-[#e11d48]" />
            <h3 className="font-serif text-lg tracking-[0.2em] uppercase">
              Saved Favourites
            </h3>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/70">
              {wishlistCount}
            </span>
          </div>

          <button
            onClick={closeWishlist}
            className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-16 h-16 rounded-full border border-white/15 flex items-center justify-center mb-4 text-white/30">
              <Heart size={26} />
            </div>
            <h4 className="font-serif text-xl tracking-widest uppercase mb-2">
              No Favourites Yet
            </h4>
            <p className="text-xs text-white/40 max-w-xs leading-relaxed mb-6">
              Click the heart icon on any piece you admire to curate your private Saarte wishlist.
            </p>
            <button
              onClick={() => {
                closeWishlist();
                if (onNavigate) onNavigate('women');
              }}
              className="px-6 py-3 bg-white text-black hover:bg-[#b8860b] hover:text-white text-[10px] tracking-[0.25em] uppercase font-semibold transition-colors cursor-pointer"
            >
              Discover Pieces
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-white/10">
              {wishlist.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#141414] border border-white/10 overflow-hidden flex-shrink-0 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.badge && (
                      <span className="absolute top-1 left-1 bg-black/80 text-[8px] uppercase tracking-wider px-1 text-white border border-white/20">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] tracking-[0.25em] uppercase text-white/40">
                          {item.category}
                        </span>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-white/30 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                          title="Remove from favourites"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <h4 className="font-serif text-sm text-white tracking-wide line-clamp-1 mt-0.5">
                        {item.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white font-medium">
                          ${item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[10px] text-white/40 line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleMoveToBag(item)}
                        className="w-full py-2 bg-white/10 hover:bg-white text-white hover:text-black text-[9px] tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag size={12} />
                        <span>Move To Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-[#070707] space-y-3">
              <button
                onClick={() => {
                  wishlist.forEach((item) => addToCart(item));
                }}
                className="w-full py-3.5 bg-white text-black hover:bg-[#b8860b] hover:text-white font-serif text-xs tracking-[0.25em] uppercase font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                <span>Add All to Bag</span>
              </button>

              <button
                onClick={closeWishlist}
                className="w-full py-2 text-[10px] tracking-widest uppercase text-white/40 hover:text-white text-center cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistDrawer;
