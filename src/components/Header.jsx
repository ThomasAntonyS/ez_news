import { Menu, Search } from "lucide-react";

const Header = () => {
  const navLinks = ["Business", "Technology", "Entertainment", "Sports", "Health"];
  const navLinksPath = ["business", "technology", "entertainment", "sports", "health"];

  return (
    <header className="flex justify-between items-center w-[90%] mx-auto h-[9vh]">
      <form className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search"
          className="border-b-2 font-semibold border-b-gray-300 px-3 py-1 focus:outline-none focus:none"
        />
        <button type="submit" aria-label="Submit Search" className="text-gray-700 hover:text-black hover:cursor-pointer">
          <Search size={20} />
        </button>
      </form>

      <nav className="hidden lg:flex space-x-6">
        {navLinks.map((link, i) => (
          <a
            key={i}
            href={`/${navLinksPath[i]}`}
            className="text-black px-3 py-1 font-semibold hover:bg-gray-100 transition-colors"
          >
            {link}
          </a>
        ))}
      </nav>

    </header>
  );
};

export default Header;