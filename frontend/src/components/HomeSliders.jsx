import PodcastCard from './PostCard';
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, Bookmark, Link2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';
import axios from 'axios';

const SkeletonCard = () => (
  <div className="flex flex-col h-full border border-neutral-100 animate-pulse">
    <div className="w-full aspect-video bg-neutral-100" />
    <div className="p-6 flex-1 space-y-4">
      <div className="h-3 bg-neutral-100 w-1/4" />
      <div className="space-y-2">
        <div className="h-5 bg-neutral-100 w-11/12" />
      </div>
      <div className="pt-4 border-t border-neutral-50 flex justify-between items-center">
        <div className="h-3 bg-neutral-100 w-16" />
      </div>
    </div>
  </div>
);

const HomeSliders = ({ sectionTitle, podcastData = [], categoryPath }) => {
  const navigate = useNavigate();
  const { userData, savedIds, fetchSavedIds, isLoggedIn } = useAuth();
  const [processingId, setProcessingIds] = useState([]);
  const apiBase = import.meta.env.VITE_API_BASE;

  const handleToggleSave = async (e, article) => {
    e.preventDefault();
    if (!userData) return alert("PLEASE LOGIN TO SAVE NEWS");

    const articleId = article.id;
    const articleTitle = article.title.toLowerCase();
    const pubDate = article.publishedAt.split("T")[0];
    const isCurrentlySaved = savedIds.has(articleId);

    setProcessingIds((prev) => [...prev, articleId]);

    try {
      if (isCurrentlySaved) {
        await axios.post(`${apiBase}/unsave-news`, { articleId }, { withCredentials: true });
      } else {
        await axios.post(
          `${apiBase}/save-news`,
          { articleId, articleData: article, pubDate, articleTitle },
          { withCredentials: true }
        );
      }
      await fetchSavedIds();
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== articleId));
    }
  };

  function handleClick(e, path) {
    e.preventDefault();
    navigate(`/${path}/1`);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  }

  const leadArticle = podcastData[0];
  const sidebarArticles = podcastData.slice(1, 4);
  const remainingArticles = podcastData.slice(4, 10);

  return (
    <div className="w-[90%] xl:max-w-310 mx-auto my-12 sm:my-24">
      <style>{`
        @keyframes marqueeVertical {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marqueeHorizontal {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-y {
          animation: marqueeVertical 25s linear infinite;
        }
        .animate-marquee-x {
          animation: marqueeHorizontal 20s linear infinite;
        }
        .pause-marquee:hover .animate-marquee-x,
        .pause-marquee:hover .animate-marquee-y {
          animation-play-state: paused;
        }
      `}</style>

      {/* Main Container Header Section */}
      <div className="flex justify-between items-baseline mb-8 sm:mb-12 border-b border-neutral-200 pb-5">
        <h2 className="lora text-2xl sm:text-3xl lg:text-4xl font-medium text-neutral-900 tracking-tight">
          {sectionTitle}
        </h2>
        <button
          onClick={(e) => handleClick(e, categoryPath)}
          className="manrope hidden sm:inline-flex items-center text-[11px] font-bold cursor-pointer uppercase tracking-wide italic text-neutral-500 hover:text-neutral-900 transition-colors group"
        >
          View Collection
          <ChevronRightIcon className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {podcastData && podcastData.length > 0 ? (
        <div className="space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12 border-b border-neutral-100 items-stretch">
            
            {/* Main Featured Side Container */}
            <div className="lg:col-span-2 flex flex-col gap-12">
              {leadArticle && (
                <div className="flex flex-col group/hero relative">
                  <div className="overflow-hidden aspect-video mb-6 bg-neutral-50 border border-neutral-100">
                    <img
                      src={leadArticle.image}
                      alt={leadArticle.title}
                      className="w-full h-full object-cover grayscale-15 contrast-102 transition-transform duration-700 ease-out group-hover/hero:scale-101 group-hover/hero:grayscale-0"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
                      <Link to={leadArticle.source?.url || "#"} className="manrope text-[12px] font-bold uppercase tracking-widest text-red-700 hover:underline hover:text-red-900">
                        {leadArticle.source?.name || "Featured Source"}
                      </Link>
                      <span className="text-neutral-300 text-xs">|</span>
                      <span className="manrope text-[12px] text-neutral-700 tracking-wider">
                        {leadArticle.publishedAt?.split("T")[0]}
                      </span>
                    </div>

                    {isLoggedIn && (
                      <button
                        onClick={(e) => handleToggleSave(e, leadArticle)}
                        disabled={processingId.includes(leadArticle.id)}
                        className="inline-flex items-center text-neutral-400 hover:text-neutral-900 transition-colors duration-150 gap-1.5 cursor-pointer shadow-sm p-2"
                        title={savedIds.has(leadArticle.id) ? "Remove from Library" : "Save Story"}
                      >
                        {processingId.includes(leadArticle.id) ? (
                          <Ring2 size="15" stroke="1.5" speed="0.8" color="#000" />
                        ) : (
                          <>
                            <Bookmark
                              size={15}
                              className={savedIds.has(leadArticle.id) ? "fill-neutral-900 text-neutral-900" : "text-neutral-400 group-hover/hero:text-neutral-700"}
                            />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <h3 className="lora text-2xl sm:text-3xl lg:text-4xl font-medium text-neutral-900 leading-tight mb-4 tracking-tight">
                    <a href={leadArticle.url} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-800 transition-colors line-clamp-2">
                      {leadArticle.title}
                    </a>
                  </h3>
                  <p className="lora text-neutral-600 text-base leading-relaxed line-clamp-3 mb-6 max-w-2xl">
                    {leadArticle.description}
                  </p>
                  <div className="mt-auto">
                    <a href={leadArticle.url} target="_blank" rel="noopener noreferrer" className="manrope inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-neutral-900 group/link hover:text-neutral-500 transition-colors">
                      <Link2 className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
                      Read Full Article
                    </a>
                  </div>
                </div>
              )}

              {/* Static Integrated Trending Feed for Mobile Layouts */}
              <div className="flex flex-col gap-8 lg:hidden border-t border-neutral-100 pt-8">
                <h4 className="manrope text-[12px] font-bold tracking-wide text-neutral-700 italic uppercase">
                  Trending Stories
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sidebarArticles.map((item, index) => (
                    <div key={`mobile-feat-trend-${index}`} className="flex flex-col group/side relative">
                      {item.image && (
                        <div className="relative aspect-video w-full overflow-hidden bg-neutral-50 border border-neutral-100 mb-3">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover grayscale-20 contrast-102"
                          />
                        </div>
                      )}
                      <Link to={item.source?.url || "#"} className="manrope text-[10px] font-bold uppercase tracking-widest mb-1 block text-red-700 hover:text-red-900">
                        {item.source?.name}
                      </Link>
                      <h4 className="lora text-base font-medium text-neutral-900 leading-snug line-clamp-2 mb-2">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop-Facing Scrolling Marquee Column Feed */}
            <div className="hidden lg:flex flex-col h-full lg:pl-4 min-h-0 overflow-hidden">
              <h4 className="manrope text-[12px] font-bold tracking-wide text-neutral-700 uppercase border-b border-neutral-100 pb-2 mb-4 z-10 bg-white italic">
                Trending Updates
              </h4>
              
              <div className="relative flex flex-col flex-1 min-h-100 lg:max-h-125 overflow-hidden pause-marquee">
                <div className="flex flex-col sm:flex-row lg:flex-col gap-10 animate-marquee-y sm:animate-marquee-x lg:animate-marquee-y pt-2 lg:pt-0 w-full sm:w-max lg:w-full">
                  
                  {/* Primary Loop Track */}
                  {sidebarArticles.map((item, index) => (
                    <div key={`track-1-${index}`} className="flex flex-col group/side relative shrink-0 w-full sm:w-80 lg:w-full">
                      {item.image && (
                        <div className="relative aspect-video w-full overflow-hidden bg-neutral-50 border border-neutral-100 mb-3">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover grayscale-20 contrast-102 transition-transform duration-500 ease-out group-hover/side:scale-103 group-hover/side:grayscale-0"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <Link to={item.source?.url || "#"} className="manrope text-[11px] font-bold uppercase tracking-wide text-red-700 hover:text-red-900 mb-1 block">
                          {item.source?.name}
                        </Link>

                        <h4 className="lora text-[18px] font-medium text-neutral-900 leading-snug line-clamp-2 tracking-tight group-hover/side:text-neutral-600 transition-colors mb-2">
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                        </h4>

                        <div className="flex justify-between items-center pt-3 border-t border-neutral-100 pr-1">
                          <span className="manrope text-[12px] text-neutral-700 tracking-wider">
                            {item.publishedAt?.split("T")[0]}
                          </span>

                          {isLoggedIn && (
                            <div className="flex items-center min-h-6 p-2 shadow-sm ">
                              {processingId.includes(item.id) ? (
                                <Ring2 size="15" stroke="1.5" speed="0.8" color="#000" />
                              ) : (
                                <button 
                                  onClick={(e) => handleToggleSave(e, item)}
                                  disabled={processingId.includes(item.id)}
                                  className='inline-flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer text-[12px] font-bold gap-1'
                                >
                                  <Bookmark
                                    size={15}
                                    className={savedIds.has(item.id) ? "fill-neutral-900 text-neutral-900" : ""}
                                  />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Infinite Continuous Twin Mirror Track */}
                  {sidebarArticles.map((item, index) => (
                    <div key={`track-2-${index}`} className="flex flex-col group/side relative shrink-0 w-full sm:w-80 lg:w-full">
                      {item.image && (
                        <div className="relative aspect-video w-full overflow-hidden bg-neutral-50 border border-neutral-100 mb-3">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover grayscale-20 contrast-102 transition-transform duration-500 ease-out group-hover/side:scale-103 group-hover/side:grayscale-0"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <Link to={item.source?.url || "#"} className="manrope text-[11px] font-bold uppercase tracking-wide text-red-700 hover:text-red-900 mb-1 block">
                          {item.source?.name}
                        </Link>

                        <h4 className="lora text-[18px] font-medium text-neutral-900 leading-snug line-clamp-2 tracking-tight group-hover/side:text-neutral-600 transition-colors mb-2">
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                        </h4>

                        <div className="flex justify-between items-center pt-3 border-t border-neutral-100 pr-1">
                          <span className="manrope text-[12px] text-neutral-700 tracking-wider">
                            {item.publishedAt?.split("T")[0]}
                          </span>

                          {isLoggedIn && (
                            <div className="flex items-center min-h-6 p-2 shadow-sm">
                              {processingId.includes(item.id) ? (
                                <Ring2 size="15" stroke="1.5" speed="0.8" color="#000" />
                              ) : (
                                <button 
                                  onClick={(e) => handleToggleSave(e, item)}
                                  disabled={processingId.includes(item.id)}
                                  className='inline-flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer text-[12px] font-bold gap-1'
                                >
                                  <Bookmark
                                    size={15}
                                    className={savedIds.has(item.id) ? "fill-neutral-900 text-neutral-900" : ""}
                                  />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                </div>
              </div>
            </div>
          </div>

          {/* Structured Regular Feed */}
          {remainingArticles && remainingArticles.length > 0 && (
            <div className="space-y-8">
              <h4 className="lora text-[14px] font-bold italic text-red-700 uppercase">
                More Stories
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {remainingArticles.map((item, index) => (
                  <div key={index} className="relative flex flex-col group/container">
                    <PodcastCard
                      image={item.image}
                      title={item.title}
                      url={item.url}
                      description={item.description}
                      source={item.source?.name}
                      sourceUrl={item.source?.url}
                      publishedAt={item.publishedAt}
                    />

                    {isLoggedIn && (
                      <button
                        onClick={(e) => handleToggleSave(e, item)}
                        disabled={processingId.includes(item.id)}
                        className="absolute bottom-4 right-5 p-2 bg-white/95 backdrop-blur-xs border border-neutral-200 shadow-xs transition-all duration-200 z-20 disabled:cursor-not-allowed hover:bg-neutral-900 hover:border-neutral-900 group/save cursor-pointer"
                      >
                        {processingId.includes(item.id) ? (
                          <div className="flex items-center px-1">
                            <Ring2 size="15" stroke="2.5" speed="0.8" color="#737373" />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Bookmark
                              size={15}
                              className={`transition-colors duration-200 ${
                                savedIds.has(item.id) 
                                  ? "fill-neutral-900 text-neutral-900 group-hover/save:fill-white group-hover/save:text-white" 
                                  : "text-neutral-500 group-hover/save:text-white"
                              }`}
                            />
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Primary Collection Link Footer */}
      <div className="mt-20 pt-8 border-t border-neutral-100 flex justify-center">
        <button
          onClick={(e) => handleClick(e, categoryPath)}
          className="manrope flex items-center gap-2 bg-neutral-900 text-white py-3.5 px-8 text-[11px] font-bold uppercase tracking-widest border border-neutral-900 hover:bg-transparent hover:text-neutral-900 transition-colors duration-300 cursor-pointer"
        >
          Browse All Updates
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HomeSliders;