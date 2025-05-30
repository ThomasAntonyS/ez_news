import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

const PodcastCard = ({ image, title, url, description }) => {
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col w-full sm:w-[48%] lg:w-[30%] transition-transform hover:scale-[1.02]">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col justify-between h-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-5">{description}</p>
        <Link to={url} target='_blank' className="flex text-blue-600 font-medium cursor-pointer hover:underline"><span className=' mr-2'><Link2/></span>Know more</Link>
      </div>
    </div>
  );
};

export default PodcastCard;
