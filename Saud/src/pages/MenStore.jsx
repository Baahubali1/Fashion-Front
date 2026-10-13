import { apiFetch } from '../api';
import React, { useEffect, useRef, useState } from 'react'
import { Heart, Eye, ShoppingBag, ArrowLeft, ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import axios from 'axios'
import { useShop } from '../context/ShopContext'

// ── MenCard ─────────────────────────────────────────────────────────────────
const MenCard = ({ product }) => {
  const cardRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { addToCart, toggleWishlist, isInWishlist } = useShop()

  const prodId = product.id || product._id || product.name
  const isWishlisted = isInWishlist(prodId)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  const badgeColors = {
    New: 'bg-black text-white',
    Bestseller: 'bg-[#b8860b] text-white',
    Limited: 'bg-[#8b1a1a] text-white',
    Icon: 'bg-[#2c3e50] text-white',
    Premium: 'bg-[#3d3d3d] text-white',
    Exclusive: 'bg-black text-white border border-white/20',
    Signature: 'bg-[#1b1b1b] text-white',
    Heritage: 'bg-[#2a1f1f] text-white',
    Rare: 'bg-[#111] text-white border border-[#b8860b]/40',
    'Avant-Garde': 'bg-white text-black',
  }

  const stars = (rating) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0))
  }

  return (
    <div
      ref={cardRef}
      className={`bg-white overflow-hidden transition-all duration-700 ease-out hover:z-10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Area */}
      <div className="relative overflow-hidden bg-[#edecea]" style={{ aspectRatio: '4/5' }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${hovered ? 'opacity-0 scale-[1.04]' : 'opacity-100 scale-100'}`}
        />
        <img
          src={product.outfitUrl}
          alt={`${product.name} outfit`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'}`}
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 z-10 text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 ${badgeColors[product.badge] || 'bg-black text-white'}`}>
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-200 hover:scale-110 hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          onClick={() => toggleWishlist(product)}
          title={isWishlisted ? "Remove from favourites" : "Save to favourites"}
        >
          <Heart size={18} fill={isWishlisted ? '#c0392b' : 'none'} color={isWishlisted ? '#c0392b' : '#111'} />
        </button>

        {/* Hover Actions */}
        <div className={`absolute bottom-3 left-3 right-3 z-10 flex gap-2 transition-all duration-300 ease-out ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <button
            onClick={() => addToCart(product)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-black hover:bg-[#b8860b] text-white text-[10px] tracking-[0.2em] uppercase py-3 transition-colors duration-200 cursor-pointer font-medium"
          >
            <ShoppingBag size={13} />
            <span>Add to Bag</span>
          </button>
          <button className="w-11 h-11 flex items-center justify-center bg-black/75 hover:bg-black backdrop-blur-sm transition-colors duration-200 cursor-pointer">
            <Eye size={16} color="white" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 pt-4 pb-5 border-b border-black/[0.04]">
        <span className="text-[9px] tracking-[0.35em] uppercase text-[#aaa]">Men's Collection</span>
        <h3 className="font-serif text-[17px] font-normal text-black mt-1 mb-1.5 tracking-[0.05em]">{product.name}</h3>
        <p className="text-[11px] text-[#888] leading-relaxed line-clamp-2 mb-3">{product.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-black">${product.price}</span>
            {product.originalPrice && (
              <span className="text-[12px] text-[#bbb] line-through">${product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#b8860b] tracking-[-0.05em]">{stars(product.rating)}</span>
            <span className="text-[10px] text-[#bbb]">({product.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MenStore (main page) ──────────────────────────────────────────────────────
const MenStore = ({ onBack }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedBadges, setSelectedBadges] = useState([])
  const [spinnerAngle, setSpinnerAngle] = useState(0)
  const { openWishlist, wishlistCount, openCart, cartCount } = useShop()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!loading) return
    const id = setInterval(() => setSpinnerAngle(a => a + 6), 16)
    return () => clearInterval(id)
  }, [loading])

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await apiFetch('/api/products');

      const menProducts = res.products.filter(
        (product) => product.category === 'Men'
      );
      console.log('Men products from MongoDB:', menProducts);
      setProducts(menProducts);
    } catch (err) {
      console.error('Failed to fetch men products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const allBadges = [...new Set(products.map(p => p.badge).filter(Boolean))]

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBadge = selectedBadges.length === 0 || selectedBadges.includes(p.badge)
      return matchesSearch && matchesBadge
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  const toggleBadge = (badge) => {
    setSelectedBadges(prev =>
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Hero Banner — pure inline gradient, no external CSS */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          height: '540px',
          background: 'linear-gradient(135deg, #080c10 0%, #0d1117 40%, #111 100%)',
        }}
      >
        {/* Subtle radial glows */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 55% at 15% 50%, rgba(255,255,255,0.03) 0%, transparent 65%), radial-gradient(ellipse 50% 60% at 85% 40%, rgba(184,134,11,0.07) 0%, transparent 65%)'
        }} />
        {/* Grain texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px'
        }} />

        <div className="relative z-10 text-center px-6 w-full max-w-3xl">
          <button
            className="inline-flex items-center gap-2 text-white/50 text-[11px] tracking-[0.2em] uppercase border border-white/[0.10] bg-transparent hover:text-white hover:border-white/30 hover:bg-white/[0.04] cursor-pointer mb-12 px-5 py-2.5 transition-all duration-300"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div>
            <span className="block text-[10px] tracking-[0.55em] uppercase text-white/30 mb-5">
              Saarte Royale
            </span>
            <h1
              className="font-serif font-light text-white tracking-[0.15em] uppercase leading-none mb-5"
              style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)' }}
            >
              The Saarte Man
            </h1>
            <p className="text-[13px] text-white/40 max-w-[460px] mx-auto mb-8 leading-loose tracking-[0.02em]">
              Precision-crafted for the man who commands every room —
              power, restraint and artistry in equal measure.
            </p>
            <div className="flex items-center gap-4 mx-auto mb-6 max-w-[180px]">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-white/30 text-[10px]">◆</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>
            <span className="text-[10px] tracking-[0.35em] uppercase text-white/25">
              {products.length} Exclusive Pieces
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="sticky top-0 z-[100] bg-[rgba(247,247,245,0.97)] backdrop-blur-xl border-b border-black/[0.07] shadow-[0_1px_24px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4 px-10 py-4 flex-wrap">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb] pointer-events-none" />
            <input
              type="text"
              placeholder="Search the collection..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-black/[0.09] bg-white text-[12px] tracking-[0.03em] text-black outline-none focus:border-black transition-colors duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Filter */}
          <button
            className={`flex items-center gap-2 px-4 py-2.5 border text-[11px] tracking-[0.12em] uppercase cursor-pointer transition-all duration-200 ${filterOpen ? 'bg-black text-white border-black' : 'border-black/[0.09] bg-white hover:bg-black hover:text-white hover:border-black'}`}
            onClick={() => setFilterOpen(f => !f)}
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
            {selectedBadges.length > 0 && (
              <span className="bg-white text-black text-[9px] w-[17px] h-[17px] rounded-full flex items-center justify-center font-bold">
                {selectedBadges.length}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              className="appearance-none pl-3.5 pr-8 py-2.5 border border-black/[0.09] bg-white text-[11px] tracking-[0.05em] cursor-pointer outline-none text-black focus:border-black transition-colors duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A–Z</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#999]" />
          </div>

          {/* Quick Wishlist & Bag Access */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={openWishlist}
              className="relative p-2.5 bg-white border border-black/[0.09] hover:bg-black hover:text-white transition-colors cursor-pointer"
              title="Saved Favourites"
            >
              <Heart size={14} className={wishlistCount > 0 ? "fill-[#c0392b] text-[#c0392b]" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#c0392b] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={openCart}
              className="relative px-3 py-2 bg-black text-white hover:bg-[#b8860b] transition-colors cursor-pointer flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-medium"
              title="Shopping Bag"
            >
              <ShoppingBag size={13} />
              <span>Bag ({cartCount})</span>
            </button>
          </div>

          <span className="text-[10px] text-[#bbb] tracking-[0.2em] uppercase whitespace-nowrap">
            {filteredProducts.length} pieces
          </span>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="px-10 py-4 border-t border-black/[0.05] flex items-center gap-4 flex-wrap bg-[#f0f0ee]">
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#999]">Filter by tag</span>
            <div className="flex gap-2 flex-wrap">
              {allBadges.map(badge => (
                <button
                  key={badge}
                  className={`px-3.5 py-1.5 border text-[10px] tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 ${selectedBadges.includes(badge) ? 'bg-black text-white border-black' : 'border-black/[0.12] bg-white hover:bg-black hover:text-white hover:border-black'}`}
                  onClick={() => toggleBadge(badge)}
                >
                  {badge}
                </button>
              ))}
              {selectedBadges.length > 0 && (
                <button
                  className="px-3.5 py-1.5 text-[10px] tracking-[0.1em] uppercase cursor-pointer border border-black/30 text-black/50 bg-transparent hover:border-black hover:text-black transition-all duration-200"
                  onClick={() => setSelectedBadges([])}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="px-10 py-16 pb-24 max-w-[1440px] mx-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            {/* Pure JS spinner — no keyframes needed */}
            <div
              className="w-10 h-10 rounded-full border-[1.5px] border-black/10 border-t-black"
              style={{ transform: `rotate(${spinnerAngle}deg)` }}
            />
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#bbb]">Curating the collection</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <p className="text-[12px] text-[#999] tracking-[0.05em]">{error}</p>
            <button
              className="px-8 py-3 bg-black hover:bg-[#1a1a1a] text-white text-[10px] tracking-[0.25em] uppercase cursor-pointer transition-colors duration-200"
              onClick={fetchProducts}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <p className="text-[12px] text-[#999] tracking-[0.05em]">No pieces match your search.</p>
            <button
              className="px-8 py-3 bg-black hover:bg-[#1a1a1a] text-white text-[10px] tracking-[0.25em] uppercase cursor-pointer transition-colors duration-200"
              onClick={() => { setSearchQuery(''); setSelectedBadges([]) }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5">
            {filteredProducts.map(product => (
              <MenCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Strip */}
      <div className="bg-black text-white/25 text-center py-5 text-[10px] tracking-[0.3em] uppercase border-t border-white/5">
        <span>◆ Saarte Royale · Men's Collection · Built with Purpose ◆</span>
      </div>

    </div>
  )
}

export default MenStore
