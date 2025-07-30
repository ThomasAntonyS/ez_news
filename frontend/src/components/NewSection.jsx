import { useContext, useEffect, useState } from 'react';
import { newsContext } from '../context/NewsContext';
import { Ring2 } from 'ldrs/react';
import {Link} from 'react-router-dom'
import 'ldrs/react/Ring2.css';

const NewSection = () => {
  const { setPopular } = useContext(newsContext);
  const [trending, setTrending] = useState([]);
  const [popularNews, setPopularNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_BASE = import.meta.env.VITE_API_BASE

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      const cacheKey = 'top-headlines';
      const now = Date.now();

      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (now - parsed.timestamp < 10800000) {
            const articles = parsed.data.articles || [];
            setPopular(articles);
            setPopularNews(articles.slice(0, 5));
            setTrending(articles.slice(5, 10));
            setLoading(false);
            return;
          }
        }

        const res = await fetch(`${API_BASE}/category/top-headlines`);
        const response = await res.json();
        const articles = response.articles || [];

        setPopular(articles);
        setPopularNews(articles.slice(0, 5));
        setTrending(articles.slice(5, 10));

        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: now, data: response })
        );

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch popular news:', err);
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <div className="w-[95%] sm:max-w-[70%] mt-24 mx-auto px-2">
      <p className="mb-6 sm:my-4 font-semibold text-3xl sm:text-2xl lg:text-[1.7rem]">
        Popular News
      </p>

      {loading ? (
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
      ) : (
        <div className="w-full flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-[60%] rounded-md">
            {popularNews.map((item, index) => (
              <Link
                key={index}
                className="flex flex-col sm:flex-row w-full sm:p-2 mb-16 shadow-md sm:shadow-none sm:mb-6 gap-3 transition-all rounded-lg sm:rounded-none text-justify hover:border-b"
                to={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading='lazy'
                  className="w-full sm:w-[30%] h-auto aspect-video object-cover rounded-md"
                />
                <div className="flex flex-col justify-between w-full sm:w-[70%] p-3 sm:px-0">
                  <p className="font-bold text-lg sm:text-xl line-clamp-2">{item.title}</p>
                  <p className="text-sm sm:text-base line-clamp-2">{item.description}</p>
                  <div className="flex justify-between text-xs sm:text-sm mt-4">
                    <p className="text-red-900 font-bold">
                      Source:{' '}
                      <a
                        href={item.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:underline underline sm:no-underline"
                      >
                        {item.source?.name}
                      </a>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="w-full lg:w-[40%] h-max rounded-md p-3">
            <p className="text-2xl pb-1 sm:text-xl mb-3 font-semibold border-b-2">Trending</p>
            {trending.map((item, index) => (
              <a
                key={index}
                className="flex items-start gap-3 py-4"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="text-white bg-red-600 px-2 py-1 rounded-sm text-sm">
                  {index + 1}
                </div>
                <div className="flex flex-col justify-between w-full">
                  <p className="font-semibold text-base sm:text-lg line-clamp-2 hover:text-blue-400 hover:cursor-pointer text-justify">
                    {item.title}
                  </p>
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-1 w-full">
                    <p className="text-red-900 font-bold">
                      Source:{' '}
                      <a
                        href={item.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:underline underline sm:no-underline"
                      >
                        {item.source?.name}
                      </a>
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewSection;
