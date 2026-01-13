import { useState, useEffect, useRef } from 'react';
import { User, Bookmark, LogOut, Trash2, Camera, ChevronLeft, ExternalLink, Loader2, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import Toast from '../components/Toast';
import ConfirmationDialog from '../components/ConfirmationDialog';
import logo from '../assets/icon.png';

const Profile = () => {
  document.title = "EZ NEWS | PROFILE"
  const [activeTab, setActiveTab] = useState('personal');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [savedArticles, setSavedArticles] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialog, setDialog] = useState({ isOpen: false, type: '', onConfirm: null });
  const libraryTopRef = useRef(null);

  const { setIsLoggedIn, userData, setSavedIds, fetchSavedIds } = useAuth();
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE;
  const itemsPerPage = 10;

  const fetchSavedArticles = async (page = 1) => {
    setLoadingSaved(true);
    try {
      const res = await axios.get(`${apiBase}/get-saved-news?page=${page}&limit=${itemsPerPage}`, { withCredentials: true });
      const parsedArticles = res.data.articles.map(item => ({
        ...item,
        news: typeof item.news === 'string' ? JSON.parse(item.news) : item.news
      }));
      setSavedArticles(parsedArticles);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (error) {
      console.error("Error fetching saved news:", error);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedArticles(currentPage);
    }
  }, [activeTab, currentPage]);

  const handleLogout = async () => {
    setIsProcessing(true);
    try {
      await axios.post(`${apiBase}/logout`, {}, { withCredentials: true });
      setSavedIds(new Set())
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      setToast({ show: true, message: "An error occured. Try again", type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsProcessing(true);
    try {
      await axios.delete(`${apiBase}/delete-account`, { withCredentials: true });
      setSavedIds(new Set())
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      setToast({ show: true, message: "Failed to delete account", type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnsave = async (articleId) => {
    const previousArticles = [...savedArticles];
    setSavedArticles(prev => prev.filter(article => article.news_id !== articleId));
    try {
      await axios.post(`${apiBase}/unsave-news`, { articleId }, { withCredentials: true });
      setToast({ show: true, message: "Article removed from library", type: 'success' });
      fetchSavedArticles(currentPage);
    } catch (error) {
      setSavedArticles(previousArticles);
      setToast({ show: true, message: "Failed to remove article", type: 'error' });
    }
    finally{
      fetchSavedIds()
    }
  };

  const openConfirm = (type, action) => {
    setDialog({
      isOpen: true,
      type,
      onConfirm: () => {
        action();
        setDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleNext = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentPage(prev => prev - 1);
  };

  useEffect(() => {
    if (activeTab === "saved") {
      libraryTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);



  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden text-black">
      <div className="w-full h-16 border-b-2 border-black flex items-center justify-between px-6 shrink-0 bg-white z-10">
        <Link to="/" className="flex items-center gap-2 group">
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold uppercase tracking-wide text-sm">Back to News</span>
        </Link>
        <img src={logo} alt="Logo" onClick={() => navigate("/")} className="w-10 h-10 object-contain cursor-pointer" />
      </div>

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <aside className="w-full md:w-80 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col bg-white shrink-0">
          <div className="p-6 md:p-10 flex flex-row md:flex-col items-center gap-4 md:gap-0 border-b-2 border-black">
            <div className="relative">
              <div className="w-16 h-16 md:w-28 md:h-28 rounded-none border-2 border-black flex items-center justify-center bg-gray-50 overflow-hidden">
                <User size={64} className="text-black" />
              </div>
              <button className="absolute -bottom-1 -right-1 bg-black text-white p-1.5 border border-black hover:bg-white hover:text-black transition-all">
                <Camera size={14} />
              </button>
            </div>
            <div className="md:mt-6 md:text-center">
              <h2 className="text-xl font-semibold uppercase tracking-tight truncate max-w-[150px] md:max-w-full">
                {userData?.name || "User"}
              </h2>
              <p className="text-[10px] font-bold uppercase opacity-80 tracking-wide">Verified User</p>
            </div>
          </div>

          <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar bg-white">
            {[
              { id: 'personal', label: 'Personal', icon: <User size={20} /> },
              { id: 'saved', label: 'Library', icon: <Bookmark size={20} /> },
              { id: 'logout', label: 'Logout', icon: <LogOut size={20} /> },
              { id: 'delete', label: 'Delete', icon: <Trash2 size={20} /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); if(item.id === 'saved') setCurrentPage(1); }}
                className={`flex-1 md:flex-none flex items-center justify-center md:justify-start cursor-pointer gap-4 px-6 py-4 text-[10px] md:text-xs font-semibold uppercase tracking-wide transition-all border-r-2 md:border-r-0 md:border-b-2 border-black last:border-r-0 md:last:border-b-0 whitespace-nowrap
                  ${activeTab === item.id ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-white p-6 md:p-16 no-scrollbar">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'personal' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-4xl md:text-6xl font-semibold uppercase tracking-tighter mb-10">Personal<br/>Data</h3>
                <div className="space-y-4">
                  <div className="border-2 border-black p-6 bg-white">
                    <label className="block text-[10px] font-semibold uppercase tracking-wide mb-2">Full Identity</label>
                    <p className="text-xl md:text-2xl font-bold">{userData?.name}</p>
                  </div>
                  <div className="border-2 border-black p-6 bg-white">
                    <label className="block text-[10px] font-semibold uppercase tracking-wide mb-2">Email Connection</label>
                    <p className="text-xl md:text-2xl font-bold">{userData?.email}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div ref={libraryTopRef} className="animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
                <h3 className="text-4xl md:text-6xl font-semibold uppercase tracking-tighter mb-10">Library</h3>
                <div className="grid gap-4">
                  {loadingSaved ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 w-full border-2 border-black animate-pulse bg-gray-50" />)}
                    </div>
                  ) : savedArticles.length > 0 ? (
                    <>
                      {savedArticles.map((item) => (
                        <div key={item.news_id} className="border-2 border-black p-6 group relative bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <a href={item.news.source.url} target="_blank" rel="noopener noreferrer">
                              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 border border-black hover:bg-white hover:text-black transition-colors cursor-pointer">
                                {item.news.source?.name || "News"}
                              </span>
                            </a>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-bold uppercase">{item.news.publishedAt?.split("T")[0]}</span>
                              <button onClick={() => openConfirm('newsDelete', () => handleUnsave(item.news_id))} className="text-black hover:text-red-600 cursor-pointer transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-end gap-6">
                            <a href={item.news.url} target="_blank" rel="noreferrer" className="block group/link">
                              <h4 className="text-xl md:text-2xl font-bold leading-tight group-hover/link:underline decoration-2 line-clamp-3">
                                {item.news.title}
                              </h4>
                            </a>
                            <a href={item.news.url} target="_blank" rel="noreferrer" className="shrink-0 p-2 border-2 border-transparent hover:border-black transition-all">
                              <ExternalLink size={20} />
                            </a>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between mt-12 pt-8 border-t-4 border-black">
                        <button disabled={currentPage === 1} onClick={handlePrevious} className="flex items-center gap-2 font-black cursor-pointer uppercase text-xs border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all disabled:opacity-30">
                          <ChevronLeft size={16} strokeWidth={3} /> Previous
                        </button>
                        <div className="font-black text-sm tracking-widest">PAGE {currentPage} / {totalPages}</div>
                        <button disabled={currentPage === totalPages} onClick={handleNext} className="flex items-center gap-2 font-black cursor-pointer uppercase text-xs border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all disabled:opacity-30">
                          Next <ChevronRight size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="border-2 border-dashed border-black p-12 text-center">
                      <Bookmark size={48} className="mx-auto mb-4" />
                      <p className="font-semibold uppercase tracking-wide">Archives are empty</p>
                      <Link to="/" className="text-xs font-bold underline mt-2 inline-block">Go discover news</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'logout' && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
                <div className="border-2 border-black p-12 inline-block bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-3xl font-semibold uppercase mb-6 tracking-tighter">Sign Out?</h3>
                  <p className="mb-8 font-bold text-sm max-w-xs uppercase">Your library remains safe in our secure database.</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => openConfirm('signOut', handleLogout)} disabled={isProcessing} className="w-full py-4 bg-black text-white font-semibold uppercase tracking-widest cursor-pointer border-2 border-black hover:bg-white hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isProcessing ? <><Loader2 className="animate-spin" size={18}/> PROCESSING...</> : "Confirm Exit"}
                    </button>
                    <button onClick={() => setActiveTab('personal')} className="text-[10px] font-semibold cursor-pointer uppercase tracking-widest hover:underline">Stay Logged In</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delete' && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in slide-in-from-top-2 duration-300">
                <div className="border-4 border-black p-8 md:p-12 max-w-lg bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-4xl font-bold uppercase mb-4 text-black">Nuclear Option</h3>
                  <p className="font-bold text-sm mb-8 leading-relaxed uppercase">Account deletion is permanent. All saved articles will be wiped from the database.</p>
                  <button onClick={() => openConfirm('accountDelete', handleDeleteAccount)} disabled={isProcessing} className="w-full py-4 border-2 border-black text-black font-semibold uppercase cursor-pointer hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {isProcessing ? <><Loader2 className="animate-spin" size={18}/> PROCESSING...</> : "Wipe Account Data"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <ConfirmationDialog isOpen={dialog.isOpen} type={dialog.type} onConfirm={dialog.onConfirm} onCancel={() => setDialog(prev => ({ ...prev, isOpen: false }))} />

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}
    </div>
  );
};

export default Profile;