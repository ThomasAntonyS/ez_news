import React, { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const mainLinks = [
    { name: "Home", path: "" },
    { name: "Technology", path: "technology" },
    { name: "Entertainment", path: "entertainment" },
    { name: "Sports", path: "sports" },
  ];

  const moreLinks = [
    { name: "Business", path: "business" },
    { name: "World", path: "world" },
    { name: "Nation", path: "nation" },
    { name: "Science", path: "science" },
    { name: "Health", path: "health" },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white z-50 transition-shadow ${
        hasShadow ? "shadow-md" : ""
      }`}
    >
      <div className="h-[9vh] flex justify-between items-center w-[90%] max-w-7xl mx-auto px-4">
        {/* Search Form */}
        <form className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="border-b-2 font-semibold border-b-gray-300 pr-3 pl-2 py-1 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Submit Search"
            className="text-gray-700 hover:text-black hover:cursor-pointer"
          >
            <Search size={20} />
          </button>
        </form>

        {/* Desktop nav */}
        <nav className="hidden 2xl:flex space-x-6 items-center relative">
          {mainLinks.map((link) => (
            <Link
              key={link.path}
              to={`/${link.path}`}
              onClick={scrollToTop}
              className="text-black px-3 py-1 font-semibold hover:bg-gray-100 transition-colors rounded"
            >
              {link.name}
            </Link>
          ))}

          {/* More dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setMoreDropdownOpen(true)}
            onMouseLeave={() => setMoreDropdownOpen(false)}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={moreDropdownOpen}
              onClick={() => setMoreDropdownOpen((open) => !open)}
              className="text-black px-3 py-1 font-semibold hover:bg-gray-100 transition-colors rounded flex items-center gap-1"
            >
              More
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  moreDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {moreDropdownOpen && (
              <ul className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[150px] z-20">
                {moreLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={`/${link.path}`}
                      onClick={scrollToTop}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          className="2xl:hidden text-black"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[9vh] left-0 w-full bg-white shadow-2xl border-t border-gray-200 2xl:hidden z-40">
          <nav className="flex flex-col p-4 space-y-3">
            {[...mainLinks, ...moreLinks].map((link) => (
              <Link
                key={link.path}
                to={`/${link.path}`}
                onClick={() => {
                  scrollToTop();
                  setMobileMenuOpen(false);
                }}
                className="text-black font-semibold px-3 py-2 rounded hover:bg-gray-100 transition"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
