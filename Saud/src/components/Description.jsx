import React from 'react';

const Description = ({ product }) => {
  const currentProduct = product || {
    name: 'The Midnight Saarte Tuxedo Set',
    category: "Women's Collection",
    price: 420,
    originalPrice: 540,
    rating: 4.8,
    reviews: 53,
    description:
      'A sophisticated black tweed cropped blazer and mini skirt co-ord set with satin lapels and button detail. A timeless two-piece that effortlessly transitions from boardroom to evening.',
  };

  return (
    <div className="flex flex-col gap-2.5 px-5 py-4 bg-white border-t border-black/[0.04]">
      <div>
        <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 font-sans">
          {currentProduct.category}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-base tracking-wide text-gray-900 line-clamp-1">
          {currentProduct.name}
        </h2>
        <span className="line-clamp-2 text-gray-500 text-xs leading-relaxed">
          {currentProduct.description}
        </span>
      </div>

      <div className="flex justify-between items-center pt-1 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black">${currentProduct.price}</span>
          {currentProduct.originalPrice && (
            <span className="line-through text-gray-400 text-xs">
              ${currentProduct.originalPrice}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span className="text-[#b8860b]">★</span>
          <span className="font-medium text-gray-800">{currentProduct.rating || 4.8}</span>
          <span className="text-gray-400">({currentProduct.reviews || 48})</span>
        </div>
      </div>
    </div>
  );
};

export default Description;
