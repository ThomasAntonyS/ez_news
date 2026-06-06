import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowRight, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import Toast from '../components/Toast';
import logo from '../assets/icon.png';

const ForgotPassword = () => {
    document.title = "EZ NEWS | RESET PASSWORD";
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
        if (!email.trim()) return;
        setLoading(true);
        try {
            await axios.post(`${apiBase}/forgot-password`, { email });
            setStep(2);
            setToast({ 
                show: true, 
                message: 'Reset verification code dispatched to your email.', 
                type: 'success' 
            });
        } catch (err) {
            setToast({ 
                show: true, 
                message: err.response?.data?.message || 'Failed to dispatch verification code.', 
                type: 'error' 
            });
        } finally { 
            setLoading(false); 
        }
    };

    const handleVerifyCode = async () => {
        if (!code.trim()) return;
        setLoading(true);
        try {
            await axios.post(`${apiBase}/verify-reset-code`, { email, code });
            setStep(3);
        } catch (err) {
            setToast({ 
                show: true, 
                message: 'Invalid or expired reset token code.', 
                type: 'error' 
            });
        } finally { 
            setLoading(false); 
        }
    };

    const handleReset = async () => {
        if (password !== confirmPassword) {
            setToast({ show: true, message: 'Passwords do not match.', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${apiBase}/reset-password`, { email, code, password });
            setToast({ show: true, message: 'Password updated successfully. Redirecting...', type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setToast({ show: true, message: err.response?.data?.message || 'Failed to update credentials.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center p-4 text-neutral-900">
            <div className="w-full max-w-md border border-neutral-200 p-8 bg-white shadow-xl rounded-xs">
                
                <div className='flex justify-between items-center mb-8 border-b border-neutral-100 pb-4'>
                    <img 
                        src={logo} 
                        alt="EZ NEWS Logo"
                        title='Back to Home'
                        onClick={handleNavigateToHome} 
                        className="w-7 h-7 object-contain cursor-pointer transition-all"
                    />
                    <Link to="/login" className="manrope text-[11px] font-bold text-neutral-700 italic uppercase tracking-wide hover:text-neutral-900 transition-colors">
                        Cancel
                    </Link>
                </div>

                <h1 className="lora text-3xl font-medium text-neutral-900 tracking-tight mb-1.5">Reset Password</h1>
                <p className="lora text-neutral-500 text-sm mb-8 font-normal">
                    {step === 1 && "Enter your account email credentials to receive a security reset token."}
                    {step === 2 && "Provide the secure 6-digit credential token sent to your inbox."}
                    {step === 3 && "Establish a robust new password configuration for your portal."}
                </p>

                {step === 1 && (
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="manrope text-neutral-500 text-[11px] font-bold uppercase tracking-widest">Email Connection</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="manrope text-sm text-neutral-800 w-full px-4 py-2.5 rounded-xs border border-neutral-200 focus:border-neutral-800 focus:outline-none transition-colors placeholder:text-neutral-300" 
                                placeholder="name@example.com" 
                            />
                        </div>
                        <button 
                            onClick={handleSendCode} 
                            disabled={loading || !email} 
                            className={`manrope w-full text-xs font-bold bg-neutral-900 text-white py-3.5 border border-neutral-900 rounded-xs flex items-center justify-center gap-2 transition-colors duration-300 uppercase tracking-widest ${loading || !email ? "bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed" : "hover:bg-transparent hover:text-neutral-900 cursor-pointer"}`}
                        >
                            {loading ? <Loader2 className="animate-spin text-neutral-400" size={14} /> : <>Send Code <ArrowRight size={14} className="mt-0.5" /></>}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="manrope text-neutral-500 text-[11px] font-bold uppercase tracking-widest block text-left">6-Digit Code Token</label>
                            <input 
                                type="text" 
                                maxLength="6" 
                                value={code} 
                                onChange={(e) => setCode(e.target.value)} 
                                className="manrope text-neutral-800 w-full border border-neutral-200 p-2.5 text-center text-xl font-bold tracking-[0.4em] focus:border-neutral-800 focus:outline-none rounded-xs placeholder:text-neutral-200 placeholder:tracking-normal" 
                                placeholder="000000" 
                            />
                        </div>
                        <button 
                            onClick={handleVerifyCode} 
                            disabled={loading || code.length < 6} 
                            className={`manrope w-full text-xs font-bold bg-neutral-900 text-white py-3.5 border border-neutral-900 rounded-xs flex items-center justify-center gap-2 transition-colors duration-300 uppercase tracking-widest ${loading || code.length < 6 ? "bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed" : "hover:bg-transparent hover:text-neutral-900 cursor-pointer"}`}
                        >
                            {loading ? <Loader2 className="animate-spin text-neutral-400" size={14} /> : <>Verify Token <ShieldCheck size={14} className="mt-0.5" /></>}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="manrope text-neutral-500 text-[11px] font-bold uppercase tracking-widest">New Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="manrope text-sm text-neutral-800 w-full pl-4 pr-12 py-2.5 rounded-xs border border-neutral-200 focus:border-neutral-800 focus:outline-none transition-colors placeholder:text-neutral-200 tracking-wide" 
                                    placeholder="••••••••" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="manrope text-neutral-500 text-[11px] font-bold uppercase tracking-widest">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    type={showCnfPassword ? "text" : "password"} 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className="manrope text-sm text-neutral-800 w-full pl-4 pr-12 py-2.5 rounded-xs border border-neutral-200 focus:border-neutral-800 focus:outline-none transition-colors placeholder:text-neutral-200 tracking-wide" 
                                    placeholder="••••••••" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowCnfPassword(!showCnfPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                                >
                                    {showCnfPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={handleReset} 
                            disabled={loading || !password || !confirmPassword} 
                            className={`manrope w-full text-xs font-bold bg-neutral-900 text-white py-3.5 mt-2 border border-neutral-900 rounded-xs flex items-center justify-center gap-2 transition-colors duration-300 uppercase tracking-widest ${loading || !password || !confirmPassword ? "bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed" : "hover:bg-transparent hover:text-neutral-900 cursor-pointer"}`}
                        >
                            {loading ? <Loader2 className="animate-spin text-neutral-400" size={14} /> : <>Update Password <Lock size={14} className="mt-0.5" /></>}
                        </button>
                    </div>
                )}
            </div>
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
        </div>
    );
};

export default ForgotPassword;