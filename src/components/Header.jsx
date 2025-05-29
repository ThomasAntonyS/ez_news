import React, { useState } from "react";
import { Menu, Search, X } from "lucide-react";

const Header = () => {
  const mainLinks = [
    { name: "Business", path: "business" },
    { name: "Technology", path: "technology" },
    { name: "Entertainment", path: "entertainment" },
    { name: "Sports", path: "sports" },
  ];

  const moreLinks = [
    { name: "General", path: "general" },
    { name: "World", path: "world" },
    { name: "Nation", path: "nation" },
    { name: "Science", path: "science" },
    { name: "Health", path: "health" },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  return (
    <header className="flex max-w-7xl justify-between items-center w-[90%] mx-auto h-[9vh] relative">
      {/* Search Form */}
      <form className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search"
          className="border-b-2 font-semibold border-b-gray-300 px-3 py-1 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Submit Search"
          className="text-gray-700 hover:text-black hover:cursor-pointer"
        >
          <Search size={20} />
        </button>
      </form>

      {/* Desktop nav: Main links + More dropdown (visible from sm and up) */}
      <nav className="hidden 2xl:flex space-x-6 items-center relative">
        {mainLinks.map((link) => (
          <a
            key={link.path}
            href={`/${link.path}`}
            className="text-black px-3 py-1 font-semibold hover:bg-gray-100 transition-colors rounded"
          >
            {link.name}
          </a>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {moreDropdownOpen && (
            <ul className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[150px] z-20">
              {moreLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={`/${link.path}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* Mobile menu button (visible on small screens only) */}
      <button
        onClick={() => setMobileMenuOpen((open) => !open)}
        aria-label="Toggle menu"
        className="2xl:hidden text-black"
      >
        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile menu (overlay) */}
      {mobileMenuOpen && (
        <div className="absolute top-[9vh] left-0 right-0 bg-white shadow-lg border-t border-gray-200 2xl:hidden z-30">
          <nav className="flex flex-col p-4 space-y-3">
            {[...mainLinks, ...moreLinks].map((link) => (
              <a
                key={link.path}
                href={`/${link.path}`}
                className="text-black font-semibold px-3 py-2 rounded hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(false)} // close menu on click
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
