import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const NotFound = () => {
  document.title = "404: PAGE_NOT_FOUND";
  
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col justify-center items-center text-black p-6 bg-white select-none relative overflow-hidden">
        <h1 className="text-[10rem] sm:text-[18rem] font-black leading-none uppercase tracking-tighter italic z-10">
          404
        </h1>
        
        <div className="z-10 flex flex-col items-center">
          <p className="text-3xl sm:text-6xl font-black uppercase mb-8 bg-black text-white px-6 py-2 rotate-[-1.5deg] shadow-[8px_8px_0px_0px_rgba(0,0,0,.9)]">
            Page Not Found
          </p>
          
          <p className="font-bold uppercase tracking-wide mb-12 text-center max-w-lg leading-snug text-sm sm:text-base">
            Error_Log: The requested URL does not exist or has been relocated to an unknown sector.
          </p>
          
          <Link
            to="/"
            className="group flex gap-3 items-center px-12 py-6 bg-white border-4 border-black text-black font-black uppercase tracking-wide shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 active:bg-black active:text-white"
          >
            Go to Homepage 
            <ChevronRightIcon className='group-hover:translate-x-2 transition-transform' strokeWidth={4} size={24}/>
          </Link>
        </div>

        <div className="fixed -bottom-10 -right-10 -z-0 opacity-[0.03] pointer-events-none">
          <p className="text-[20rem] font-black uppercase transform rotate-45">
            VOID
          </p>
        </div>

        <div className="absolute top-1/4 left-10 w-32 h-32 border-8 border-black opacity-5 -rotate-12 pointer-events-none hidden md:block"></div>
        <div className="absolute bottom-1/4 right-20 w-48 h-12 bg-black opacity-5 rotate-12 pointer-events-none hidden md:block"></div>
      </div>
    </>
  );
};

export default NotFound;