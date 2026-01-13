import PodcastCard from './PostCard';
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, Bookmark } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

const HomeSliders = ({ sectionTitle, podcastData, categoryPath }) => {
  const navigate = useNavigate();
  const { userData, savedIds, fetchSavedIds, isLoggedIn } = useAuth();
  const apiBase = import.meta.env.VITE_API_BASE;

  const handleToggleSave = async (e, article) => {
    e.preventDefault();
    if (!userData) return alert("PLEASE LOGIN TO SAVE NEWS");

    const articleId = article.id;
    const pubDate = article.publishedAt.split("T")[0];
    const isCurrentlySaved = savedIds.has(articleId);

    try {
      if (isCurrentlySaved) {
        await axios.post(`${apiBase}/unsave-news`, { articleId }, { withCredentials: true });
      } else {
        await axios.post(`${apiBase}/save-news`, { articleId, articleData: article, pubDate }, { withCredentials: true });
      }
    } catch (error) {
      console.error(error)
    }
    finally{
      fetchSavedIds()
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
          onClick={e => handleClick(e, categoryPath)}
          className="hidden sm:block text-xs font-black cursor-pointer uppercase tracking-wide hover:underline decoration-2"
        >
          View Collection →
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
                publishedAt={item.publishedAt}
              />

              {
                isLoggedIn?
                <button 
                  onClick={(e) => handleToggleSave(e, item)} 
                  className="absolute flex bottom-3 right-5 p-2 cursor-pointer border-2 border-transparent hover:border-black bg-white transition-all z-20"
                >
                  <Bookmark 
                    size={20}
                    className={`transition-colors ${savedIds.has(item.id) ? 'fill-black text-black' : 'text-black'}`} 
                  />
                  <span className="text-xs h-max my-auto font-black">{savedIds.has(item.id)?"IN LIBRARY":"ADD TO LIBRARY"}</span>
                </button>
                :
                null
              }
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center py-20">
            <Ring2 size="40" stroke="5" speed="0.8" color="black" />
          </div>
        )}
      </div>

      <div className="mt-16 flex justify-center">
        <Link 
          onClick={e => handleClick(e, categoryPath)} 
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