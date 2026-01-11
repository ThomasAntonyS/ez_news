import React from 'react';

const Banner = ({ newsItems, loading }) => {
  const bannerItems = newsItems.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white">
        <p className="w-max mx-auto mt-[10vh] text-[4rem] sm:text-[10rem] 2xl:text-[13rem] font-black uppercase tracking-tighter text-black">
          EZ NEWS
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-6 sm:w-[85%] 2xl:w-[70%] mx-auto px-4 mb-20">
          <div className="h-[30vh] sm:h-full sm:row-span-2 bg-gray-200 border-4 border-black animate-pulse"></div>
          <div className="h-[20vh] bg-gray-200 border-4 border-black animate-pulse"></div>
          <div className="h-[20vh] bg-gray-200 border-4 border-black animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <p className="w-max mx-auto mt-[10vh] text-[4rem] sm:text-[10rem] 2xl:text-[13rem] font-black uppercase tracking-tighter text-black">
        EZ NEWS
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-6 sm:w-[85%] 2xl:w-[70%] mx-auto px-4 mb-20">
        {bannerItems[0] && (
          <a
            href={bannerItems[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[30vh] sm:h-full sm:row-span-2 group overflow-hidden border-4 border-black bg-black transition-all hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
          >
            <img
              src={bannerItems[0].image}
              alt={bannerItems[0].title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-transparent to-transparent">
              <span className="bg-white text-black text-xs font-black px-2 py-1 w-max mb-3 uppercase tracking-wide">
                Breaking
              </span>
              <h3 className="text-xl sm:text-3xl text-white font-black uppercase leading-tight tracking-tight line-clamp-2 sm:line-clamp-3">
                {bannerItems[0].title}
              </h3>
            </div>
          </a>
        )}

        {bannerItems[1] && (
          <a
            href={bannerItems[1].url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[22vh] group overflow-hidden border-4 border-black bg-black transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
          >
            <img
              src={bannerItems[1].image}
              alt={bannerItems[1].title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-sm sm:text-lg text-white font-black uppercase leading-tight line-clamp-2">
                {bannerItems[1].title}
              </h3>
            </div>
          </a>
        )}

        {bannerItems[2] && (
          <a
            href={bannerItems[2].url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[22vh] group overflow-hidden border-4 border-black bg-black transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
          >
            <img
              src={bannerItems[2].image}
              alt={bannerItems[2].title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-sm sm:text-lg text-white font-black uppercase leading-tight line-clamp-2">
                {bannerItems[2].title}
              </h3>
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default Banner;