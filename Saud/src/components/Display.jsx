import React from 'react';
import ilsu from '../assets/HaYoungBlack.jpeg';
import Hayoung2 from '../assets/Gemini_Generated_Image_kasa42kasa42kasa.png';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Display = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const currentProduct = product || {
    id: 'default-noir-tuxedo',
    name: 'The Midnight Saarte Tuxedo Set',
    category: "Women's",
    price: 420,
    originalPrice: 540,
    rating: 4.8,
    reviews: 53,
    description: 'A sophisticated black tweed cropped blazer and mini skirt co-ord set with satin lapels and button detail.',
    badge: 'New',
    imageUrl: ilsu,
    outfitUrl: Hayoung2,
  };

  const prodId = currentProduct.id || currentProduct._id;
  const isFav = isInWishlist(prodId);

  const mainImage = currentProduct.imageUrl || ilsu;
  const hoverImage = currentProduct.outfitUrl || Hayoung2;

  const handleAddToBag = (e) => {
    e.stopPropagation();
    addToCart(currentProduct);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(currentProduct);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f3f2ef]">
      {/* Primary Image */}
      <img
        src={mainImage}
        alt={currentProduct.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Hover Reveal Outfit Image */}
      {hoverImage && (
        <img
          src={hoverImage}
          alt={`${currentProduct.name} styling`}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
          loading="lazy"
        />
      )}

      {/* Hover Action Overlay */}
      <div className="absolute bottom-4 left-0 w-full flex justify-between gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 z-20">
        <button
          onClick={handleAddToBag}
          className="flex-1 bg-black/90 hover:bg-[#b8860b] text-white font-serif text-[11px] tracking-[0.2em] uppercase h-11 flex items-center justify-center gap-1.5 shadow-lg transition-colors duration-200 cursor-pointer"
        >
          <ShoppingBag size={14} />
          <span>Add to Bag</span>
        </button>

        <div className="bg-white/80 hover:bg-white text-black w-11 h-11 flex justify-center items-center backdrop-blur-sm shadow-md transition-colors duration-200 cursor-pointer">
          <Eye size={17} strokeWidth={2} />
        </div>
      </div>

      {/* Heart Favourite Button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 cursor-pointer"
        title={isFav ? 'Remove from favourites' : 'Save to favourites'}
      >
        <Heart
          size={18}
          color={isFav ? '#e11d48' : '#111'}
          fill={isFav ? '#e11d48' : 'none'}
          strokeWidth={2}
        />
      </button>

      {/* Badge */}
      {currentProduct.badge && (
        <div className="bg-black text-white absolute top-3 left-4 z-20 text-[9px] tracking-[0.2em] uppercase text-center px-3 py-1 shadow-sm">
          {currentProduct.badge}
        </div>
      )}
    </div>
  );
};

export default Display;
