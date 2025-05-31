import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header'

const NotFound = () => {

  document.title = "404: Not_Found"
  
  return (
    <>
        <Header/>
        <div className="min-h-screen flex flex-col justify-center items-center text-black p-6">
          <h1 className="text-[7rem] sm:text-[10rem] font-bold mb-4">404</h1>
          <p className="text-4xl sm:text-6xl mb-2">Page Not Found</p>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="flex px-6 py-3 bg-black hover:bg-black transition rounded-lg text-white font-semibold"
          >
            Go to Homepage <span className='h-max my-auto'><ChevronRightIcon/></span>
          </Link>
        </div>
    </>
  );
};

export default NotFound;
