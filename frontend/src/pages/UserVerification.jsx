import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/icon.png';

const UserVerification = () => {
    document.title = "EZ NEWS | VERIFY"
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Authenticating credentials...');

    useEffect(() => {
        const verifyAccount = async () => {
            const usp = searchParams.get('usp');
            const p = searchParams.get('p');

            if (!usp || !p) {
                setStatus('error');
                setMessage('Invalid verification link context.');
                return;
            }

            try {
                const apiBase = import.meta.env.VITE_API_BASE;
                const response = await axios.get(`${apiBase}/verify`, {
                    params: { usp, p }
                });

                if (response.status === 200) {
                    setStatus('success');
                    setMessage('Identity verified successfully. Access has been granted.');
                }
            } catch (error) {
                setStatus('error');
                const errorMsg = error.response?.data?.message || 'Verification link expired or invalid.';
                setMessage(errorMsg);
            }
        };

        verifyAccount();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 text-neutral-900">
            <div className="bg-white px-8 py-10 border border-neutral-200 w-full max-w-md text-center shadow-xl rounded-xs">
                
                <div className="flex justify-center mb-8 border-b border-neutral-100 pb-4">
                    <img src={logo} alt="EZ NEWS" className="w-8 h-8 object-contain" />
                </div>

                <div className="flex justify-center mb-5">
                    <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-full text-neutral-600">
                        {status === 'verifying' && <Loader2 size={24} className="animate-spin text-neutral-400" />}
                        {status === 'success' && <ShieldCheck size={24} className="text-emerald-600" />}
                        {status === 'error' && <ShieldAlert size={24} className="text-red-600" />}
                    </div>
                </div>

                <h1 className="lora text-3xl font-medium text-neutral-900 tracking-tight mb-2">
                    {status === 'verifying' ? 'Verifying...' : status === 'success' ? 'Verified' : 'Verification Failed'}
                </h1>
                
                <p className="lora text-neutral-500 text-sm mb-8 font-normal leading-relaxed max-w-xs mx-auto">
                    {message}
                </p>

                {status === 'success' && (
                    <button
                        onClick={() => navigate('/login')}
                        className="manrope w-full bg-neutral-900 text-white border border-neutral-900 text-xs font-bold py-3.5 uppercase tracking-widest cursor-pointer hover:bg-transparent hover:text-neutral-900 transition-colors duration-300 rounded-xs flex items-center justify-center gap-2 group"
                    >
                        Proceed to Login 
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200 mt-0.5" />
                    </button>
                )}

                {status === 'error' && (
                    <button
                        onClick={() => navigate('/signup')}
                        className="manrope w-full bg-transparent border border-neutral-200 text-neutral-800 text-xs font-bold py-3.5 uppercase tracking-widest cursor-pointer hover:bg-neutral-50 hover:border-neutral-400 transition-colors duration-300 rounded-xs flex items-center justify-center gap-2"
                    >
                        Return to Signup <ArrowRight size={14} className="mt-0.5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserVerification;