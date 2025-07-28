import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate()
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    'general',
    'world',
    'nation',
    'health',
    'business',
    'technology',
    'entertainment',
    'sports',
    'science',
  ];

  function handleFooterClick(e){
    e.preventDefault()
    navigate("/")
    window.scrollTo({
      top:0,
      behavior:"smooth"
    })
  }

  return (
    <footer className="bg-black text-white py-10 px-5 mt-[5vh]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <p onClick={e=>handleFooterClick(e)} className="text-2xl font-bold mb-3 cursor-pointer">EZ NEWS</p>
          <p className="text-sm mb-4 text-gray-400">
            info@eznews@gmail.com
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            From breaking news to thought-provoking opinion pieces, our site keeps you informed & engaged.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-300">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/${category}`}
                onClick={handleScrollTop}
                className="hover:text-white cursor-pointer"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Advertise</li>
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer">License</li>
            </ul>
          </div>

          <div className="flex gap-6 mt-6">
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} EZ NEWS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
