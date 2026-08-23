import { Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FooterLogo from '../assets/footer-logo.png'

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
        <footer className="bg-neutral-950 text-white border-t border-neutral-800 mt-[12vh]">
            <div className="max-w-[90%] xl:max-w-310 mx-auto py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
                
                <div className="md:col-span-1">
                <Link to="/" onClick={handleFooterClick} className="shrink-0 flex items-center mb-5">
                    <img 
                        src={FooterLogo} 
                        alt="Footer Logo" 
                        className="w-10 h-10 object-contain transition-all duration-300" 
                    />
                </Link>
                    <p className="lora text-[13px] leading-relaxed text-neutral-400 font-normal">
                        From breaking news to thought-provoking opinion pieces, our site keeps you informed & engaged. No fluff, just headlines.
                    </p>
                </div>

                <div>
                    <h3 className="manrope text-[11px] font-bold uppercase italic tracking-widest text-neutral-400 mb-5 pb-2 border-b border-neutral-800 w-full">
                        Categories
                    </h3>
                    <ul className="grid grid-cols-2 gap-y-2.5 text-[11px] font-bold uppercase tracking-wider manrope text-neutral-300">
                        {categories.map((category) => (
                            <Link
                                key={category}
                                to={`/${category}/1`} 
                                onClick={handleScrollTop}
                                className="hover:text-white transition-colors w-max block"
                            >
                                {category}
                            </Link>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="manrope text-[11px] font-bold uppercase italic tracking-widest text-neutral-400 mb-5 pb-2 border-b border-neutral-800 w-full">
                        Legal
                    </h3>
                    <ul className="space-y-2.5 text-[11px] font-bold uppercase tracking-wider manrope text-neutral-300">
                        <li className="hover:text-white transition-colors cursor-pointer w-max">Privacy Policy</li>
                        <li className="hover:text-white transition-colors cursor-pointer w-max">Advertise</li>
                        <li className="hover:text-white transition-colors cursor-pointer w-max">Terms & Conditions</li>
                        <li className="hover:text-white transition-colors cursor-pointer w-max">License</li>
                    </ul>
                </div>

                <div className="flex flex-col justify-between items-start md:items-end gap-y-6">
                    <div className="flex gap-3">
                        {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                            <a 
                                key={i} 
                                href="#" 
                                className="w-9 h-9 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:bg-white hover:text-neutral-950 hover:border-white transition-all duration-200"
                            >
                                <Icon size={14} />
                            </a>
                        ))}
                    </div>

                    <button 
                        onClick={handleScrollTop}
                        className="group inline-flex items-center cursor-pointer gap-2 bg-transparent text-neutral-400 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors manrope"
                    >
                        Back to Top 
                        <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </button>
                </div>
            </div>

            <div className="border-t border-neutral-900 py-8 text-center">
                <p className="manrope text-[10px] font-bold tracking-wide text-neutral-600 uppercase">
                    &copy; {new Date().getFullYear()} EZ NEWS. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
