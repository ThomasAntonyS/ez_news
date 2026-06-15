import { useContext, useEffect, useState } from 'react';
import { newsContext } from '../context/NewsContext';
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const PopularSkeleton = () => (
    <div className="mb-8 flex flex-col sm:flex-row border border-neutral-100 animate-pulse">
        <div className="w-full sm:w-[32%] aspect-video sm:aspect-square bg-neutral-100 shrink-0" />
        <div className="flex flex-col justify-between w-full sm:w-[68%] p-6 space-y-4">
            <div className="space-y-3 flex-1">
                <div className="h-3 w-16 bg-neutral-100" />
                <div className="h-5 w-11/12 bg-neutral-100" />
                <div className="h-5 w-3/4 bg-neutral-100" />
                <div className="pt-2 space-y-2">
                    <div className="h-3 w-full bg-neutral-50" />
                    <div className="h-3 w-5/6 bg-neutral-50" />
                </div>
            </div>
            <div className="self-end h-4 w-20 bg-neutral-100 mt-4" />
        </div>
    </div>
);

const TrendingSkeleton = () => (
    <div className="py-4 border-b border-neutral-100 flex items-start gap-4 animate-pulse">
        <div className="w-6 h-6 bg-neutral-100 shrink-0" />
        <div className="flex flex-col w-full space-y-2.5">
            <div className="h-4 w-full bg-neutral-100" />
            <div className="h-4 w-5/6 bg-neutral-100" />
            <div className="h-2.5 w-16 bg-neutral-50 pt-1" />
        </div>
    </div>
);

const NewSection = () => {
    const { setPopular } = useContext(newsContext);
    const { userData, savedIds, fetchSavedIds, isLoggedIn } = useAuth();
    const [trending, setTrending] = useState([]);
    const [popularNews, setPopularNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingIds, setProcessingIds] = useState([]);

    const API_BASE = import.meta.env.VITE_API_BASE;
    const CACHE_LIFETIME = 8 * 60 * 60 * 1000;

    useEffect(() => {
        const fetchPopular = async () => {
            setLoading(true);
            const cacheKey = 'top-headlines';
            const now = Date.now();

            try {
                const cached = sessionStorage.getItem(cacheKey);
                const parsed = JSON.parse(cached);
                if (cached && !parsed?.data?.error ) {
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

                sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: response }));
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
        const articleTitle = article.title.toLowerCase();
        const pubDate = article.publishedAt.split("T")[0];
        const isCurrentlySaved = savedIds.has(articleId);

        setProcessingIds(prev => [...prev, articleId]);

        try {
            if (isCurrentlySaved) {
                await axios.post(`${API_BASE}/unsave-news`, { articleId }, { withCredentials: true });
            } else {
                await axios.post(`${API_BASE}/save-news`, { articleId, articleData: article, pubDate, articleTitle }, { withCredentials: true });
            }
            await fetchSavedIds();
        } catch (error) {
            console.error(error);
        } finally {
            setProcessingIds(prev => prev.filter(id => id !== articleId));
        }
    };

    return (
        <div className="w-[90%] xl:max-w-310 mt-24 mx-auto">
            <div className="flex justify-between items-baseline mb-12 border-b border-neutral-200 pb-5">
                <h2 className="lora text-3xl sm:text-4xl font-medium text-neutral-900 tracking-tight">
                    {"Popular News"}
                </h2>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-16">
                <div className="w-full lg:w-[65%] flex flex-col">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => <PopularSkeleton key={i} />)
                    ) : (
                        popularNews.map((item, index) => (
                          <div 
                            key={index} 
                            className="relative group border border-neutral-200 bg-white mb-8 transition-colors duration-300 hover:border-neutral-400 flex flex-col sm:flex-row"
                          >
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col sm:flex-row h-full w-full"
                                >
                                    <div className="w-full sm:w-[32%] overflow-hidden border-b sm:border-b-0 sm:border-r border-neutral-100 bg-neutral-50 shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            loading='lazy'
                                            className="w-full h-full aspect-video sm:aspect-square object-cover grayscale-15 contrast-102 transition-transform duration-700 ease-out group-hover:scale-102 group-hover:grayscale-0"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-between flex-1 p-6">
                                        <div className="min-w-0">
                                            <span className="manrope text-[11px] font-bold uppercase tracking-wide text-red-700 block mb-2">
                                                {item.source?.name}
                                            </span>
                                            <h3 className="lora font-medium text-xl text-neutral-900 leading-snug tracking-tight group-hover:text-neutral-700 transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="lora text-[14px] mt-3 text-neutral-600 leading-relaxed line-clamp-2 sm:line-clamp-3 font-normal">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </a>

                                {isLoggedIn && (
                                    <button
                                        onClick={(e) => handleToggleSave(e, item)}
                                        disabled={processingIds.includes(item.id)}
                                        className="absolute bottom-4 right-5 inline-flex items-center text-neutral-400 hover:text-neutral-900 transition-colors duration-150 gap-1 hover:cursor-pointer p-2 shadow-sm"
                                        title={savedIds.has(item.id) ? "Remove from Library" : "Save Story"}
                                    >
                                        {processingIds.includes(item.id) ? (
                                            <Ring2 size="15" stroke="1.5" speed="0.8" color="#000" />
                                        ) : (
                                            <>
                                                <Bookmark
                                                    size={15}
                                                    className={savedIds.has(item.id) ? "fill-neutral-900 text-neutral-900" : "text-neutral-400"}
                                                />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="w-full lg:w-[35%] flex flex-col">
                    <p className="manrope text-[12px] font-bold tracking-wide text-neutral-700 uppercase border-b border-neutral-100 pb-2 mb-6 italic">
                        Trending Updates
                    </p>
                    <div className="flex flex-col">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => <TrendingSkeleton key={i} />)
                        ) : (
                            trending.map((item, index) => (
                                <div 
                                    key={index}
                                    className="group flex gap-4 items-start py-4 border-b border-neutral-100 last:border-0"
                                >
                                    <div className="manrope text-neutral-700 font-light text-2xl tracking-tighter leading-none pt-0.5 min-w-6">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <h4 className="lora text-[15px] font-medium text-neutral-900 leading-snug tracking-tight group-hover:text-neutral-600 transition-colors mb-2">
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                {item.title}
                                            </a>
                                        </h4>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="manrope text-[11px] font-bold uppercase tracking-wide text-red-700">
                                                {item.source?.name}
                                            </span>

                                            {isLoggedIn && (
                                                <button
                                                    onClick={(e) => handleToggleSave(e, item)}
                                                    disabled={processingIds.includes(item.id)}
                                                    className="text-neutral-400 hover:text-neutral-900 transition-colors duration-150 hover:cursor-pointer p-2 shadow-sm"
                                                    title={savedIds.has(item.id) ? "Remove from Library" : "Save Story"}
                                                >
                                                    {processingIds.includes(item.id) ? (
                                                        <Ring2 size="13" stroke="1.5" speed="0.8" color="#000" />
                                                    ) : (
                                                        <Bookmark
                                                            size={13}
                                                            className={savedIds.has(item.id) ? "fill-neutral-900 text-neutral-900 h-max my-auto" : "text-neutral-400 h-max my-auto"}
                                                        />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewSection;