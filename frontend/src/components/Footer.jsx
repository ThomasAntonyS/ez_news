import { Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const categories = [
        'general', 'world', 'nation', 'health', 
        'business', 'technology', 'entertainment', 
        'sports', 'science',
    ];

    function handleFooterClick(e) {
        e.preventDefault();
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <footer className="bg-black text-white border-t-8 border-black mt-[10vh]">
            <div className="max-w-[90%] mx-auto py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
                
                <div className="md:col-span-1">
                    <p 
                        onClick={e => handleFooterClick(e)} 
                        className="text-4xl font-black uppercase tracking-tighter mb-6 cursor-pointer hover:text-red-600 transition-colors"
                    >
                        EZ NEWS
                    </p>
                    <p className="text-xs font-medium leading-relaxed text-gray-400 tracking-tight">
                        From breaking news to thought-provoking opinion pieces, our site keeps you informed & engaged. No fluff, just headlines.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-black uppercase tracking-wide mb-6 border-b-2 border-white w-max">
                        Categories
                    </h3>
                    <ul className="grid grid-cols-2 gap-y-3 text-xs font-bold uppercase tracking-wide">
                        {categories.map((category) => (
                            <Link
                                key={category}
                                to={`/${category}/1`} 
                                onClick={handleScrollTop}
                                className="hover:translate-x-2 w-max transition-transform duration-200 block"
                            >
                                {category}
                            </Link>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-black uppercase tracking-wide mb-6 border-b-2 border-white w-max">
                        Legal
                    </h3>
                    <ul className="space-y-3 text-xs font-bold uppercase tracking-wide">
                        <li className="hover:translate-x-2 transition-transform cursor-pointer">Privacy Policy</li>
                        <li className="hover:translate-x-2 transition-transform cursor-pointer">Advertise</li>
                        <li className="hover:translate-x-2 transition-transform cursor-pointer">Terms & Conditions</li>
                        <li className="hover:translate-x-2 transition-transform cursor-pointer">License</li>
                    </ul>
                </div>

                <div className="flex flex-col justify-between items-start md:items-end">
                    <div className="flex gap-4">
                        {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                            <a 
                                key={i} 
                                href="#" 
                                className="p-3 border-2 border-white hover:bg-white hover:text-black transition-all"
                            >
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>

                    <button 
                        onClick={handleScrollTop}
                        className="mt-10 group flex items-center cursor-pointer gap-2 bg-white text-black font-black uppercase tracking-widest py-3 px-6 border-2 border-white hover:bg-black hover:text-white transition-all"
                    >
                        Back to Top <ArrowUp size={18} className="group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="border-t-2 border-zinc-900 py-8 text-center">
                <p className="text-[10px] font-black tracking-wide text-zinc-500">
                    &copy; {new Date().getFullYear()} EZ NEWS. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;