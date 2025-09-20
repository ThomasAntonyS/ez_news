import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

const PodcastCard = ({ image, title, url, description }) => {
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg sm:shadow-md flex flex-col w-full sm:w-[48%] lg:w-[30%] transition-transform hover:scale-[1.02]">
      <div className="relative pt-[56.25%] overflow-hidden"> 
        <img src={image} alt={title} loading='lazy' className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow"> 
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-4 flex-grow">{description}</p>
        <Link to={url} target='_blank' className="flex w-max text-blue-600 font-medium cursor-pointer hover:underline mt-auto"><span className='mr-2'><Link2/></span>Know more</Link>
      </div>
    </div>
  );
};

export default PodcastCard;
