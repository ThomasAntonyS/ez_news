import { useNavigate, useParams, Link } from "react-router-dom";
import Header from '../components/Header';
import { useEffect, useState } from "react";
import { Link2, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import Footer from "../components/Footer";
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const SkeletonCard = () => (
    <div className="relative border border-neutral-100 bg-white flex flex-col w-full animate-pulse">
        <div className="absolute bottom-4 right-5 h-4 w-16 bg-neutral-100 z-10" />
        <div className="bg-neutral-100 aspect-video w-full" />
        <div className="p-6 flex flex-col flex-1 space-y-3">
            <div className="h-3 w-20 bg-neutral-100" />
            <div className="h-5 w-full bg-neutral-100" />
            <div className="h-5 w-5/6 bg-neutral-100" />
            <div className="pt-2 space-y-2">
                <div className="h-3 w-full bg-neutral-50" />
                <div className="h-3 w-4/5 bg-neutral-50" />
            </div>
            <div className="mt-auto pt-4 border-t border-neutral-50 flex justify-between items-center">
                <div className="h-3 w-16 bg-neutral-100" />
            </div>
        </div>
    </div>
);

const Search = () => {
    const { q, page } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingIds] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const { userData, savedIds, fetchSavedIds, isLoggedIn } = useAuth();
    const apiBase = import.meta.env.VITE_API_BASE;

    document.title = "EZ NEWS | Search";

    const fetchData = async (query, pageNum) => {
        setLoading(true);
        const cacheKey = `search_${query}_${pageNum}`;
        const now = Date.now();
        const CACHE_LIFETIME = 8 * 60 * 60 * 1000;

        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (now - parsed.timestamp < CACHE_LIFETIME) {
                    const articles = parsed.data.articles || [];
                    setData(articles);
                    setTotalPages(Math.min(10, Math.ceil(parsed.data.totalArticles / 10)));
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch(`${apiBase}/search/${query}/${pageNum}`);
            const response = await res.json();

            setData(response.articles || []);
            setTotalPages(Math.min(10, Math.ceil(response.totalArticles / 10)));
            sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: response }));
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
        } else {
            navigate("/error-not-found", { replace: true });
        }
    }, [q, page]);

    const handleNavigation = (newPage) => {
        navigate(`/search/${q}/${newPage}`);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    };

    const handleToggleSave = async (e, article) => {
        e.preventDefault();
        if (!userData) return alert("PLEASE LOGIN TO SAVE NEWS");

        const articleId = article.id;
        const articleTitle = article.title.toLowerCase();
        const pubDate = article.publishedAt.split("T")[0];
        const isCurrentlySaved = savedIds?.has(articleId);

        setProcessingIds(prev => [...prev, articleId]);

        try {
            if (isCurrentlySaved) {
                await axios.post(`${apiBase}/unsave-news`, { articleId }, { withCredentials: true });
            } else {
                await axios.post(`${apiBase}/save-news`, { articleId, articleData: article, pubDate, articleTitle }, { withCredentials: true });
            }
            await fetchSavedIds();
        } catch (error) {
            console.error(error);
        } finally {
            setProcessingIds(prev => prev.filter(id => id !== articleId));
        }
    };

    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <Header />
            
            <div className="pt-24 border-b border-neutral-100 bg-neutral-50/50">
                <div className="w-[90%] xl:max-w-310 mx-auto py-12">
                    <h1 className="lora text-4xl sm:text-5xl font-medium tracking-tight text-neutral-900">
                        Search Results
                    </h1>
                    <p className="manrope text-sm font-bold text-neutral-700 uppercase tracking-wide mt-3">
                        Query : <span className="text-red-700 normal-case italic">"{q}"</span> {!loading && data.length > 0 && `• Page ${page} of ${totalPages}`}
                    </p>
                </div>
            </div>

            <div className="w-[90%] xl:max-w-310 mx-auto py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-16">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    ) : data.length > 0 ? (
                        data.map((article, index) => (
                            <div
                                key={index}
                                className="group relative border border-neutral-200 bg-white flex flex-col w-full transition-colors duration-300 hover:border-neutral-400"
                            >
                                <div className="overflow-hidden aspect-video border-b border-neutral-100 bg-neutral-50">
                                    <img
                                        src={article.image || "/placeholder-news.jpg"}
                                        alt={article.title}
                                        className="w-full h-full object-cover grayscale-15 contrast-102 transition-transform duration-700 ease-out group-hover:scale-102 group-hover:grayscale-0"
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex justify-between items-baseline mb-2.5">
                                        <Link to={article.source?.url || "#"} className="manrope text-[12px] font-bold uppercase tracking-wide text-red-700 hover:underline line-clamp-1 max-w-[70%]">
                                            {typeof article.source === 'object' ? article.source?.name : article.source}
                                        </Link>
                                        <span className="manrope text-[11px] font-semibold text-neutral-700 tracking-wider shrink-0 italic">
                                            {article.publishedAt?.split("T")[0]}
                                        </span>
                                    </div>
                                    
                                    <h3 className="lora text-lg font-medium text-neutral-900 leading-snug mb-3 tracking-tight line-clamp-2 group-hover:text-neutral-700 transition-colors">
                                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                                            {article.title}
                                        </a>
                                    </h3>
                                    
                                    <p className="lora text-neutral-600 text-[14px] leading-relaxed mb-6 line-clamp-3 font-normal">
                                        {article.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-neutral-100 flex justify-between items-center relative">
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="manrope inline-flex items-center text-[12px] font-bold uppercase tracking-wider text-neutral-800 transition-colors group/link"
                                        >
                                            <Link2 className="w-3.5 h-3.5 mr-1.5 text-neutral-400 group-hover/link:text-neutral-600" />
                                            Full Report
                                        </a>

                                        {isLoggedIn && (
                                            <button
                                                onClick={(e) => handleToggleSave(e, article)}
                                                disabled={processingId.includes(article.id)}
                                                className="inline-flex items-center text-neutral-900 transition-colors p-1 cursor-pointer"
                                                title={savedIds?.has(article.id) ? "Saved" : "Save Article"}
                                            >
                                                {processingId.includes(article.id) ? (
                                                    <div className="flex items-center px-2">
                                                        <Ring2 size="15" stroke="2.5" speed="0.8" color="#000" />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <Bookmark
                                                            size={15}
                                                            className={savedIds?.has(article.id) ? "fill-neutral-900 text-neutral-900" : "text-neutral-900"}
                                                        />
                                                        <span className="manrope text-[11px] font-bold tracking-wider uppercase text-neutral-900">
                                                            {savedIds?.has(article.id) ? "Saved" : "Save Article"}
                                                        </span>
                                                    </div>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-neutral-200 bg-neutral-50/40 rounded-xs">
                            <p className="lora text-center text-xl text-neutral-500 max-w-sm px-4 font-normal leading-relaxed">
                                No matching articles found. Try refining your search query keywords.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {data.length > 0 && !loading && (
                <div className="flex justify-center items-center gap-8 pb-24">
                    <button
                        onClick={() => handleNavigation(parseInt(page) - 1)}
                        disabled={parseInt(page) <= 1}
                        className="p-2 border border-neutral-700 text-neutral-700 disabled:opacity-20 hover:text-neutral-900 hover:border-neutral-400 transition-colors cursor-pointer rounded-xs disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <span className="manrope text-sm font-bold tracking-wide text-neutral-700 uppercase">
                        Page {page} / {totalPages}
                    </span>

                    <button
                        onClick={() => handleNavigation(parseInt(page) + 1)}
                        disabled={parseInt(page) >= totalPages}
                        className="p-2 border border-neutral-700 text-neutral-700 disabled:opacity-20 hover:text-neutral-900 hover:border-neutral-400 transition-colors cursor-pointer rounded-xs disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Search;