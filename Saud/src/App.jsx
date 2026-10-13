
import { apiFetch } from './api';
import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import Body from './components/Body';
import Navbar from './components/Navbar';
import WomenStore from './pages/WomenStore';
import MenStore from './pages/MenStore';
import GlamourStore from './pages/GlamourStore';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ToastNotification from './components/ToastNotification';
import { ShopProvider } from './context/ShopContext';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const [womenProducts, setWomenProducts] = useState([]);
  const [menProducts, setMenProducts] = useState([]);
  const [homeMakeup, setHomeMakeup] = useState([]);

  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError('');

        const data = await apiFetch('/api/products');
        const products = data.products || [];

        if (cancelled) return;

        setWomenProducts(
          products.filter((product) => product.category === 'Women')
        );

        setMenProducts(
          products.filter((product) => product.category === 'Men')
        );

        setHomeMakeup(
          products
            .filter((product) => product.category === 'Makeup')
            .slice(0, 4)
        );
      } catch (error) {
        console.error('Error fetching products:', error);

        if (!cancelled) {
          setProductsError(
            'Unable to load products. Please try again later.'
          );

          setWomenProducts([]);
          setMenProducts([]);
          setHomeMakeup([]);
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
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopProvider onNavigate={handleNavigate}>
      {/* Global Modals & Notifications */}
      <SearchModal />
      <AuthModal />
      <CartDrawer />
      <WishlistDrawer />
      <ToastNotification />

      {/* Pages View */}
      {currentPage === 'women' && (
        <WomenStore onBack={() => handleNavigate('home')} />
      )}

      {currentPage === 'men' && (
        <MenStore onBack={() => handleNavigate('home')} />
      )}

      {currentPage === 'makeup' && (
        <GlamourStore onBack={() => handleNavigate('home')} />
      )}

      {currentPage === 'home' && (
        <div className="min-h-screen bg-white">
          {/* Navbar */}
          <Navbar onNavigate={handleNavigate} />

          {/* Hero */}
          <Body
            onExploreHer={() => handleNavigate('women')}
            onExploreHim={() => handleNavigate('men')}
          />

          {/* Women's Collection */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="py-16 flex flex-col items-center">
              <span className="text-[10px] tracking-[0.5em] uppercase text-gray-500 mb-4">
                Saarte Royale
              </span>

              <div className="flex items-center w-full px-8 gap-6">
                <div className="h-px bg-black/20 flex-1" />

                <h2 className="text-3xl font-serif tracking-[0.3em] uppercase">
                  Women
                </h2>

                <div className="h-px bg-black/20 flex-1" />
              </div>

              <p className="mt-4 text-[11px] tracking-[0.3em] uppercase text-gray-400">
                The Saarte Woman
              </p>
            </div>

            {productsLoading ? (
              <p className="py-10 text-center text-sm text-gray-400">
                Loading women's collection...
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {womenProducts.map((product) => (
                  <Card
                    key={product._id || product.id}
                    product={{
                      ...product,
                      id: product._id || product.id,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="py-10 text-center">
              <button
                onClick={() => handleNavigate('women')}
                className="text-[11px] tracking-[0.25em] uppercase px-8 py-3.5 border border-black hover:bg-black hover:text-white transition-all duration-300 font-medium cursor-pointer"
              >
                Discover All Women Pieces
              </button>
            </div>
          </section>

          {/* Men's Collection */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="py-16 flex flex-col items-center">
              <span className="text-[10px] tracking-[0.5em] uppercase text-gray-500 mb-4">
                Saarte Royale
              </span>

              <div className="flex items-center w-full px-8 gap-6">
                <div className="h-px bg-black/20 flex-1" />

                <h2 className="text-3xl font-serif tracking-[0.3em] uppercase">
                  Men
                </h2>

                <div className="h-px bg-black/20 flex-1" />
              </div>

              <p className="mt-4 text-[11px] tracking-[0.3em] uppercase text-gray-400">
                The Saarte Man
              </p>
            </div>

            {productsLoading ? (
              <p className="py-10 text-center text-sm text-gray-400">
                Loading men's collection...
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {menProducts.map((product) => (
                  <Card
                    key={product._id || product.id}
                    product={{
                      ...product,
                      id: product._id || product.id,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="py-10 text-center">
              <button
                onClick={() => handleNavigate('men')}
                className="text-[11px] tracking-[0.25em] uppercase px-8 py-3.5 border border-black hover:bg-black hover:text-white transition-all duration-300 font-medium cursor-pointer"
              >
                Discover All Men Pieces
              </button>
            </div>
          </section>

          {/* Makeup Collection */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="py-16 flex flex-col items-center">
              <span className="text-[10px] tracking-[0.5em] uppercase text-gray-500 mb-4">
                Saarte Royale
              </span>

              <div className="flex items-center w-full px-8 gap-6">
                <div className="h-px bg-black/20 flex-1" />

                <h2 className="text-3xl font-serif tracking-[0.3em] uppercase">
                  Makeup
                </h2>

                <div className="h-px bg-black/20 flex-1" />
              </div>

              <p className="mt-4 text-[11px] tracking-[0.3em] uppercase text-gray-400">
                The Saarte Glory
              </p>
            </div>

            {productsLoading ? (
              <p className="py-10 text-center text-sm text-gray-400">
                Loading makeup collection...
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {homeMakeup.map((product) => (
                  <Card
                    key={product._id || product.id}
                    product={{
                      ...product,
                      id: product._id || product.id,
                    }}
                  />
                ))}
              </div>
            )}

            {!productsLoading && homeMakeup.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                {productsError || 'No makeup products are currently available.'}
              </p>
            )}

            <div className="py-10 text-center">
              <button
                onClick={() => handleNavigate('makeup')}
                className="text-[11px] tracking-[0.25em] uppercase px-8 py-3.5 border border-black hover:bg-black hover:text-white transition-all duration-300 font-medium cursor-pointer"
              >
                Discover All Makeup Pieces
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-10 py-16 bg-[#0a0a0a] text-white border-t border-white/10 mt-16">
            {/* Shop */}
            <div>
              <h3 className="font-semibold text-xs tracking-[0.2em] uppercase text-[#b8860b]">
                Saarte Collections
              </h3>

              <div className="mt-6 flex flex-col gap-3 text-sm text-white/70">
                <button
                  onClick={() => handleNavigate('women')}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  Women's Wardrobe
                </button>

                <button
                  onClick={() => handleNavigate('men')}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  Men's Tailoring
                </button>

                <button
                  onClick={() => handleNavigate('makeup')}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  Makeup & Beauty
                </button>

                <span className="text-white/40">
                  Accessories & Leather
                </span>

                <span className="text-white/40">
                  Haute Couture
                </span>
              </div>
            </div>

            {/* Corporate Info */}
            <div>
              <h3 className="font-semibold text-xs tracking-[0.2em] uppercase text-[#b8860b]">
                Corporate Info
              </h3>

              <div className="mt-6 flex flex-col gap-3 text-sm text-white/70">
                <span className="hover:text-white cursor-pointer">
                  About Saarte
                </span>
                <span className="hover:text-white cursor-pointer">
                  Our Story
                </span>
                <span className="hover:text-white cursor-pointer">
                  Sustainability
                </span>
                <span className="hover:text-white cursor-pointer">
                  Careers
                </span>
                <span className="hover:text-white cursor-pointer">
                  Press & Editorial
                </span>
              </div>
            </div>

            {/* Help */}
            <div>
              <h3 className="font-semibold text-xs tracking-[0.2em] uppercase text-[#b8860b]">
                Client Services
              </h3>

              <div className="mt-6 flex flex-col gap-3 text-sm text-white/70">
                <span className="hover:text-white cursor-pointer">
                  Customer Care
                </span>
                <span className="hover:text-white cursor-pointer">
                  Private Consultations
                </span>
                <span className="hover:text-white cursor-pointer">
                  Store Locator
                </span>
                <span className="hover:text-white cursor-pointer">
                  Complimentary Shipping & Returns
                </span>
                <span className="hover:text-white cursor-pointer">
                  Authenticity Guarantee
                </span>
              </div>
            </div>

            {/* About Saarte */}
            <div>
              <h3 className="font-semibold text-xs tracking-[0.2em] uppercase text-[#b8860b]">
                About Saarte
              </h3>

              <p className="mt-6 text-sm leading-6 text-white/60">
                Saarte is a language of fashion without borders bringing
                cultures, craftsmanship, and contemporary style together.
              </p>

              <div className="mt-6 text-xs text-white/40 tracking-wider">
                © {new Date().getFullYear()} SAARTE ROYALE. ALL RIGHTS RESERVED.
              </div>
            </div>
          </footer>
        </div>
      )}
    </ShopProvider>
  );
};

export default App;