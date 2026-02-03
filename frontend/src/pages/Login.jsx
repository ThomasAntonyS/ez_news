import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios  from 'axios'
import Toast from '../components/Toast';
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'
import { useAuth } from "../context/AuthContext";
import logo from '../assets/icon.png';

const Login = () => {
    document.title = "EZ NEWS | LOG IN"
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { setIsLoggedIn, fetchSavedIds } = useAuth();

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const apiBase = import.meta.env.VITE_API_BASE;
            
            const response = await axios.post(`${apiBase}/login`, formData, {
                withCredentials: true 
            });

            setIsLoggedIn(true)
            setToast({ 
                show: true, 
                message: response.data.message.toUpperCase() || 'IDENTITY VERIFIED.', 
                type: 'success' 
            });
            
            setTimeout(() => {
                navigate("/");
            }, 5000);
        } 
        catch (error) {
            const errorMsg = error.response?.data?.message || 'ACCESS DENIED.';
            setToast({ 
                show: true, 
                message: errorMsg.toUpperCase(), 
                type: 'error' 
            });
        } 
        finally {
            fetchSavedIds()
            setIsSubmitting(false);
        }
    };

    const handleNavigateToHome = () =>{
        navigate("/")
    }

    return (
        <div className="relative min-h-screen bg-white flex items-center justify-center p-4">            
            <div className="bg-white px-8 py-10 rounded-none border-3 border-black w-full max-w-[420px] h-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className='flex justify-end -mr-1'>
                    <img 
                        src={logo} 
                        alt="Logo"
                        title='Back to Home'
                        onClick={handleNavigateToHome} 
                        className=" w-16 h-16 object-contain cursor-pointer"
                    />
                </div>

                <h1 className="text-[2.5rem] font-bold text-black leading-tight tracking-tight">Log in</h1>
                <p className="text-black text-lg mb-8 opacity-70">to view saved articles</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-black text-xs font-black uppercase tracking-wide">Email address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-none border-2 border-black focus:outline-none focus:bg-gray-50 transition-all"
                            placeholder="name@example.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-black text-xs font-black uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full pl-4 pr-12 py-3 rounded-none border-2 border-black focus:outline-none focus:bg-gray-50 transition-all"
                                placeholder="••••••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={20} color='black'/> : <Eye size={20} color='black'/>}
                            </button>
                        </div>
                    </div>

                    <Link to={"/reset-password"} className="text-black text-xs font-bold hover:underline block cursor-pointer">
                        Forgot password?
                    </Link>

                    <button
                        type="submit"
                        className={`w-full text-md bg-black text-white font-bold cursor-pointer py-4 rounded-none flex items-center justify-center gap-2 ${isSubmitting?"bg-white text-black":"hover:bg-white hover:text-black"} border-2 border-black transition-all uppercase tracking-widest`}
                    >
                        {isSubmitting?
                            <>
                                <Ring2
                                  size="25"
                                  stroke="5"
                                  strokeLength="0.25"
                                  bgOpacity="0.1"
                                  speed="0.6"
                                  color="black" 
                                />
                                <p className='text-black'>Processing...</p>
                            </>
                            :
                            <>Log in <ArrowRight size={20} /></>
                        }
                    </button>
                </form>

                <p className="text-center mt-8 text-black text-sm">
                    Don't have an account? <Link to="/signup" className="font-black border-b-2 border-black ml-1 uppercase tracking-tighter">Sign up now</Link>
                </p>
            </div>

            {toast.show && (
              <Toast
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, show: false })} 
              />
            )}
        </div>
    );
};

export default Login;