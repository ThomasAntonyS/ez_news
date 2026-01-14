import { useNavigate, useParams, Link } from "react-router-dom";
import Header from '../components/Header';
import { useEffect, useState } from "react";
import { Link2, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import Footer from "../components/Footer";
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const SingleCategory = () => {
    const { category, page } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const { userData, savedIds, fetchSavedIds, isLoggedIn } = useAuth();
    const apiBase = import.meta.env.VITE_API_BASE;

    const Links = [
        { name: "Home", path: "" },
        { name: "General", path: "general" },
        { name: "Technology", path: "technology" },
        { name: "Entertainment", path: "entertainment" },
        { name: "Sports", path: "sports" },
        { name: "Business", path: "business" },
        { name: "World", path: "world" },
        { name: "Nation", path: "nation" },
        { name: "Science", path: "science" },
        { name: "Health", path: "health" },
    ];

    document.title = `${category.charAt(0).toUpperCase() + category.slice(1)}`;


    const fetchData = async () => {
        setLoading(true);
        const cacheKey = `${category}_${page}`;
        const now = Date.now();
        const CACHE_LIFETIME = 8 * 60 * 60 * 1000;

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
                    setTotalPages(Math.min(Math.ceil(parsed.data.totalArticles / 10), 10));
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch(`${apiBase}/category/${category}/${page}`);
            const response = await res.json();

            if (!response.articles) {
                navigate("/error-not-found", { replace: true });
                return;
            }

            setData(response.articles || []);
            setTotalPages(Math.min(Math.ceil(response.totalArticles / 10), 10));
            sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: response }));
        } catch (error) {
            console.error("FETCH_ERROR", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const parsedPage = parseInt(page);
        const isValidCategory = Links.some(l => category === l.path);
        const isValidPage = !isNaN(parsedPage) && parsedPage > 0;

        if (isValidCategory && isValidPage) {
            fetchData();;
        } else {
            navigate("/error-not-found", { replace: true });
        }
    }, [page, category]);

    const handleNavigation = (newPage) => {
        navigate(`/${category}/${newPage}`);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    };

    const handleToggleSave = async (e, article) => {
        e.preventDefault();
        if (!userData) return alert("PLEASE LOGIN TO SAVE NEWS");

        const articleId = article.id;
        const pubDate = article.publishedAt.split("T")[0];
        const isAlreadySaved = savedIds.has(articleId);

        try {
            if (!isAlreadySaved) {
                await axios.post(`${apiBase}/save-news`, { articleId, articleData: article, pubDate }, { withCredentials: true });
            } else {
                await axios.post(`${apiBase}/unsave-news`, { articleId }, { withCredentials: true });
            }
        } catch (error) {
            console.error("TRANSACTION_FAILED", error);
        }
        finally{
            fetchSavedIds();
        }
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <Header />
            
            <div className="pt-20">
                <p className="w-max mx-auto mt-10 text-[2.5rem] sm:text-[6rem] 2xl:text-[10rem] font-black uppercase tracking-tighter">
                    {category}
                </p>
            </div>

            <div className="w-full sm:w-[90%] mx-auto px-4 py-10">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Ring2 size="40" stroke="5" speed="0.8" color="black" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
                        {data.map((article, index) => (
                            <div
                                key={index}
                                className="group relative border-2 border-black bg-white flex flex-col w-full transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
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

                                <div className="px-5 py-3 sm:pt-5 flex flex-col flex-1">
                                    <Link to={article?.source?.url} className="text-[10px] w-max font-black uppercase tracking-wide text-red-600 mb-2 hover:underline">
                                        {article.source?.name}
                                    </Link>
                                    
                                    <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight uppercase">
                                        {article.title}
                                    </h3>
                                    
                                    <p className="text-gray-800 text-sm mb-6 line-clamp-3">
                                        {article.description}
                                    </p>

                                    <div className="mt-auto flex justify-between items-center pt-2 border-t border-black">
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-xs font-black uppercase tracking-wide hover:underline px-2"
                                        >
                                            <Link2 className="w-4 h-4 mr-2" />
                                            Full Report
                                        </a>

                                        {
                                            isLoggedIn?
                                            <button 
                                                onClick={(e) => handleToggleSave(e, article)} 
                                                className="flex p-2 cursor-pointer transition-all"
                                            >
                                                <Bookmark 
                                                    size={20}
                                                    className={`transition-colors ${savedIds.has(article.id) ? 'fill-black text-black' : 'text-black'}`} 
                                                />
                                                <span className="text-xs h-max my-auto font-black hover:underline">{savedIds.has(article.id)?"IN LIBRARY":"ADD TO LIBRARY"}</span>
                                            </button>
                                            :
                                            null
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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

            <Footer />
        </div>
    );
};

export default SingleCategory;