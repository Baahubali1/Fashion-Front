import { apiFetch } from '../api';
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Heart, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const POPULAR_SEARCHES = ['Tuxedo', 'Noir', 'Blazer', 'Mascara', 'Silk', 'Gua Sha', 'Lipstick', 'Onyx', 'Gold'];

const SearchModal = () => {
  const {
    isSearchOpen,
    closeSearch,
    addToCart,
    toggleWishlist,
    isInWishlist,
    onNavigate,
  } = useShop();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [backendProducts, setBackendProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const inputRef = useRef(null);

  // Focus input on open & listen to Escape key
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedCategory('All');
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);


  useEffect(() => {
  if (!isSearchOpen) return;

  let cancelled = false;

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);

      const data = await apiFetch('/api/products');

      if (!cancelled) {
        setBackendProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch search products:', err);

      if (!cancelled) {
        setBackendProducts([]);
      }
    } finally {
      if (!cancelled) {
        setProductsLoading(false);
      }
    }
  };

  fetchProducts();

  return () => {
    cancelled = true;
  };
}, [isSearchOpen]);

  // Filter products
  const filteredProducts = backendProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(q);
    const descMatch = product.description?.toLowerCase().includes(q);
    const catMatch = product.category?.toLowerCase().includes(q);
    const badgeMatch = product.badge?.toLowerCase().includes(q);

    return nameMatch || descMatch || catMatch || badgeMatch;
  });

  const handleProductNavigate = (category) => {
    closeSearch();
    if (onNavigate) {
      if (category.toLowerCase() === 'women') onNavigate('women');
      else if (category.toLowerCase() === 'men') onNavigate('men');
      else if (category.toLowerCase() === 'makeup') onNavigate('makeup');
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex flex-col justify-start items-center bg-black/85 backdrop-blur-md transition-all duration-300">
      {/* Top Bar with Search Input */}
      <div className="w-full max-w-5xl px-6 pt-8 pb-6 border-b border-white/10">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-[#b8860b]" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-white/50 font-serif">
              Saarte Discovery
            </span>
          </div>

          <button
            onClick={closeSearch}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-xs tracking-widest uppercase cursor-pointer"
          >
            <span>Close</span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-white">
              <X size={16} />
            </div>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative flex items-center mt-3">
          <Search size={24} className="absolute left-4 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search silhouettes, bespoke pieces, beauty..."
            className="w-full bg-white/5 border border-white/15 focus:border-[#b8860b] rounded-none py-4 pl-14 pr-12 text-white placeholder-white/35 font-serif text-lg tracking-wide outline-none transition-all duration-300 focus:bg-white/[0.08]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 text-white/40 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Pills & Trending */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
          {/* Category Tabs */}
          <div className="flex items-center gap-2">
            {['All', 'Women', 'Men', 'Makeup'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] tracking-[0.25em] uppercase px-4 py-1.5 transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-semibold'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] tracking-wider uppercase text-white/40 hidden md:inline">
              Suggested:
            </span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-[10px] text-white/70 hover:text-[#b8860b] underline underline-offset-4 cursor-pointer transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-5xl flex-1 overflow-y-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
            {query.trim() ? `Search results for "${query}"` : 'Curated Masterpieces'}
          </span>
          <span className="text-[11px] tracking-widest text-[#b8860b] font-serif">
            {filteredProducts.length} pieces found
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search size={40} className="text-white/20 mb-4" />
            <h3 className="font-serif text-2xl text-white tracking-widest uppercase mb-2">
              No matching pieces found
            </h3>
            <p className="text-xs text-white/40 max-w-md tracking-wider leading-relaxed mb-6">
              We couldn't find anything matching "{query}". Try browsing our signature categories or check spelling.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('All');
              }}
              className="text-[11px] tracking-[0.25em] uppercase px-6 py-2.5 bg-white text-black hover:bg-[#b8860b] hover:text-white transition-colors cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const prodId = product.id || product._id;
              const isFav = isInWishlist(prodId);

              return (
                <div
                  key={prodId}
                  className="group relative bg-[#111] border border-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:border-white/30 hover:shadow-2xl"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-black/90 text-white border border-white/20 text-[8px] tracking-[0.2em] uppercase px-2 py-0.5">
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:scale-110 transition-all cursor-pointer"
                      title={isFav ? 'Remove from favourites' : 'Save to favourites'}
                    >
                      <Heart
                        size={14}
                        fill={isFav ? '#e11d48' : 'none'}
                        color={isFav ? '#e11d48' : '#fff'}
                      />
                    </button>

                    {/* Quick Add To Bag Hover Action */}
                    <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white text-black hover:bg-[#b8860b] hover:text-white text-[9px] tracking-[0.2em] uppercase transition-colors cursor-pointer font-semibold"
                      >
                        <ShoppingBag size={12} />
                        <span>Add To Bag</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[9px] tracking-[0.25em] uppercase text-white/40 mb-1">
                        <span>{product.category}</span>
                        {product.rating && (
                          <span className="text-[#b8860b]">★ {product.rating}</span>
                        )}
                      </div>

                      <h4 className="font-serif text-white text-sm tracking-wide line-clamp-1 mb-1">
                        {product.name}
                      </h4>

                      <p className="text-[10px] text-white/50 line-clamp-1 leading-relaxed mb-3">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-xs">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-white/40 text-[10px] line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleProductNavigate(product.category)}
                        className="flex items-center gap-1 text-[9px] tracking-widest uppercase text-white/70 hover:text-white hover:underline cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
