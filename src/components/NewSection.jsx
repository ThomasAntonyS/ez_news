import React from 'react';

const dummyNews = new Array(5).fill(null);

const NewSection = () => {
  return (
    <div className='w-[95%] max-w-7xl mt-24 mx-auto px-2'>
      <p className='my-4 font-semibold text-xl sm:text-2xl lg:text-[1.7rem]'>Popular News</p>

      <div className='w-full flex flex-col lg:flex-row gap-4'>
        {/* Left Section */}
        <div className='w-full lg:w-[60%] rounded-md'>
          {dummyNews.map((_, index) => (
            <div key={index} className='flex flex-col sm:flex-row w-full p-3 gap-3'>
              <img
                src="https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt=""
                className='w-full sm:w-[30%] h-auto aspect-video object-cover rounded-md'
              />

              <div className='flex flex-col justify-between w-full sm:w-[70%]'>
                <p className='font-bold text-lg sm:text-xl line-clamp-2'>Title {index + 1}</p>
                <p className='text-sm sm:text-base line-clamp-3'>Description for item {index + 1}</p>
                <div className='flex justify-between text-xs sm:text-sm mt-2 text-gray-600 w-[70%]'>
                  <p>Date</p>
                  <p>Source</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className='w-full lg:w-[40%] h-max rounded-md p-3'>
          <p className='text-lg sm:text-xl mb-3'>Trending</p>
          {dummyNews.map((_, index) => (
            <div key={index} className='flex items-start gap-3 py-2'>
              <div className='text-white bg-red-600 px-2 py-1 rounded-sm text-sm'>{index + 1}</div>

              <div className='flex flex-col justify-between w-full '>
                <p className='font-semibold text-base sm:text-lg line-clamp-2 truncate'>Title {index + 1}</p>
                <div className='flex justify-between text-xs sm:text-sm text-gray-600 mt-1 w-[70%]'>
                  <p>Date</p>
                  <p>Source</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewSection;
