import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowRight, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import Toast from '../components/Toast';
import logo from '../assets/icon.png';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCnfPassword, setShowCnfPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    const navigate = useNavigate();
    const apiBase = import.meta.env.VITE_API_BASE;

    const handleSendCode = async () => {
        setLoading(true);
        try {
            await axios.post(`${apiBase}/forgot-password`, { email });
            setStep(2);
            setToast({ 
                show: true, message: 'Check your email for the code', 
                type: 'success' 
            });
        } catch (err) {
            setToast({ 
                show: true, 
                message: err.response?.data?.message 
                || 'Error', type: 'error' 
            });
        } finally { setLoading(false); }
    };

    const handleVerifyCode = async () => {
        setLoading(true);
        try {
            await axios.post(`${apiBase}/verify-reset-code`, { email, code });
            setStep(3);
        } catch (err) {
            setToast({ 
                show: true, 
                message: 'Invalid or expired code', type: 'error' 
            });
        } finally { setLoading(false); }
    };

    const handleReset = async () => {
        if (password !== confirmPassword) {
            setToast({ show: true, message: 'Passwords do not match', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${apiBase}/reset-password`, { 
                email, 
                code, 
                password 
            });
            setToast({ show: true, message: 'Success! Redirecting...', type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setToast({ show: true, message: err.response?.data?.message || 'Update failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToHome = () =>{
        navigate('/')
    }

    return (
        <div className=" min-h-screen w-full bg-white flex items-center justify-center p-6 text-black">
            <div className="w-full max-w-md border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className='flex justify-end -mr-1'>
                    <img 
                        src={logo} 
                        alt="Logo"
                        title='Back to Home'
                        onClick={handleNavigateToHome} 
                        className=" w-16 h-16 object-contain cursor-pointer"
                    />
                </div>

                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Reset</h2>
                <h3 className="text-xl font-bold uppercase mb-8 border-b-2 border-black pb-2">Password</h3>

                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">Enter your Email ID</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-2 border-black p-3 focus:outline-none focus:bg-gray-50 font-bold" placeholder="name@example.com" />
                        </div>
                        <button onClick={handleSendCode} disabled={loading} className="w-full bg-black text-white p-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-white hover:text-black border-2 border-black transition-all hover:cursor-pointer">
                            {loading ? <Loader2 className="animate-spin" /> : <>Send Code <ArrowRight size={20}/></>}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">6-Digit Code</label>
                            <input type="text" maxLength="6" value={code} onChange={(e) => setCode(e.target.value)} className="w-full border-2 border-black p-3 text-center text-2xl font-black tracking-widest focus:outline-none" placeholder="000000" />
                        </div>
                        <button onClick={handleVerifyCode} disabled={loading} className="w-full bg-black text-white p-4 font-black uppercase flex items-center justify-center gap-2 border-2 border-black hover:bg-white hover:cursor-pointer hover:text-black transition-all">
                            {loading ? <Loader2 className="animate-spin" /> : <>Verify Code <ShieldCheck size={20}/></>}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">New Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full border-2 border-black p-3 pr-12 focus:outline-none font-bold" 
                                    placeholder="••••••••" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-600 transition-colors  hover:cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-black uppercase mb-2">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    type={showCnfPassword ? "text" : "password"} 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className="w-full border-2 border-black p-3 focus:outline-none font-bold" 
                                    placeholder="••••••••" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowCnfPassword(!showCnfPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-600 transition-colors hover:cursor-pointer"
                                >
                                    {showCnfPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button onClick={handleReset} disabled={loading} className="w-full bg-black text-white p-4 font-black uppercase flex items-center justify-center gap-2 border-2 border-black hover:bg-white hover:text-black transition-all  hover:cursor-pointer">
                            {loading ? <Loader2 className="animate-spin" /> : <>Update Password <Lock size={20}/></>}
                        </button>
                    </div>
                )}
            </div>
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
        </div>
    );
};

export default ForgotPassword;