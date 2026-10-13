import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Crown,
  User,
  Heart,
  ShoppingBag,
  MessageCircle,
  Search,
  LogIn,
  UserPlus,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useShop } from "../context/ShopContext";

const Header = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    openSearch,
    user,
    openAuth,
    logout,
    openWishlist,
    wishlistCount,
    openCart,
    cartCount,
  } = useShop();

  // Detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNav = (page) => {
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 h-16 w-full z-50
        transition-all duration-500
        ${
          scrolled
            ? "bg-black/95 backdrop-blur-md border-b border-white/10 shadow-lg"
            : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-full mx-auto h-full flex items-center justify-between px-6">

        {/* =====================================================
            LEFT — MENU
        ====================================================== */}
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              flex items-center gap-4
              text-white
              hover:text-gray-300
              transition-colors duration-300
              cursor-pointer
            "
          >
            {!menuOpen && (
              <Menu
                size={22}
                strokeWidth={1.5}
              />
            )}

            <span className="hidden md:inline text-xs tracking-[0.2em] uppercase text-gray-300">
              Menu
            </span>
          </button>

          {/* =====================================================
              SIDE MENU (DRAWER)
          ====================================================== */}
          <div
            className={`
              fixed top-0 left-0
              h-screen w-[380px]
              bg-[#0a0a0a]
              border-r border-white/10
              z-[90]
              transform
              transition-transform
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                menuOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
              }
            `}
          >
            <div className="h-full flex flex-col px-10 py-8 overflow-y-auto">

              {/* SIDE MENU HEADER */}
              <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <h2 className="text-white font-serif text-2xl tracking-[0.28em] uppercase">
                    Saarte
                  </h2>
                  <Crown
                    size={17}
                    strokeWidth={1.2}
                    className="text-[#b8860b]"
                  />
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="
                    group
                    w-10 h-10
                    flex items-center justify-center
                    rounded-full
                    border border-white/15
                    text-white/70
                    hover:text-white
                    hover:border-white/50
                    transition-all duration-500
                    cursor-pointer
                  "
                >
                  <X
                    size={18}
                    strokeWidth={1.2}
                    className="group-hover:rotate-90 transition-transform duration-500"
                  />
                </button>
              </div>

              {/* MENU NAVIGATION */}
              <nav className="flex flex-col mt-8">
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4">
                  Collections
                </span>

                {/* HOME */}
                <button
                  onClick={() => handleNav('home')}
                  className="py-3 border-b border-white/10 font-serif text-xl text-white/90 hover:text-white transition-all text-left cursor-pointer"
                >
                  Home
                </button>

                {/* WOMEN */}
                <button
                  onClick={() => handleNav('women')}
                  className="py-3 border-b border-white/10 font-serif text-xl text-white/90 hover:text-white transition-all text-left cursor-pointer"
                >
                  Women
                </button>

                {/* MEN */}
                <button
                  onClick={() => handleNav('men')}
                  className="py-3 border-b border-white/10 font-serif text-xl text-white/90 hover:text-white transition-all text-left cursor-pointer"
                >
                  Men
                </button>

                {/* MAKEUP */}
                <button
                  onClick={() => handleNav('makeup')}
                  className="py-3 border-b border-white/10 font-serif text-xl text-white/90 hover:text-white transition-all text-left cursor-pointer"
                >
                  Makeup & Beauty
                </button>

                {/* QUICK ACCESS ACTION BUTTONS IN MOBILE MENU */}
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/30 mt-8 mb-4">
                  Private Client
                </span>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openSearch();
                  }}
                  className="flex items-center gap-3 py-2.5 text-sm text-white/70 hover:text-white text-left cursor-pointer"
                >
                  <Search size={16} />
                  <span>Search Catalog</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (user) {
                      logout();
                    } else {
                      openAuth('login');
                    }
                  }}
                  className="flex items-center gap-3 py-2.5 text-sm text-white/70 hover:text-white text-left cursor-pointer"
                >
                  <User size={16} />
                  <span>{user ? `Account (${user.name})` : 'Sign In / Register'}</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openWishlist();
                  }}
                  className="flex items-center justify-between py-2.5 text-sm text-white/70 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Heart size={16} />
                    <span>Favourites</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white">
                    {wishlistCount}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openCart();
                  }}
                  className="flex items-center justify-between py-2.5 text-sm text-white/70 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={16} />
                    <span>Shopping Bag</span>
                  </div>
                  <span className="text-xs bg-white text-black font-semibold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                </button>
              </nav>

              {/* BOTTOM BRAND MESSAGE */}
              <div className="mt-auto pt-8 border-t border-white/10">
                <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 mb-2">
                  The Language of Fashion
                </p>
                <p className="font-serif italic text-white/50 text-xs leading-relaxed">
                  Fashion has no borders.
                  <br />
                  Saarte speaks its language.
                </p>
              </div>

            </div>
          </div>

          {/* DARK OVERLAY */}
          <div
            onClick={() => setMenuOpen(false)}
            className={`
              fixed
              inset-0
              bg-black/60
              backdrop-blur-[2px]
              z-[80]
              transition-all
              duration-700
              ${
                menuOpen
                  ? "opacity-100 visible"
                  : "opacity-0 invisible"
              }
            `}
          />
        </div>

        {/* =====================================================
            CENTER — SAARTE LOGO
        ====================================================== */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 group cursor-pointer bg-transparent border-0"
          >
            <h1
              className="
                font-serif
                text-2xl
                md:text-3xl
                tracking-[0.3em]
                text-white
                uppercase
                group-hover:tracking-[0.35em]
                transition-all duration-300
              "
            >
              Saarte
            </h1>

            <Crown
              size={20}
              strokeWidth={1.2}
              className="text-[#b8860b] group-hover:rotate-12 transition-transform duration-300"
            />
          </button>
        </div>

        {/* =====================================================
            RIGHT — ACTIONS
        ====================================================== */}
        <div className="flex-1 flex justify-end items-center gap-5 sm:gap-6">

          {/* 1. SEARCH BUTTON */}
          <button
            onClick={openSearch}
            className="
              text-white/80
              hover:text-white
              hover:scale-110
              transition-all duration-300
              cursor-pointer
            "
            title="Search collections"
          >
            <Search
              size={20}
              strokeWidth={1.5}
            />
          </button>

          {/* 2. LOGIN / ACCOUNT BUTTON WITH DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              className="
                flex items-center gap-2
                text-gray-300
                hover:text-white
                transition-colors duration-300
                cursor-pointer
              "
              title={user ? `Signed in as ${user.name}` : "Sign In or Register"}
            >
              <User
                size={20}
                strokeWidth={1.5}
                className={user ? "text-[#b8860b]" : ""}
              />

              <span className="hidden lg:inline text-xs tracking-widest uppercase">
                {user ? user.name.split(" ")[0] : "Login"}
              </span>
            </button>

            {/* DROPDOWN POPOVER */}
            {userDropdownOpen && (
              <div
                className="
                  absolute right-0 top-full mt-3
                  w-72
                  bg-[#0d0d0d]
                  border border-white/15
                  shadow-2xl
                  py-4
                  px-4
                  z-[110]
                  animate-in fade-in slide-in-from-top-2 duration-200
                "
              >
                {!user ? (
                  // Guest State: Sign In or Register
                  <div className="flex flex-col gap-3">
                    <div className="border-b border-white/10 pb-3">
                      <div className="flex items-center gap-1.5 text-[#b8860b] mb-1">
                        <Crown size={14} />
                        <span className="text-[10px] tracking-[0.25em] uppercase font-serif">
                          Saarte Royale
                        </span>
                      </div>
                      <h4 className="text-white font-serif text-sm tracking-wide">
                        Welcome, Guest
                      </h4>
                      <p className="text-[11px] text-white/50 leading-relaxed mt-0.5">
                        Sign in for personalized wardrobe styling and order tracking.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openAuth("login");
                      }}
                      className="
                        w-full py-2.5
                        bg-white text-black
                        hover:bg-[#b8860b] hover:text-white
                        text-xs font-serif tracking-[0.2em] uppercase font-semibold
                        flex items-center justify-center gap-2
                        transition-colors cursor-pointer
                      "
                    >
                      <LogIn size={14} />
                      <span>Sign In</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openAuth("signup");
                      }}
                      className="
                        w-full py-2.5
                        bg-white/5 border border-white/15
                        hover:bg-white/10 text-white
                        text-xs font-serif tracking-[0.2em] uppercase
                        flex items-center justify-center gap-2
                        transition-colors cursor-pointer
                      "
                    >
                      <UserPlus size={14} />
                      <span>Create Account</span>
                    </button>

                    <div className="border-t border-white/10 pt-2 flex flex-col gap-1 text-[11px] text-white/60">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openWishlist();
                        }}
                        className="text-left py-1 hover:text-white transition-colors cursor-pointer"
                      >
                        Saved Favourites ({wishlistCount})
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openCart();
                        }}
                        className="text-left py-1 hover:text-white transition-colors cursor-pointer"
                      >
                        Shopping Bag ({cartCount})
                      </button>
                    </div>
                  </div>
                ) : (
                  // Authenticated User State
                  <div className="flex flex-col gap-3">
                    <div className="border-b border-white/10 pb-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#b8860b]/20 border border-[#b8860b] flex items-center justify-center font-serif text-sm text-[#b8860b] font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-white font-serif text-sm tracking-wide truncate">
                          {user.name}
                        </h4>
                        <p className="text-[11px] text-white/50 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-white/80">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openWishlist();
                        }}
                        className="flex items-center justify-between py-2 px-2 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <span className="tracking-wide">My Favourites</span>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                          {wishlistCount}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openCart();
                        }}
                        className="flex items-center justify-between py-2 px-2 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <span className="tracking-wide">My Shopping Bag</span>
                        <span className="text-[10px] bg-white text-black font-semibold px-2 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      </button>
                    </div>

                    <div className="border-t border-white/10 pt-2">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="
                          w-full py-2 px-2
                          text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20
                          flex items-center gap-2
                          transition-colors cursor-pointer
                        "
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. WISHLIST BUTTON */}
          <button
            onClick={openWishlist}
            className="
              relative
              text-gray-300
              hover:text-white
              hover:scale-110
              transition-all duration-300
              cursor-pointer
            "
            title="Saved Favourites"
          >
            <Heart
              size={20}
              strokeWidth={1.5}
              className={wishlistCount > 0 ? "text-[#e11d48] fill-[#e11d48]" : ""}
            />

            {wishlistCount > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-[#e11d48]
                  text-white
                  text-[9px]
                  font-bold
                  w-4
                  h-4
                  rounded-full
                  flex
                  items-center
                  justify-center
                  animate-in zoom-in duration-200
                "
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* 4. SHOPPING BAG BUTTON */}
          <button
            onClick={openCart}
            className="
              relative
              text-gray-300
              hover:text-white
              hover:scale-110
              transition-all duration-300
              cursor-pointer
            "
            title="Shopping Bag"
          >
            <ShoppingBag
              size={20}
              strokeWidth={1.5}
            />

            <span
              className="
                absolute
                -top-2
                -right-2
                bg-white
                text-black
                text-[9px]
                font-bold
                w-4
                h-4
                rounded-full
                flex
                items-center
                justify-center
                transition-transform duration-200
              "
            >
              {cartCount}
            </span>
          </button>

          {/* 5. CHATBOT / CLIENT CARE */}
          <button
            onClick={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }}
            className="
              text-gray-300
              hover:text-white
              hover:scale-110
              transition-all duration-300
              cursor-pointer
              hidden sm:block
            "
            title="Client Care"
          >
            <MessageCircle
              size={20}
              strokeWidth={1.5}
            />
          </button>

        </div>

      </div>
    </header>
  );
};

export default Header;
