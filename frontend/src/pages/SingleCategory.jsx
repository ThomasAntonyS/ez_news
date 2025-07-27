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
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const fetchData = async (page, selectedCategory) => {
    const api = import.meta.env.VITE_API;
    setLoading(true);
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=en&page=${page}&apikey=${api}`
      );      
      const response = await res.json();
      if(!response.article){
        navigate("/not-found")
      }
      const articles = response.articles || [];    
      const pages = Math.ceil((response.totalArticles || 0) / 10);
      setData(articles);
      setTotalPages(pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
    }
  };

  // Whenever category changes, reset page to 1
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  // Whenever page or category changes, fetch data
  useEffect(() => {
    if (category) {
      fetchData(currentPage, category);
    }
  }, [currentPage, category]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
