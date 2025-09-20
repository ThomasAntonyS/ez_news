import { useNavigate, useParams } from "react-router-dom";
import Header from '../components/Header';
import { useEffect, useState } from "react";
import { Link2, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';

const Search = () => {
    const { q, page } = useParams();
    document.title = "EZ NEWS | Search";
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchData = async (query, pageNum) => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_BASE;
        const cacheKey = `search_${query}_${pageNum}`;
        const now = Date.now();
        const CACHE_LIFETIME = 14400000;

        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (now - parsed.timestamp < CACHE_LIFETIME) {
                    const articles = parsed.data.articles || [];
                    if (articles.length === 0) {
                        navigate("/error-not-found", { replace: true });
                    } else {
                        setData(articles);
                    }
                    const calculatedTotalPages = Math.min(10, Math.ceil(parsed.data.totalArticles / 10));
                    setTotalPages(()=>calculatedTotalPages);
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch(`${apiUrl}/search/${query}/${pageNum}`);
            const response = await res.json();

            if (!response.articles) {
                navigate("/error-not-found", { replace: true });
                return;
            }

            setData(response.articles || []);
            const calculatedTotalPages = Math.min(10, Math.ceil(response.totalArticles / 10));
            setTotalPages(()=>calculatedTotalPages);

            sessionStorage.setItem(
                cacheKey,
                JSON.stringify({ timestamp: now, data: response })
            );

        } catch (error) {
            console.error("Error fetching articles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const parsedPage = parseInt(page);
        if (q && !isNaN(parsedPage) && parsedPage > 0) {
            fetchData(q, parsedPage);
        } else {
            navigate("/error-not-found", { replace: true });
        }
    }, [q, page, navigate]);

    function handleNavigation(newPage) {
        navigate(`/search/${q}/${newPage}`);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }

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
                                className="relative bg-white rounded-lg overflow-hidden shadow-md flex flex-col w-full transition-transform hover:scale-[1.02]"
                            >
                                <p className="absolute top-0 right-0 py-1 px-2 bg-black/80 text-white">{article.publishedAt.split("T")[0]}</p>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full min-h-[35vh] max-h-[35vh] object-cover"
                                />
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <h3 className="text-lg font-semibold mb-1 sm:mb-2 line-clamp-2">{article.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2 sm:mb-3 line-clamp-4">
                                        {article.description}
                                    </p>
                                    <p className="text-red-900 font-bold line-clamp-1 mb-2 sm:mb-3">
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
                                        className="flex items-center text-blue-600 font-medium hover:underline w-max"
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


            <div className="flex justify-center items-center gap-4 py-8">
                <button
                    onClick={() => handleNavigation(parseInt(page) - 1)}
                    disabled={parseInt(page) <= 1}
                    className="bg-gray-300 p-2 rounded-full disabled:opacity-50 hover:cursor-pointer hover:bg-gray-200"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <span className="text-xl font-semibold">Page {page} / {totalPages}</span>

                <button
                    onClick={() => handleNavigation(parseInt(page) + 1)}
                    disabled={parseInt(page) >= totalPages}
                    className="bg-gray-300 p-2 rounded-full disabled:opacity-50 hover:cursor-pointer hover:bg-gray-200"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            <Footer />
        </>
    );
};

export default Search;