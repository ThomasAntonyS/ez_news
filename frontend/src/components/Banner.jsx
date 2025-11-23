import React from 'react';

const Banner = ({ newsItems, loading }) => {
  const bannerItems = newsItems.slice(0, 3);

  if (loading) {
    return (
      <div>
        <p className="w-max mx-auto mt-[10vh] text-[4rem] sm:text-[10rem] 2xl:text-[13rem] font-bold">
          EZ NEWS
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 sm:w-[80%] 2xl:w-[60%] mx-auto px-4 animate-pulse">
          <div className="relative h-[25vh] sm:h-[32vh] 2xl:h-[50vh] sm:row-span-2 bg-gray-400 rounded-lg"></div>
          <div className="relative h-[25vh] sm:h-[15vh] 2xl:h-[24vh] bg-gray-400 rounded-lg"></div>
          <div className="relative h-[25vh] sm:h-[15vh] 2xl:h-[24vh] bg-gray-400 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="w-max mx-auto mt-[10vh] text-[4rem] sm:text-[10rem] 2xl:text-[13rem] font-bold">
        EZ NEWS
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 sm:w-[80%] 2xl:w-[60%] mx-auto px-4">
        {bannerItems[0] && (
          <a
            href={bannerItems[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[25vh] sm:h-[32vh] 2xl:h-[40vh] sm:row-span-2 group overflow-hidden rounded-lg"
          >
            <img
              src={bannerItems[0].image}
              alt={bannerItems[0].title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300 flex flex-col justify-end p-4 text-white">
              <h3 className="text-lg line-clamp-2 font-semibold">{bannerItems[0].title}</h3>
            </div>
          </a>
        )}

        {bannerItems[1] && (
          <a
            href={bannerItems[1].url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[25vh] sm:h-[15vh] 2xl:h-[19vh] group overflow-hidden rounded-lg"
          >
            <img
              src={bannerItems[1].image}
              alt={bannerItems[1].title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300 flex items-end p-4 text-white">
              <h3 className="text-sm font-semibold line-clamp-2">{bannerItems[1].title}</h3>
            </div>
          </a>
        )}

        {bannerItems[2] && (
          <a
            href={bannerItems[2].url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[25vh] sm:h-[15vh] 2xl:h-[19vh] group overflow-hidden rounded-lg"
          >
            <img
              src={bannerItems[2].image}
              alt={bannerItems[2].title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300 flex items-end p-4 text-white">
              <h3 className="text-sm font-semibold line-clamp-2">{bannerItems[2].title}</h3>
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default Banner;