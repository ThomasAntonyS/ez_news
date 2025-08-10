import { useNavigate, useParams } from "react-router-dom";
import Header from '../components/Header';
import { useEffect, useState } from "react";
import {Link2 } from "lucide-react";
import Footer from "../components/Footer";
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';

const Search = () => {
  const { q } = useParams();
  document.title = "EZ NEWS | Search"
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

const fetchData = async (query) => {
  setLoading(true);
  const apiUrl = import.meta.env.VITE_API_BASE
  try {
    const res = await fetch(`${apiUrl}/search/${query}`);
    const response = await res.json();

    if (!response.articles) {
      navigate("/error-not-found", { replace: true });
      return;
    }

    setData(response.articles || []);
  } catch (error) {
    console.error("Error fetching articles:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (q) {
      fetchData(q);
    }
  }, [q]);

  return (
    <>
      <Header />
      <div>
        <p className="w-max mx-auto mt-[15vh] text-[3rem] sm:text-[6rem] 2xl:text-[10rem] font-bold">
          Search
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
                  <p className="text-red-900 font-bold line-clamp-1 mb-3">
                    Source:{' '}
                    <a
                      href={article.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:underline text-ellipsis overflow-hidden underline sm:no-underline"
                    >
                      {article.source?.name}
                    </a>
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

export default Search;
