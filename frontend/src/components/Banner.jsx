import { useEffect, useState } from "react";

const Banner = ({ newsItems = [], loading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = Math.min(newsItems.length, 4);

  useEffect(() => {
    if (loading || totalItems <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalItems);
    }, 10000);

    return () => clearInterval(interval);
  }, [loading, totalItems]);

  const wrapperClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 w-[90%] xl:max-w-[1240px] mx-auto mb-24";

  if (loading) {
    return (
      <div className="bg-white pt-8 mt-[20vh]">
        <div className={wrapperClasses}>
          <div className="md:col-span-2 lg:col-span-12 aspect-video lg:aspect-21/9 bg-neutral-100 border border-neutral-200 animate-pulse" />
          <div className="lg:col-span-6 aspect-video bg-neutral-100 border border-neutral-200 animate-pulse" />
          <div className="lg:col-span-6 aspect-video bg-neutral-100 border border-neutral-200 animate-pulse" />
        </div>
      </div>
    );
  }

  const leadArticle = newsItems[activeIndex];
  const secondaryArticles = [
    newsItems[(activeIndex + 1) % totalItems],
    newsItems[(activeIndex + 2) % totalItems],
  ];

  return (
    <div className="bg-white pt-8 mt-[15vh]">
      <div className={wrapperClasses}>
        {leadArticle && (
          <a
            href={leadArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            key={`hero-${leadArticle.id || activeIndex}`}
            className="md:col-span-2 lg:col-span-12 relative overflow-hidden bg-neutral-950 border border-neutral-200 group/hero aspect-video lg:aspect-21/9 block animate-fadeIn"
          >
            <img
              src={leadArticle.image}
              alt={leadArticle.title}
              className="w-full h-full object-cover grayscale-10 contrast-102 opacity-80 group-hover/hero:opacity-100 group-hover/hero:grayscale-0 transition-all duration-1000 ease-out group-hover/hero:scale-101"
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950/95 via-neutral-950/30 to-transparent flex flex-col justify-end p-6 sm:p-10">
              <div className="max-w-3xl">
                <div className="hidden sm:flex items-center gap-3 mb-4">
                  <span className="manrope bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                    Trending Article
                  </span>
                  
                  <div className="flex gap-1.5 ml-2">
                    {Array.from({ length: totalItems }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-1 transition-all duration-500 rounded-full ${idx === activeIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} 
                      />
                    ))}
                  </div>
                </div>
                <h3 className="lora text-xl sm:text-3xl lg:text-4xl line-clamp-2 text-white font-medium leading-tight tracking-tight">
                  {leadArticle.title}
                </h3>
              </div>
            </div>
          </a>
        )}

        {secondaryArticles[0] && (
          <button
            onClick={() => setActiveIndex((activeIndex + 1) % totalItems)}
            className="lg:col-span-6 relative overflow-hidden bg-neutral-950 border border-neutral-200 group/sub aspect-video w-full text-left cursor-pointer block"
          >
            <img
              src={secondaryArticles[0].image}
              alt={secondaryArticles[0].title}
              className="w-full h-full object-cover grayscale-15 opacity-75 group-hover/sub:opacity-100 group-hover/sub:grayscale-0 transition-all duration-700 ease-out group-hover/sub:scale-101"
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/20 to-transparent flex flex-col justify-end p-5 sm:p-6">
              <span className="manrope text-[10px] font-bold uppercase tracking-wide text-neutral-300 mb-2 block italic">
                Up Next • Trending Wire
              </span>
              <h4 className="lora text-base sm:text-lg lg:text-xl text-white font-medium leading-snug tracking-tight line-clamp-2">
                {secondaryArticles[0].title}
              </h4>
            </div>
          </button>
        )}

        {secondaryArticles[1] && (
          <button
            onClick={() => setActiveIndex((activeIndex + 2) % totalItems)}
            className="lg:col-span-6 relative overflow-hidden bg-neutral-950 border border-neutral-200 group/sub aspect-video w-full text-left cursor-pointer block"
          >
            <img
              src={secondaryArticles[1].image}
              alt={secondaryArticles[1].title}
              className="w-full h-full object-cover grayscale-15 opacity-75 group-hover/sub:opacity-100 group-hover/sub:grayscale-0 transition-all duration-700 ease-out group-hover/sub:scale-101"
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/20 to-transparent flex flex-col justify-end p-5 sm:p-6">
              <span className="manrope text-[10px] font-bold uppercase tracking-wide text-neutral-300 mb-2 block">
                Up Next • Editorial Choice
              </span>
              <h4 className="lora text-base sm:text-lg lg:text-xl text-white font-medium leading-snug tracking-tight line-clamp-2">
                {secondaryArticles[1].title}
              </h4>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;