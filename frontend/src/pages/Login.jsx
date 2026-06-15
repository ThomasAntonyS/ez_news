import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
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
    const { setIsLoggedIn } = useAuth();

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
                message: response.data.message || 'Identity verified.', 
                type: 'success' 
            });
            
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } 
        catch (error) {
            const errorMsg = error.response?.data?.message || 'Access denied.';
            setToast({ 
                show: true, 
                message: errorMsg, 
                type: 'error' 
            });
        } 
        finally {
            setIsSubmitting(false);
        }
    };

    const handleNavigateToHome = () => {
        navigate("/")
    }

    return (
        <div className="relative min-h-screen bg-neutral-50 flex items-center justify-center p-4">            
            <div className="bg-white px-8 py-10 border border-neutral-200 w-full max-w-md h-auto shadow-xl rounded-xs">
                
                <div className='flex justify-between items-center mb-8 border-b border-neutral-100 pb-4'>
                    <img 
                        src={logo} 
                        alt="Logo"
                        title='Back to Home'
                        onClick={handleNavigateToHome} 
                        className="w-7 h-7 object-contain cursor-pointer transition-all"
                    />
                    <Link to="/" className="manrope text-[11px] font-bold text-neutral-700 uppercase tracking-wide hover:text-neutral-900 transition-colors italic">
                        Home
                    </Link>
                </div>

                <h1 className="lora text-3xl font-medium text-neutral-900 tracking-tight mb-1.5">Log in</h1>
                <p className="lora text-neutral-500 text-sm mb-8 font-normal">to view saved articles</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="manrope text-neutral-500 text-[11px] font-bold uppercase tracking-widest">Email address</label>
                        <input
                            type="email"
                            required
                            className="manrope text-sm text-neutral-800 w-full px-4 py-2.5 rounded-xs border border-neutral-200 focus:border-neutral-800 focus:outline-none transition-colors placeholder:text-neutral-300"
                            placeholder="name@example.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="manrope text-neutral-500 text-[11px] font-bold uppercase tracking-widest">Password</label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="manrope text-sm text-neutral-800 w-full pl-4 pr-12 py-2.5 rounded-xs border border-neutral-200 focus:border-neutral-800 focus:outline-none transition-colors placeholder:text-neutral-200 tracking-wide"
                                placeholder="••••••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                            </button>
                        </div>

                        <Link to={"/reset-password"} className="manrope text-neutral-500 text-[11px] font-bold tracking-wider hover:text-neutral-900 hover:underline transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`manrope w-full text-xs font-bold bg-neutral-900 text-white py-3.5 mt-2 border border-neutral-900 rounded-xs flex items-center justify-center gap-2 transition-colors duration-300 uppercase tracking-widest ${isSubmitting ? "bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed" : "hover:bg-transparent hover:text-neutral-900 cursor-pointer"}`}
                    >
                        {isSubmitting ? (
                            <>
                                <Ring2
                                    size="14"
                                    stroke="1.5"
                                    strokeLength="0.25"
                                    bgOpacity="0.1"
                                    speed="0.8"
                                    color="#737373" 
                                />
                                <span className="normal-case text-neutral-500 font-medium tracking-normal ml-0.5">Verifying credentials...</span>
                            </>
                        ) : (
                            <>Log in <ArrowRight size={14} className="mt-0.5" /></>
                        )}
                    </button>
                </form>

                <p className="manrope text-center mt-8 text-neutral-500 text-[14px] tracking-tight">
                    Don't have an account? <Link to="/signup" className="font-bold text-neutral-900 hover:text-neutral-600 transition-colors underline underline-offset-4 ml-1">Sign up now</Link>
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