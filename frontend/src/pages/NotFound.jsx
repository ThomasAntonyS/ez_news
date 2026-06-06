import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const NotFound = () => {
  document.title = "404 | Page Not Found";
  
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col justify-center items-center text-neutral-900 p-6 bg-white select-none relative overflow-hidden">
        
        <h1 className="manrope text-[12rem] sm:text-[20rem] font-light leading-none tracking-tighter text-neutral-100 select-none z-0 absolute top-1/2 -translate-y-2/3">
          404
        </h1>
        
        <div className="z-10 flex flex-col items-center text-center mt-12">
          <h2 className="lora text-2xl sm:text-4xl font-medium tracking-tight text-neutral-900 mb-4">
            Page Not Found
          </h2>
          
          <p className="lora text-neutral-500 font-normal tracking-normal mb-10 max-w-sm text-sm sm:text-base leading-relaxed">
            The requested article link does not exist or has been permanently moved to another section.
          </p>
          
          <Link
            to="/"
            className="manrope group inline-flex gap-2 items-center px-6 py-3 bg-neutral-900 border border-neutral-900 text-white text-xs font-bold uppercase tracking-widest rounded-xs hover:bg-transparent hover:text-neutral-900 transition-colors duration-300"
          >
            Go to Homepage 
            <ChevronRightIcon className='group-hover:translate-x-0.5 transition-transform duration-200 mt-0.5' strokeWidth={2.5} size={14}/>
          </Link>
        </div>

      </div>
    </>
  );
};

export default NotFound;