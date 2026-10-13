import { apiFetch } from '../api';
import React, { useEffect, useRef, useState } from 'react';
import {
  Heart,
  Eye,
  ShoppingBag,
  ArrowLeft,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

const BADGE_COLORS = {
  New: 'bg-black text-white',
  Bestseller: 'bg-[#b8860b] text-white',
  Limited: 'bg-[#1a1a1a] text-white border border-white/10',
  Icon: 'bg-black text-white',
  Premium: 'bg-[#3d3d3d] text-white',
  Exclusive: 'bg-black text-white border border-white/20',
  Signature: 'bg-[#1b1b1b] text-white',
};

const stars = (rating = 0) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    '★'.repeat(fullStars) +
    (hasHalfStar ? '½' : '') +
    '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
  );
};

// ── GlamourCard ───────────────────────────────────────────────────────────────

const GlamourCard = ({ product }) => {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const prodId = product.id || product._id || product.name;
  const isWishlisted = isInWishlist(prodId);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`bg-white overflow-hidden transition-all duration-700 ease-out hover:z-10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden bg-[#f5f0f3]"
        style={{ aspectRatio: '4/5' }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            hovered ? 'scale-[1.06]' : 'scale-100'
          }`}
        />

        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 ${
              BADGE_COLORS[product.badge] || 'bg-black text-white'
            }`}
          >
            {product.badge}
          </span>
        )}

        <button
          type="button"
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-200 hover:scale-110 hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          onClick={() => toggleWishlist(product)}
          title={
            isWishlisted
              ? 'Remove from favourites'
              : 'Save to favourites'
          }
          aria-label={
            isWishlisted
              ? 'Remove from favourites'
              : 'Save to favourites'
          }
        >
          <Heart
            size={18}
            fill={isWishlisted ? '#b0436e' : 'none'}
            color={isWishlisted ? '#b0436e' : '#aaa'}
          />
        </button>

        <div
          className={`absolute bottom-3 left-3 right-3 z-10 flex gap-2 transition-all duration-300 ease-out ${
            hovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-black hover:bg-[#b8860b] text-white text-[10px] tracking-[0.2em] uppercase py-3 transition-colors duration-200 cursor-pointer font-medium"
          >
            <ShoppingBag size={13} />
            <span>Add to Bag</span>
          </button>

          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center bg-black/75 hover:bg-black backdrop-blur-sm transition-colors duration-200 cursor-pointer"
            aria-label={`View ${product.name}`}
            title={`View ${product.name}`}
          >
            <Eye size={16} color="white" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-5 border-b border-black/[0.04]">
        <span className="text-[9px] tracking-[0.35em] uppercase text-[#bbb]">
          Saarte Glamour · {product.subcategory || product.category}
        </span>

        <h3 className="font-serif text-[17px] font-normal text-black mt-1 mb-1.5 tracking-[0.05em]">
          {product.name}
        </h3>

        <p className="text-[11px] text-[#888] leading-relaxed line-clamp-2 mb-3">
          {product.description || 'A carefully selected beauty essential.'}
        </p>

        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-black">
              ${Number(product.price || 0).toFixed(2)}
            </span>

            {product.originalPrice != null && (
              <span className="text-[12px] text-[#bbb] line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#b8860b] tracking-[-0.05em]">
              {stars(Number(product.rating ?? 0))}
            </span>

            <span className="text-[10px] text-[#bbb]">
              ({product.reviews ?? 0})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── GlamourStore ──────────────────────────────────────────────────────────────

const GlamourStore = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    openWishlist,
    wishlistCount,
    openCart,
    cartCount,
  } = useShop();

  // Scroll to the top when the store opens.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch products from the backend.
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiFetch('/api/products');

        const makeupProducts = (response.products || []).filter(
          (product) => product.category === 'Makeup'
        );

        if (!cancelled) {
          setProducts(makeupProducts);
        }
      } catch (err) {
        console.error('Failed to fetch makeup products:', err);

        if (!cancelled) {
          setProducts([]);
          setError('Unable to load the beauty collection. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Generate filters from the products returned by the backend.
  const allCategories = [
    ...new Set(
      products.map((product) => product.subcategory).filter(Boolean)
    ),
  ];

  const allBadges = [
    ...new Set(
      products.map((product) => product.badge).filter(Boolean)
    ),
  ];

  // Search, filter, and sort the backend products.
  const filteredProducts = products
    .filter((product) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        (product.name || '').toLowerCase().includes(query) ||
        (product.description || '').toLowerCase().includes(query);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.subcategory);

      const matchesBadge =
        selectedBadges.length === 0 ||
        selectedBadges.includes(product.badge);

      return matchesSearch && matchesCategory && matchesBadge;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }

      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }

      if (sortBy === 'rating') {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }

      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }

      return 0;
    });

  const toggleCat = (category) => {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    );
  };

  const toggleBadge = (badge) => {
    setSelectedBadges((previous) =>
      previous.includes(badge)
        ? previous.filter((item) => item !== badge)
        : [...previous, badge]
    );
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBadges([]);
  };

  const activeCount =
    selectedCategories.length + selectedBadges.length;

  return (
    <div
      className="min-h-screen bg-[#faf9f7]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Hero */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          height: '540px',
          background:
            'linear-gradient(135deg, #0a0508 0%, #1a0d14 50%, #100a1a 100%)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 20% 50%, rgba(220,130,160,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 70% at 80% 40%, rgba(200,160,80,0.08) 0%, transparent 70%)',
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 text-center px-6 w-full max-w-3xl">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-white/40 text-[11px] tracking-[0.2em] uppercase border border-white/[0.08] bg-transparent hover:text-white hover:border-white/25 hover:bg-white/[0.04] cursor-pointer mb-12 px-5 py-2.5 transition-all duration-300"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <span className="block text-[10px] tracking-[0.55em] uppercase text-white/25 mb-5">
            Saarte Glamour
          </span>

          <h1
            className="font-serif font-light text-white tracking-[0.15em] uppercase leading-none mb-5"
            style={{ fontSize: 'clamp(2.8rem, 7.5vw, 5rem)' }}
          >
            Beauty &amp; Glamour
          </h1>

          <p className="text-[13px] text-white/35 max-w-[480px] mx-auto mb-8 leading-loose tracking-[0.02em]">
            A curated universe of beauty — luxury makeup, precision tools,
            and skincare essentials for your glamour ritual.
          </p>

          <div className="flex items-center gap-4 mx-auto mb-6 max-w-[180px]">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/25 text-[10px]">◆</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <span className="text-[10px] tracking-[0.35em] uppercase text-white/20">
            {loading ? 'Loading Collection...' : `${products.length} Exclusive Pieces`}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-0 z-[100] bg-[rgba(250,249,247,0.97)] backdrop-blur-xl border-b border-black/[0.07] shadow-[0_1px_24px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4 px-10 py-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb] pointer-events-none"
            />

            <input
              type="text"
              placeholder="Search the collection..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-black/[0.09] bg-white text-[12px] tracking-[0.03em] text-black outline-none focus:border-black transition-colors duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 border text-[11px] tracking-[0.12em] uppercase cursor-pointer transition-all duration-200 ${
              filterOpen
                ? 'bg-black text-white border-black'
                : 'border-black/[0.09] bg-white hover:bg-black hover:text-white hover:border-black'
            }`}
            onClick={() => setFilterOpen((previous) => !previous)}
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>

            {activeCount > 0 && (
              <span className="bg-white text-black text-[9px] w-[17px] h-[17px] rounded-full flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              className="appearance-none pl-3.5 pr-8 py-2.5 border border-black/[0.09] bg-white text-[11px] tracking-[0.05em] cursor-pointer outline-none text-black focus:border-black transition-colors duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A–Z</option>
            </select>

            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#999]"
            />
          </div>

          {/* Wishlist and cart */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={openWishlist}
              className="relative p-2.5 bg-white border border-black/[0.09] hover:bg-black hover:text-white transition-colors cursor-pointer"
              title="Saved Favourites"
            >
              <Heart
                size={14}
                className={
                  wishlistCount > 0
                    ? 'fill-[#b0436e] text-[#b0436e]'
                    : ''
                }
              />

              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#b0436e] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={openCart}
              className="relative px-3 py-2 bg-black text-white hover:bg-[#b8860b] transition-colors cursor-pointer flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-medium"
              title="Shopping Bag"
            >
              <ShoppingBag size={13} />
              <span>Bag ({cartCount})</span>
            </button>
          </div>

          <span className="text-[10px] text-[#bbb] tracking-[0.2em] uppercase whitespace-nowrap">
            {loading ? 'Loading...' : `${filteredProducts.length} pieces`}
          </span>
        </div>

        {/* Filters */}
        {filterOpen && (
          <div className="px-10 py-4 border-t border-black/[0.05] bg-[#f5f4f2]">
            <div className="flex items-start gap-6 flex-wrap mb-3">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#999] pt-1.5 shrink-0">
                Category
              </span>

              <div className="flex gap-2 flex-wrap">
                {allCategories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => toggleCat(category)}
                    className={`px-3.5 py-1.5 border text-[10px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 ${
                      selectedCategories.includes(category)
                        ? 'bg-black text-white border-black'
                        : 'border-black/[0.12] bg-white hover:bg-black hover:text-white hover:border-black'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-6 flex-wrap">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#999] pt-1.5 shrink-0">
                Tag
              </span>

              <div className="flex gap-2 flex-wrap">
                {allBadges.map((badge) => (
                  <button
                    type="button"
                    key={badge}
                    onClick={() => toggleBadge(badge)}
                    className={`px-3.5 py-1.5 border text-[10px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 ${
                      selectedBadges.includes(badge)
                        ? 'bg-black text-white border-black'
                        : 'border-black/[0.12] bg-white hover:bg-black hover:text-white hover:border-black'
                    }`}
                  >
                    {badge}
                  </button>
                ))}

                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="px-3.5 py-1.5 text-[10px] tracking-[0.1em] uppercase cursor-pointer border border-black/30 text-black/50 bg-transparent hover:border-black hover:text-black transition-all duration-200"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="px-10 py-16 pb-24 max-w-[1440px] mx-auto">
        {loading && (
          <div className="py-24 text-center text-sm text-[#999]">
            Loading makeup collection...
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <p className="text-[12px] text-[#999]">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-black hover:bg-[#1a1a1a] text-white text-[10px] tracking-[0.25em] uppercase cursor-pointer transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <p className="text-[12px] text-[#999] tracking-[0.05em]">
              No pieces match your search.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                clearAll();
              }}
              className="px-8 py-3 bg-black hover:bg-[#1a1a1a] text-white text-[10px] tracking-[0.25em] uppercase cursor-pointer transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5">
            {filteredProducts.map((product) => (
              <GlamourCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black text-white/25 text-center py-5 text-[10px] tracking-[0.3em] uppercase border-t border-white/5">
        <span>
          ◆ Saarte Glamour · Beauty Collection · Crafted with Intention ◆
        </span>
      </div>
    </div>
  );
};

export default GlamourStore;