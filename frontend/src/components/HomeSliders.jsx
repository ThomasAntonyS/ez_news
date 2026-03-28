import PodcastCard from './PostCard';
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, Bookmark } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';
import axios from 'axios';

// --- Skeleton Component ---
const SkeletonCard = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    {/* Image Placeholder */}
    <div className="w-full aspect-video bg-gray-200 border-2 border-gray-100" />
    <div className="space-y-3">
      {/* Title Placeholder */}
      <div className="h-6 bg-gray-200 w-3/4" />
      {/* Description Placeholder */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 w-full" />
        <div className="h-4 bg-gray-200 w-5/6" />
      </div>
      {/* Footer Placeholder */}
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 bg-gray-200 w-20" />
        <div className="h-8 bg-gray-200 w-24" />
      </div>
    </div>
  </div>
);

const HomeSliders = ({ sectionTitle, podcastData, categoryPath }) => {
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

  return (
    <div className="w-[90%] sm:max-w-[85%] mx-auto my-20">
      <div className="flex justify-between items-end mb-10 border-b-4 border-black pb-4">
        <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">
          {sectionTitle}
        </h2>
        <button
          onClick={(e) => handleClick(e, categoryPath)}
          className="hidden sm:flex text-xs font-black cursor-pointer uppercase tracking-wide hover:underline decoration-2"
        >
          View Collection{" "}
          <ChevronRightIcon fontWeight={800} size={13} className="h-max my-auto" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {podcastData && podcastData.length > 0 ? (
          podcastData.map((item, index) => (
            <div key={index} className="relative flex flex-col">
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
                  className="absolute flex items-center bottom-3 right-5 p-2 cursor-pointer border-2 border-transparent hover:border-black bg-white transition-all z-20 disabled:cursor-not-allowed"
                >
                  {processingId.includes(item.id) ? (
                    <div className="flex items-center px-1">
                      <Ring2 size="17" stroke="3" speed="0.8" color="black" />
                      <span className="text-xs ml-1 font-black uppercase">PROCESSING...</span>
                    </div>
                  ) : (
                    <>
                      <Bookmark
                        size={20}
                        className={`transition-colors ${
                          savedIds.has(item.id) ? "fill-black text-black" : "text-black"
                        }`}
                      />
                      <span className="text-xs h-max my-auto font-black ml-1">
                        {savedIds.has(item.id) ? "IN LIBRARY" : "ADD TO LIBRARY"}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          ))
        ) : (
          /* Render 3 or 6 skeleton cards while loading */
          Array(3)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} />)
        )}
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          onClick={(e) => handleClick(e, categoryPath)}
          className="group flex items-center gap-3 bg-black text-white py-4 px-8 font-black uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          Browse All Updates
          <ChevronRightIcon className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default HomeSliders;