import { useState, useEffect, useRef } from 'react';
import { User, Bookmark, LogOut, Trash2, Camera, ChevronLeft, ExternalLink, ChevronRight, Search as SearchIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import Toast from '../components/Toast';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ProfileImageModal from '../components/ProfileImageUpload';
import logo from '../assets/icon.png';

const Profile = () => {
  document.title = "EZ NEWS | PROFILE"
  const { setIsLoggedIn, userData, setSavedIds, fetchSavedIds } = useAuth();
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [savedArticles, setSavedArticles] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(userData?.profile_pic || null);
  const [dialog, setDialog] = useState({ isOpen: false, type: '', onConfirm: null });
  const libraryTopRef = useRef(null);

  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE;
  const itemsPerPage = 10;

  // Track state changes dynamically if parent authentication context changes out of bounds
  useEffect(() => {
    if (userData?.profile_pic) {
      setProfilePic(userData.profile_pic);
    }
  }, [userData]);

  const fetchSavedArticles = async (page = 1, search = searchQuery) => {
    setLoadingSaved(true);
    try {
      const res = await axios.get(
        `${apiBase}/get-saved-news?page=${page}&limit=${itemsPerPage}&search=${search}`, 
        { withCredentials: true }
      )
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
  }

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const delayDebounceFn = setTimeout(() => {
        fetchSavedArticles(1);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      fetchSavedArticles(currentPage);
    }
  }, [searchQuery, currentPage]);

  const handleLogout = async () => {
    setIsProcessing(true);
    try {
      await axios.post(`${apiBase}/logout`, {}, { withCredentials: true });
      setSavedIds(new Set())
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      setToast({ show: true, message: "An error occurred. Try again", type: 'error' });
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
    } finally {
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
    libraryTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePrevious = () => {
    setCurrentPage(prev => prev - 1);
    libraryTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClear = () => {
    setSearchQuery("")
    fetchSavedArticles(1, "")
  }

  const handleAvatarUploadSuccess = (secureUrl) => {
    setProfilePic(secureUrl);
    if (userData) {
      userData.profile_pic = secureUrl;
    }
    setToast({ show: true, message: secureUrl ? "Avatar updated successfully." : "Avatar removed successfully.", type: 'success' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col text-neutral-900">
      
      <div className="w-full h-16 border-b border-neutral-200 flex items-center justify-between px-[5%] shrink-0 bg-white sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 group/back text-neutral-500 hover:text-neutral-900 transition-colors">
          <ChevronLeft size={18} className="group-hover/back:-translate-x-0.5 transition-transform" />
          <span className="manrope font-bold uppercase tracking-widest text-[11px]">Back to News</span>
        </Link>
        <img src={logo} alt="Logo" onClick={() => navigate("/")} className="w-8 h-8 object-contain cursor-pointer grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all" />
      </div>

      <div className="w-[90%] xl:max-w-310 mx-auto py-12 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* ================= LEFT SIDE PANEL: USER PARAMETERS ================= */}
          <div className="md:col-span-1 space-y-8 sticky md:top-24">
            
            {/* Core Card Identity Block */}
            <div className="border border-neutral-200 bg-white p-6 rounded-xs text-center flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full border border-neutral-200 flex items-center justify-center bg-neutral-50 overflow-hidden relative">
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover animate-in fade-in duration-200" 
                    />
                  ) : (
                    <User size={36} className="text-neutral-400 animate-in fade-in duration-200" />
                  )}
                </div>
                <button 
                  onClick={() => setIsImageModalOpen(true)} 
                  className="absolute -bottom-0.5 -right-0.5 bg-neutral-900 text-white p-1.5 rounded-full border border-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Change avatar photo"
                >
                  <Camera size={12} />
                </button>
              </div>
              <h2 className="manrope text-lg font-bold text-neutral-900 truncate max-w-full px-2">
                {userData?.name || "Reader Profile"}
              </h2>
            </div>

            {/* Account Details */}
            <div className="border border-neutral-200 bg-white p-6 rounded-xs space-y-5">
              <h3 className="manrope text-[11px] font-bold uppercase tracking-wide text-neutral-400 border-b border-neutral-100 pb-2">Account Details</h3>
              
              <div className="space-y-1">
                <span className="block manrope text-[10px] font-bold uppercase tracking-wide italic text-neutral-400">Full Name</span>
                <p className="manrope text-xs font-semibold text-neutral-700 truncate">{userData?.name || "Not Specified"}</p>
              </div>

              <div className="space-y-1">
                <span className="block manrope text-[10px] font-bold uppercase tracking-wide italic text-neutral-400">Email</span>
                <p className="manrope text-xs font-semibold text-neutral-700 truncate">{userData?.email || "Not Connected"}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
                <button 
                  onClick={() => openConfirm('signOut', handleLogout)}
                  disabled={isProcessing}
                  className="manrope w-full py-2.5 bg-neutral-900 text-white border border-neutral-900 text-[11px] font-bold uppercase tracking-wider rounded-xs hover:bg-transparent hover:text-neutral-900 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogOut size={13} /> Sign Out Session
                </button>
                <button 
                  onClick={() => openConfirm('accountDelete', handleDeleteAccount)}
                  disabled={isProcessing}
                  className="manrope w-full py-2.5 bg-transparent border border-red-200 text-red-700 text-[11px] font-bold uppercase tracking-wider rounded-xs hover:bg-red-50 hover:border-red-300 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={13} /> Delete Profile
                </button>
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDE PANEL: THE ARCHIVE STREAM ================= */}
          <div ref={libraryTopRef} className="md:col-span-2 space-y-8 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
              <h3 className="lora text-3xl font-medium tracking-tight text-neutral-900">My Library</h3>
              
              {/* Filter Headline Input Mechanism */}
              {(savedArticles.length > 0 || searchQuery) && (
                <div className="flex items-center gap-3 w-full sm:max-w-xs">
                  <div className="flex items-center border-b border-neutral-600 focus-within:border-neutral-800 transition-colors w-full py-1 bg-transparent">
                    <input 
                      type="text" 
                      placeholder="Filter library collection..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-sm font-medium tracking-tight placeholder:text-neutral-600 focus:outline-none bg-transparent text-neutral-800 manrope text-[14px]"
                    />
                    <div className="shrink-0 pl-2 text-neutral-600">
                      <SearchIcon size={14} />
                    </div>
                  </div>
                  {searchQuery.trim() !== "" && (
                    <button 
                      onClick={handleClear}
                      className="manrope px-2 py-0.5 border border-neutral-200 text-neutral-600 rounded-xs text-[12px] font-bold uppercase tracking-wider hover:text-neutral-900 hover:border-neutral-400 transition-colors cursor-pointer shrink-0"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Article Stack Layout Grid */}
            <div className="space-y-4">
              {loadingSaved ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 w-full border border-neutral-200 animate-pulse bg-white rounded-xs" />
                  ))}
                </div>
              ) : savedArticles.length > 0 ? (
                <>
                  {savedArticles.map((item) => (
                    <div 
                      key={item.news_id} 
                      className="border border-neutral-200 p-5 bg-white transition-colors duration-300 hover:border-neutral-400 flex flex-col gap-2 relative group/item rounded-xs"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <a href={item.news.source?.url} target="_blank" rel="noopener noreferrer" className="manrope text-[12px] font-bold uppercase tracking-wide text-red-700 hover:underline">
                            {item.news.source?.name || "News Wire"}
                          </a>
                          <span className="text-neutral-200 text-[10px]">|</span>
                          <span className="manrope text-[12px] text-neutral-700 tracking-wider">
                            {item.news.publishedAt?.split("T")[0]}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-60 group-hover/item:opacity-100 transition-opacity">
                          <a 
                            href={item.news.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-1.5 text-neutral-700 hover:text-neutral-900 transition-colors"
                            title="Open Source"
                          >
                            <ExternalLink size={14} />
                          </a>
                          <button 
                            title='Remove Entry' 
                            onClick={() => openConfirm('newsDelete', () => handleUnsave(item.news_id))} 
                            className="p-1.5 text-neutral-700 hover:text-red-600 cursor-pointer transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h4 className="lora text-[18px] font-medium text-neutral-900 leading-snug tracking-tight line-clamp-2 pr-4">
                        <a href={item.news.url} target="_blank" rel="noreferrer" className="hover:text-neutral-700 transition-colors">
                          {item.news.title}
                        </a>
                      </h4>
                    </div>
                  ))}

                  {/* Stack List Pagination Control Strip */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
                    <button 
                      disabled={currentPage === 1} 
                      onClick={handlePrevious} 
                      className="manrope inline-flex items-center gap-1 font-bold text-[12px] uppercase tracking-wider text-neutral-700 disabled:opacity-20 hover:text-neutral-950 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>
                    <div className="manrope text-[12px] font-bold text-neutral-700 tracking-widest uppercase">Page {currentPage} / {totalPages}</div>
                    <button 
                      disabled={currentPage === totalPages} 
                      onClick={handleNext} 
                      className="manrope inline-flex items-center gap-1 font-bold text-[12px] uppercase tracking-wider text-neutral-700 disabled:opacity-20 hover:text-neutral-950 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="border border-dashed border-neutral-300 p-12 text-center rounded-xs bg-white max-w-xl mx-auto w-full">
                  <Bookmark size={28} className="mx-auto mb-3 text-neutral-300" />
                  <p className="manrope text-xs font-bold text-neutral-400 uppercase tracking-wider">Your saved archives are empty</p>
                  <Link to="/" className="manrope text-[11px] font-bold text-neutral-900 underline mt-1.5 inline-block hover:text-neutral-600">Discover Latest News</Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <ConfirmationDialog 
        isOpen={dialog.isOpen} 
        type={dialog.type} 
        onConfirm={dialog.onConfirm} 
        onCancel={() => setDialog(prev => ({ ...prev, isOpen: false }))} 
      />

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}

      <ProfileImageModal 
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        currentImage={profilePic}
        onUploadSuccess={handleAvatarUploadSuccess}
      />
    </div>
  );
};

export default Profile;