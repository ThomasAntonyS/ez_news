import { useNavigate, useParams } from "react-router-dom";
import Header from '../components/Header';
import { useEffect, useState } from "react";
import {Link2 } from "lucide-react";
import Footer from "../components/Footer";
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';

const SingleCategory = () => {
  const { category } = useParams();
  document.title = `${category.charAt(0).toUpperCase() + category.slice(1)}`
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const fetchData = async () => {
    const apiBase = import.meta.env.VITE_API_BASE;
    setLoading(true);

    const cacheKey = `category_${category}`;
    const now = Date.now();

    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (now - parsed.timestamp < 10800000) {
          const articles = parsed.data.articles || [];
          if (articles.length === 0) {
            navigate("/not-found", { replace: true });
          } else {
            setData(articles);
          }
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`${apiBase}/category/${category}`);
      const response = await res.json();

      if (!response.articles) {
        navigate("/not-found", { replace: true });
        return;
      }

      const articles = response.articles || [];
      setData(articles);

      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({ timestamp: now, data: response })
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
    }
  };


  useEffect(() => {
    if (category) {
      fetchData( category);
    }
  }, [ category]);


  return (
    <>
      <Header />
      <div>
        <p className="w-max mx-auto mt-[15vh] text-[3rem] sm:text-[6rem] 2xl:text-[10rem] font-bold">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </p>
      </div>

      <div className="w-[90%] mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
            {data.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col w-full transition-transform hover:scale-[1.02]"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-[30vh] object-cover"
                />
                <div className="p-4 flex flex-col justify-between h-full">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-4">
                    {article.description}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 font-medium hover:underline"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Know more
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SingleCategory;
