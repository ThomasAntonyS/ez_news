import PodcastCard from './PostCard';
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';

const HomeSliders = ({ sectionTitle, podcastData, categoryPath }) => {
  return (
    <div className="w-[90%] max-w-7xl mx-auto my-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">{sectionTitle}</h2>

      <div className="flex flex-wrap gap-8 sm:gap-4 justify-between">
        {podcastData && podcastData.length > 0 ? (
          podcastData.map((item, index) => (
            <PodcastCard
              key={index}
              image={item.image}
              title={item.title}
              url={item.url}
              description={item.description}
            />
          ))
        ) : (
          <div className="w-max mx-auto my-4">
            <Ring2
              size="40"
              stroke="5"
              strokeLength="0.25"
              bgOpacity="0.1"
              speed="0.8"
              color="black" 
            />
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <Link to={`/${categoryPath}`} className="flex w-max mx-auto bg-red-600 text-white py-2 px-5 rounded-md hover:bg-red-700 transition">
          Browse All Updates <span className=' h-max my-auto'><ChevronRightIcon/></span>
        </Link>
      </div>
    </div>
  );
};

export default HomeSliders;
