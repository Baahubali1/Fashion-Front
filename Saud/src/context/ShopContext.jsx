import { apiFetch } from '../api';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const ShopProvider = ({ children, onNavigate }) => {
  // ── Cart State ─────────────────────────────────────────────────────────────
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('saarte_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Wishlist / Favourite State ─────────────────────────────────────────────
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('saarte_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Auth / User State ──────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('saarte_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ── Modals & Drawers ───────────────────────────────────────────────────────
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // ── Toast Notification ─────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('saarte_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('saarte_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('saarte_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('saarte_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const showToast = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Helper to extract id reliably
  const getItemId = (item) => String(item.id || item._id);

  // ── Cart Actions ───────────────────────────────────────────────────────────
  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const prodId = getItemId(product);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => getItemId(item) === prodId);
      if (existing) {
        return prevCart.map((item) =>
          getItemId(item) === prodId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: prodId,
            name: product.name,
            price: Number(product.price) || 0,
            originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
            imageUrl: product.imageUrl || product.outfitUrl || '',
            category: product.category || 'Luxury',
            badge: product.badge || '',
            quantity: quantity,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to your Bag`, 'success');
  };

  const removeFromCart = (productId) => {
    const pId = String(productId);
    const item = cart.find((i) => getItemId(i) === pId);
    setCart((prev) => prev.filter((i) => getItemId(i) !== pId));
    if (item) {
      showToast(`Removed "${item.name}" from your Bag`, 'info');
    }
  };

  const updateQuantity = (productId, delta) => {
    const pId = String(productId);
    setCart((prev) =>
      prev
        .map((item) => {
          if (getItemId(item) === pId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
    showToast('Your Bag has been cleared', 'info');
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  // ── Wishlist / Favourite Actions ───────────────────────────────────────────
  const isInWishlist = (productId) => {
    const pId = String(productId);
    return wishlist.some((item) => getItemId(item) === pId);
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const prodId = getItemId(product);

    if (isInWishlist(prodId)) {
      setWishlist((prev) => prev.filter((item) => getItemId(item) !== prodId));
      showToast(`Removed "${product.name}" from Favourites`, 'info');
    } else {
      setWishlist((prev) => [
        ...prev,
        {
          id: prodId,
          name: product.name,
          price: Number(product.price) || 0,
          originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
          imageUrl: product.imageUrl || product.outfitUrl || '',
          category: product.category || 'Luxury',
          badge: product.badge || '',
          rating: product.rating || 5.0,
          reviews: product.reviews || 0,
        },
      ]);
      showToast(`Saved "${product.name}" to Favourites`, 'success');
    }
  };

  const removeFromWishlist = (productId) => {
    const pId = String(productId);
    const item = wishlist.find((i) => getItemId(i) === pId);
    setWishlist((prev) => prev.filter((i) => getItemId(i) !== pId));
    if (item) {
      showToast(`Removed "${item.name}" from Favourites`, 'info');
    }
  };

  const wishlistCount = wishlist.length;

  // ── Auth Actions ───────────────────────────────────────────────────────────
  // ── Auth Actions ───────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  try {
    const data = await apiFetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const token = data.token || data.data?.token;
    const account = data.user || data.data?.user;

    if (!token) {
      throw new Error('Login succeeded but the server did not return a token.');
    }

    const newUser = {
      ...(account || {}),
      name: account?.name || email.split('@')[0],
      email: account?.email || email,
      token,
    };

    setUser(newUser);
    setIsAuthOpen(false);
    showToast(`Welcome back, ${newUser.name}!`, 'success');
    return true;
  } catch (error) {
    throw error;
  }
};

const signup = async ({ name, email, password }) => {
  const data = await apiFetch('/api/users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

  // Some APIs register the user and return a token immediately;
  // others require the user to log in after registering.
  const token = data.token || data.data?.token;
  const account = data.user || data.data?.user;

  if (token) {
    const newUser = {
      ...(account || {}),
      name: account?.name || name,
      email: account?.email || email,
      token,
    };

    setUser(newUser);
    setIsAuthOpen(false);
    showToast(`Account created! Welcome to Saarte Royale, ${newUser.name}`, 'success');
  } else {
    setAuthMode('login');
    showToast('Account created! Please sign in.', 'success');
  }

  return true;
};

const logout = async () => {
  const token = user?.token;

  try {
    if (token) {
      await apiFetch('/api/users/logout', {
        method: 'POST',
        token,
      });
    }
  } catch (error) {
    // Even if the logout request fails, clear the local session.
    console.error('Backend logout failed:', error.message);
  } finally {
    setUser(null);
    localStorage.removeItem('saarte_user');
    showToast('Signed out of Saarte Royale', 'info');
  }
};

  // ── Modal Handlers ─────────────────────────────────────────────────────────
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };
  const closeAuth = () => setIsAuthOpen(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  return (
    <ShopContext.Provider
      value={{
        // Catalog
        onNavigate,

        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,

        // Wishlist
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        wishlistCount,

        // Auth
        user,
        login,
        signup,
        logout,

        // Modals
        isSearchOpen,
        openSearch,
        closeSearch,
        isAuthOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
        isCartOpen,
        openCart,
        closeCart,
        isWishlistOpen,
        openWishlist,
        closeWishlist,

        // Toast
        toast,
        showToast,
        closeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
