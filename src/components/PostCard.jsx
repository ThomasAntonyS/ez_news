import React from 'react';

const PodcastCard = ({ image, title, description }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col w-full sm:w-[48%] lg:w-[30%] transition-transform hover:scale-[1.02]">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col justify-between h-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <p className="text-blue-600 font-medium cursor-pointer">Listen Now</p>
      </div>
    </div>
  );
};

export default PodcastCard;
