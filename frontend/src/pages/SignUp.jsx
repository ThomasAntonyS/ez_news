import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios  from 'axios'
import Toast from '../components/Toast';
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'
import logo from '../assets/icon.png';

const SignUp = () => {
    document.title = "EZ NEWS | SIGN UP"
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setToast({ 
                show: true, 
                message: "PASSWORDS DO NOT MATCH.", 
                type: 'error' 
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const apiBase = import.meta.env.VITE_API_BASE;
            const response = await axios.post(`${apiBase}/signup`, formData);
            setToast({ 
                show: true, 
                message: response.data.message || 'DISPATCHED. CHECK EMAIL.', 
                type: 'success' 
            });

            setTimeout(() => {
                navigate("/login");
            }, 5000);
        } 
        catch (error) {
            const errorMsg = error.response?.data?.message || 'SYSTEM ERROR. TRY AGAIN.';
            setToast({ 
                show: true, 
                message: errorMsg.toUpperCase(), 
                type: 'error' 
            });
        } 
        finally {
            setIsSubmitting(false);
        }
    };

    const handleNavigateToHome = () =>{
        navigate("/")
    }

    return (
        <div className="relative min-h-screen bg-white flex items-center justify-center p-4">
            <div className=" bg-white px-8 py-8 rounded-none border-3 border-black w-full max-w-[440px] h-auto">
                <div className='flex justify-end -mr-1'>
                    <img 
                        src={logo} 
                        alt="Logo" 
                        onClick={handleNavigateToHome}
                        className=" w-16 h-16 object-contain cursor-pointer"
                    />
                </div>
                
                <h1 className="text-[2.25rem] font-bold text-black leading-tight uppercase tracking-tighter">Sign up</h1>
                <p className="text-black text-base mb-6 font-medium opacity-70">to build your personal news library</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-black text-[10px] font-black uppercase tracking-wide">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2.5 rounded-none border-2 border-black focus:outline-none"
                            placeholder="John Doe"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-black text-[10px] font-black uppercase tracking-wide">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2.5 rounded-none border-2 border-black focus:outline-none"
                            placeholder="name@example.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-black text-[10px] font-black uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                required
                                className="w-full pl-4 pr-12 py-2.5 rounded-none border-2 border-black focus:outline-none"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                                {showPass ? <EyeOff size={18} color='black'  /> : <Eye size={18} color='black' />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-black text-[10px] font-black uppercase tracking-wide">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                required
                                className="w-full pl-4 pr-12 py-2.5 rounded-none border-2 border-black focus:outline-none"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                                {showConfirmPass ? <EyeOff size={18} color='black' /> : <Eye size={18} color='black' />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-black text-white font-bold py-3.5 cursor-pointer rounded-none flex items-center justify-center gap-2 ${isSubmitting?"bg-white text-black":"hover:bg-white hover:text-black"} border-2 border-black transition-all text-md mt-2 uppercase tracking-widest`}
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
                        <>Create account <ArrowRight size={20} /></>
                    }
                    </button>
                </form>

                <p className="text-center mt-6 text-black text-sm font-medium">
                    Already have an account? <Link to="/login" className="font-black border-b-2 border-black ml-1 uppercase">Log in</Link>
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

export default SignUp;