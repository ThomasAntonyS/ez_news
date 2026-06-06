import { useEffect, useState } from "react";
import { Menu, Search, X, User, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from '../assets/icon.png'

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
    const [hasShadow, setHasShadow] = useState(false);
    const [query, setQuery] = useState('');

    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const userProfilePic = null;

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim() === "") return;
        const formattedQuery = query.trim().replace(/ /g, "+");
        navigate(`/search/${formattedQuery}/1`);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setQuery('');
        setMobileMenuOpen(false);
    };

    return (
        <header className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-100 border-b border-neutral-200 transition-all duration-300 ${hasShadow ? "py-2.5 shadow-xs" : "py-4"}`}>
            <div className="flex justify-between items-center w-[90%] xl:max-w-310 mx-auto gap-4">

                {/* Branded Logo Link Frame */}
                <Link to="/" onClick={scrollToTop} className="shrink-0 flex items-center">
                    <img 
                        src={Logo} 
                        alt="EZ NEWS Logo" 
                        className="w-10 h-10 object-contain transition-all duration-300" 
                    />
                </Link>
                
                {/* Search Form Container */}
                <form className="flex items-center border-b border-neutral-700 focus-within:border-neutral-800 transition-colors group py-1" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="manrope font-medium tracking-tight px-1 outline-none w-28 sm:w-44 placeholder:text-neutral-700 bg-transparent text-[16px] text-neutral-800"
                    />
                    <button type="submit" className="text-neutral-700 hover:text-neutral-900 transition-colors px-1 cursor-pointer">
                        <Search size={15} strokeWidth={2.5} />
                    </button>
                </form>

                {/* Desktop Navigation Link Track */}
                <nav className="hidden lg:flex items-center gap-1">
                    {mainLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path === "" ? "/" : `/${link.path}/1`}
                            onClick={scrollToTop}
                            className="manrope text-neutral-700 px-4 py-1.5 font-bold uppercase tracking-wider text-sm hover:text-neutral-900 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Secondary Overflow Dropdown Element */}
                    <div className="relative" onMouseEnter={() => setMoreDropdownOpen(true)} onMouseLeave={() => setMoreDropdownOpen(false)}>
                        <button className="manrope text-neutral-700 px-4 py-1.5 font-bold uppercase tracking-widest text-sm flex items-center gap-1 transition-colors hover:text-neutral-900 cursor-pointer">
                            More <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform duration-300 ${moreDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        
                        {moreDropdownOpen && (
                          <div className="absolute top-full left-0 pt-2 z-110">
                            <ul className="bg-white border border-neutral-200 py-1.5 w-44 shadow-md rounded-xs">
                                {moreLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={`/${link.path}/1`}
                                            onClick={() => { scrollToTop(); setMoreDropdownOpen(false); }}
                                            className="manrope block px-4 py-2 text-sm font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                          </div>
                        )}
                    </div>
                </nav>

                {/* User Status Interface Elements */}
                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        <div className="hidden sm:flex font-bold uppercase tracking-widest text-sm gap-x-6 items-center manrope">
                            <Link to={"/login"} className="text-neutral-700 hover:text-neutral-900 transition-colors">Login</Link>
                            <Link to={"/signup"} className="bg-neutral-900 text-white px-5 py-2 border border-neutral-900 rounded-xs hover:bg-transparent hover:text-neutral-900 transition-colors duration-300">Sign Up</Link>
                        </div>
                    ) : (
                        <Link to="/profile" className="w-8 h-8 border border-neutral-200 rounded-full hover:border-neutral-400 transition-colors bg-neutral-50 flex items-center justify-center overflow-hidden shadow-2xs">
                            {userProfilePic ? (
                                <img src={userProfilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={16} strokeWidth={2.5} className="text-neutral-600" />
                            )}
                        </Link>
                    )}

                    {/* Mobile Dynamic Menu Slider Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-1.5 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                    >
                        {mobileMenuOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
                    </button>
                </div>
            </div>

            {/* Mobile Viewport Slide Overlay Layer */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-neutral-200 lg:hidden z-100 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                    <nav className="flex flex-col p-6 space-y-0.5">
                        {[...mainLinks, ...moreLinks].map((link) => (
                            <Link
                                key={link.name}
                                to={link.path === "" ? "/" : `/${link.path}/1`}
                                onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}
                                className="manrope text-xs font-bold uppercase tracking-wider py-3 text-neutral-600 hover:text-neutral-900 transition-colors border-b border-neutral-50 last:border-0"
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <div className="pt-6 mt-2 flex flex-col gap-4">
                            {!isLoggedIn ? (
                                <div className="grid grid-cols-2 gap-4 manrope">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2.5 text-[11px] font-bold uppercase tracking-widest border border-neutral-200 text-neutral-600 rounded-xs transition-colors hover:text-neutral-900">Login</Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center py-2.5 text-[11px] font-bold uppercase tracking-widest bg-neutral-900 text-white border border-neutral-900 rounded-xs">Sign Up</Link>
                                </div>
                            ) : (
                                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 text-[11px] font-bold uppercase tracking-widest border border-neutral-200 text-neutral-700 rounded-xs manrope bg-neutral-50 hover:bg-neutral-100 transition-colors">My Profile</Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;