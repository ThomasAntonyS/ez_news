import React from 'react';
import PodcastCard from './PostCard';

const HomeSliders = ({ sectionTitle, podcastData }) => {
  return (
    <div className="w-[90%] max-w-7xl mx-auto my-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">{sectionTitle}</h2>

      <div className="flex flex-wrap gap-4 justify-between">
        {podcastData && podcastData.length > 0 ? (
          podcastData.map((item, index) => (
            <PodcastCard
              key={index}
              image={item.image}
              title={item.title}
              description={item.description}
            />
          ))
        ) : (
          <p className="text-gray-500">No podcasts available.</p>
        )}
      </div>

      <div className="text-center mt-8">
        <button className="bg-red-600 text-white py-2 px-5 rounded-md hover:bg-red-700 transition">
          Browse All Podcasts
        </button>
      </div>
    </div>
  );
};

export default HomeSliders;
