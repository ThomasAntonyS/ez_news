import { useEffect, useState } from "react";
import { Menu, Search, X, User, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <header className={`fixed top-0 left-0 w-full bg-white z-[100] border-b-3 border-black transition-all duration-300 ${hasShadow ? "py-2 shadow-[0px_3px_0px_0px_rgba(0,0,0,1)]" : "py-4"}`}>
            <div className="flex justify-between items-center w-[95%] sm:w-[90%] mx-auto px-2">
                
                {/* Search Form - Unified Box Design */}
                <form className="flex items-stretch border-2 border-black overflow-hidden group" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="SEARCH..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="font-black uppercase tracking-tighter px-3 py-1 focus:bg-gray-50 outline-none w-[100px] sm:w-[180px] placeholder:text-black/50 transition-colors text-sm"
                    />
                    <button type="submit" className="bg-black text-white px-3 flex items-center justify-center hover:bg-red-600 transition-colors border-l-2 border-black">
                        <Search size={16} strokeWidth={4} />
                    </button>
                </form>

                {/* Desktop Navigation */}
                <nav className="hidden 2xl:flex items-center gap-1">
                    {mainLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path === "" ? "/" : `/${link.path}/1`}
                            onClick={scrollToTop}
                            className="text-black px-4 py-1 font-black uppercase tracking-wide text-[13px] border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="relative" onMouseEnter={() => setMoreDropdownOpen(true)} onMouseLeave={() => setMoreDropdownOpen(false)}>
                        <button className={`text-black px-4 py-1 font-black uppercase tracking-wide text-[13px] border-2 flex items-center gap-2 transition-all ${moreDropdownOpen ? "bg-black text-white border-black" : "border-transparent hover:border-black"}`}>
                            MORE <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-300 ${moreDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        
                        {moreDropdownOpen && (
                            <ul className="absolute top-full left-0 bg-white border-4 border-black py-2 min-w-[200px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[110]">
                                {moreLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={`/${link.path}/1`}
                                            onClick={() => { scrollToTop(); setMoreDropdownOpen(false); }}
                                            className="block px-6 py-2 text-xs font-black uppercase tracking-wide hover:bg-gray-50 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </nav>

                {/* Profile & Mobile Menu */}
                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        <div className="hidden sm:flex font-black uppercase tracking-wide text-xs gap-x-4 items-center">
                            <Link to={"/login"} className="hover:text-red-600 transition-colors border-b-2 border-transparent hover:border-red-600">Login</Link>
                            <Link to={"/signup"} className="bg-black text-white px-5 py-2 border-2 border-black hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">SignUp</Link>
                        </div>
                    ) : (
                        <Link to="/profile" className="w-10 h-10 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all bg-white flex items-center justify-center overflow-hidden">
                            {userProfilePic ? (
                                <img src={userProfilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} strokeWidth={3} className="text-black" />
                            )}
                        </Link>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="2xl:hidden p-2 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                    >
                        {mobileMenuOpen ? <X size={20} strokeWidth={4} /> : <Menu size={20} strokeWidth={4} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b-8 border-black 2xl:hidden z-[100] shadow-[0px_10px_30px_rgba(0,0,0,0.2)]">
                    <nav className="flex flex-col p-6 space-y-1">
                        {[...mainLinks, ...moreLinks].map((link) => (
                            <Link
                                key={link.name}
                                to={link.path === "" ? "/" : `/${link.path}/1`}
                                onClick={() => { scrollToTop(); setMobileMenuOpen(false); }}
                                className="text-xl font-black uppercase tracking-tighter p-3 border-2 border-transparent hover:border-black hover:bg-gray-50 transition-all"
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <div className="pt-6 mt-4 border-t-4 border-black flex flex-col gap-4">
                            {!isLoggedIn ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 font-black border-2 border-black uppercase tracking-wide text-sm hover:bg-black hover:text-white transition-all">Login</Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 font-black bg-black text-white border-2 border-black uppercase tracking-wide text-sm hover:bg-white hover:text-black transition-all">SignUp</Link>
                                </div>
                            ) : (
                                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-4 font-black border-2 border-black uppercase tracking-wide bg-gray-50">My Profile</Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;