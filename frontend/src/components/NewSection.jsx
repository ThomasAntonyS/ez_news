import { useContext, useEffect, useState } from 'react';
import { newsContext } from '../context/NewsContext';
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const NewSection = () => {
    const { setPopular } = useContext(newsContext);
    const { userData, savedIds, fetchSavedIds, isLoggedIn } = useAuth();
    const [trending, setTrending] = useState([]);
    const [popularNews, setPopularNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_BASE;
    const CACHE_LIFETIME = 8 * 60 * 60 * 1000;

    useEffect(() => {
        const fetchPopular = async () => {
            setLoading(true);
            const cacheKey = 'top-headlines';
            const now = Date.now();

            try {
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (now - parsed.timestamp < CACHE_LIFETIME) {
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
            } catch (err) {
                console.error('Failed to fetch popular news:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPopular();
    }, []);

    const handleToggleSave = async (e, article) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userData) return alert("PLEASE LOGIN TO SAVE NEWS");

        const articleId = article.id;
        const pubDate = article.publishedAt.split("T")[0];
        const isCurrentlySaved = savedIds.has(articleId);

        try {
            if (isCurrentlySaved) {
                await axios.post(`${API_BASE}/unsave-news`, { articleId }, { withCredentials: true });
            } else {
                await axios.post(`${API_BASE}/save-news`, { articleId, articleData: article, pubDate }, { withCredentials: true });
            }
        } catch (error) {
            console.error(error)
        }
        finally{
            fetchSavedIds()
        }
    };

    return (
        <div className="w-[95%] sm:max-w-[85%] mt-24 mx-auto px-2">
            <div className="flex justify-between items-end mb-10 border-b-4 border-black pb-4">
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">
                    Popular News
                </h2>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Ring2 size="40" stroke="5" speed="0.8" color="black" />
                </div>
            ) : (
                <div className="w-full flex flex-col lg:flex-row gap-10">
                    <div className="w-full lg:w-[65%]">
                        {popularNews.map((item, index) => (
                            <div
                                key={index}
                                className="relative group border-2 border-black bg-white mb-10 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col sm:flex-row h-full"
                                >
                                    <div className="w-full sm:w-[35%] overflow-hidden border-b-2 sm:border-b-0 sm:border-r-2 border-black">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            loading='lazy'
                                            className="w-full h-full aspect-video sm:aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between w-full sm:w-[65%] p-5">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
                                                {item.source?.name}
                                            </span>
                                            <h3 className="font-bold text-xl lg:text-2xl mt-2 line-clamp-2 uppercase leading-tight hover:underline">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm mt-3 text-gray-800 line-clamp-2 sm:line-clamp-4">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                                {
                                isLoggedIn?
                                <button
                                    onClick={(e) => handleToggleSave(e, item)}
                                    className="absolute flex bottom-4 right-4 p-2 cursor-pointer border-2 border-transparent hover:border-black transition-all bg-white"
                                >
                                    <Bookmark
                                        size={20}
                                        className={`${savedIds.has(item.id) ? 'fill-black text-black' : 'text-black'}`}
                                    />
                                    <span className="text-xs h-max my-auto font-black">{savedIds.has(item.id)?"IN LIBRARY":"ADD TO LIBRARY"}</span>
                                </button>
                                :
                                null
                                }
                            </div>
                        ))}
                    </div>

                    <div className="w-full lg:w-[35%]">
                        <p className="text-2xl pb-2 mb-6 font-black uppercase tracking-wide border-b-4 border-black">
                            Trending
                        </p>
                        <div className="flex flex-col gap-6">
                            {trending.map((item, index) => (
                                <div 
                                    key={index}
                                    className="group border-2 border-black p-4 bg-white transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-4"
                                    >
                                        <div className="text-white bg-black px-3 py-1 font-black text-lg">
                                            {index + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-base leading-tight uppercase group-hover:underline">
                                                {item.title}
                                            </p>
                                            <span className="text-[10px] font-black text-red-900 mt-2 uppercase">
                                                {item.source?.name}
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewSection;