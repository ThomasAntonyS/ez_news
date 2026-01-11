import { useNavigate, useParams } from "react-router-dom";
import Header from '../components/Header';
import { useEffect, useState } from "react";
import { Link2, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import Footer from "../components/Footer";
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Search = () => {
    const { q, page } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [savedIds, setSavedIds] = useState(new Set());
    const navigate = useNavigate();
    const { userData } = useAuth();
    const apiBase = import.meta.env.VITE_API_BASE;

    document.title = "EZ NEWS | Search";

    const fetchSavedStatus = async () => {
        if (!userData) {
            setSavedIds(new Set());
            return;
        }
        try {
            const res = await axios.get(`${apiBase}/get-saved-news`, { withCredentials: true });
            const ids = new Set(res.data.map(item => item.news_id));
            setSavedIds(ids);
        } catch (error) {
            console.error("SYNC_ERROR", error);
        }
    };

    const fetchData = async (query, pageNum) => {
        setLoading(true);
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
                    setTotalPages(Math.min(10, Math.ceil(parsed.data.totalArticles / 10)));
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch(`${apiBase}/search/${query}/${pageNum}`);
            const response = await res.json();

            setData(response.articles || []);
            setTotalPages(Math.min(10, Math.ceil(response.totalArticles / 10)));

            sessionStorage.setItem(
                cacheKey,
                JSON.stringify({ timestamp: now, data: response })
            );

        } catch (error) {
            console.error("FETCH_ERROR", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const parsedPage = parseInt(page);
        if (q && !isNaN(parsedPage) && parsedPage > 0) {
            fetchData(q, parsedPage);
            fetchSavedStatus();
        } else {
            navigate("/error-not-found", { replace: true });
        }
    }, [q, page, userData]);

    const handleNavigation = (newPage) => {
        navigate(`/search/${q}/${newPage}`);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    const handleToggleSave = async (e, article) => {
        e.preventDefault();
        if (!userData) return alert("PLEASE LOGIN TO SAVE NEWS");

        const articleId = article.id;
        const isCurrentlySaved = savedIds.has(articleId);

        setSavedIds(prev => {
            const next = new Set(prev);
            if (isCurrentlySaved) next.delete(articleId);
            else next.add(articleId);
            return next;
        });

        try {
            if (isCurrentlySaved) {
                await axios.post(`${apiBase}/unsave-news`, { articleId }, { withCredentials: true });
            } else {
                await axios.post(`${apiBase}/save-news`, { articleId, articleData: article }, { withCredentials: true });
            }
        } catch (error) {
            setSavedIds(prev => {
                const rollback = new Set(prev);
                if (isCurrentlySaved) rollback.add(articleId);
                else rollback.delete(articleId);
                return rollback;
            });
        }
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <Header />
            
            <div className="pt-20">
                <p className="w-max mx-auto mt-10 text-[2.5rem] sm:text-[6rem] 2xl:text-[10rem] font-black uppercase tracking-tighter">
                    Search
                </p>
            </div>

            <div className="w-[90%] mx-auto px-4 py-10">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Ring2 size="40" stroke="5" speed="0.8" color="black" />
                    </div>
                ) : (
                    <>
                        {data.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
                                {data.map((article, index) => (
                                    <div
                                        key={index}
                                        className="group relative border-2 border-black bg-white flex flex-col w-full transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <p className="absolute top-2 right-2 py-1 px-2 bg-black text-white text-[10px] font-bold z-10">
                                            {article.publishedAt.split("T")[0]}
                                        </p>
                                        
                                        <div className="overflow-hidden border-b-2 border-black">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-[250px] object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="p-5 flex flex-col flex-1">
                                            <span className="text-[10px] font-black uppercase tracking-wide text-red-600 mb-2">
                                                {article.source?.name}
                                            </span>
                                            
                                            <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight uppercase">
                                                {article.title}
                                            </h3>
                                            
                                            <p className="text-gray-800 text-sm mb-6 line-clamp-3">
                                                {article.description}
                                            </p>

                                            <div className="mt-auto flex justify-between items-center pt-4 border-t border-black">
                                                <a
                                                    href={article.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-xs font-black uppercase tracking-wide hover:underline"
                                                >
                                                    <Link2 className="w-4 h-4 mr-2" />
                                                    Full Report
                                                </a>

                                                <button 
                                                    onClick={(e) => handleToggleSave(e, article)} 
                                                    className="p-2 border-2 border-transparent hover:border-black transition-all"
                                                >
                                                    <Bookmark 
                                                        size={20}
                                                        className={`transition-colors ${savedIds.has(article.id) ? 'fill-black text-black' : 'text-black'}`} 
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full px-3 py-10 sm:py-20 flex flex-col items-center justify-center text-black bg-white border-2 border-black border-dashed">
                                <p className="text-center text-xl sm:text-3xl font-black uppercase tracking-tighter max-w-lg mx-auto">
                                    Oops! Nothing popped up for that search...
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {data.length > 0 && (
                <div className="flex justify-center items-center gap-6 py-12 border-t-2 border-black">
                    <button
                        onClick={() => handleNavigation(parseInt(page) - 1)}
                        disabled={parseInt(page) <= 1}
                        className="border-2 border-black p-3 disabled:opacity-20 hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <span className="text-lg font-black uppercase tracking-widest">
                        {page} / {totalPages}
                    </span>

                    <button
                        onClick={() => handleNavigation(parseInt(page) + 1)}
                        disabled={parseInt(page) >= totalPages}
                        className="border-2 border-black p-3 disabled:opacity-20 hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Search;