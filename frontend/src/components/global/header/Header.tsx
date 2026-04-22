// frontend/src/components/global/header/Header.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { toggleMenu, setMenu } from "../../../store/slices/uiSlice";
import type { RootState } from "../../../store/store";
import { Link, useNavigate } from "react-router-dom";

const navItems = [
  { label: "How It Works", href: "/how", scroll: true },
  { label: "Brands", href: "/brands", scroll: false },
  { label: "Enterprise", href: "/enterprise", scroll: false },
];

export default function Header() {
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector((state: RootState) => state.ui.mobileMenuOpen);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  function handleNavClick(item: { href: string; scroll?: boolean }) {
    dispatch(setMenu(false));
    if (item.scroll) {
      const id = item.href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate(item.href);
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-md bg-black/70 border-b border-neutral-800"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-20">

          {/* Left Navigation */}
          <nav className="hidden lg:flex items-center gap-10 text-sm tracking-wide">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="text-neutral-300 hover:text-ultraGold transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Center Logo */}
          <Link
            to="/"
            className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-serif tracking-[0.35em] text-ultraGold"
          >
            ULTRA
          </Link>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <Link
              to="/auth/login"
              className="text-neutral-300 hover:text-ultraGold transition-colors"
            >
              Login
            </Link>

            <button
              onClick={() => navigate("/order/sample")}
              className="px-4 py-2 border border-ultraGold text-ultraGold rounded-md hover:bg-ultraGold hover:text-black transition-all duration-300"
            >
              Get a Sample
            </button>
          </div>

          {/* Mobile */}
          <button
            className="lg:hidden text-neutral-200"
            onClick={() => dispatch(toggleMenu())}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-xl z-40 transform transition-all duration-300 ${
          mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 text-xl font-serif">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="text-neutral-200 hover:text-ultraGold"
            >
              {item.label}
            </button>
          ))}

          <Link
            to="/auth/login"
            onClick={() => dispatch(setMenu(false))}
            className="text-neutral-200"
          >
            Login
          </Link>

          <button
            className="mt-6 px-8 py-3 border border-ultraGold text-ultraGold rounded-md hover:bg-ultraGold hover:text-black"
            onClick={() => {
              dispatch(setMenu(false));
              navigate("/order/sample");
            }}
          >
            Get a Sample
          </button>
        </div>
      </div>
    </>
  );
}
