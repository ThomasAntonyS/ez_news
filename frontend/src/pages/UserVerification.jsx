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
    const [message, setMessage] = useState('AUTHENTICATING CREDENTIALS...');

    useEffect(() => {
        const verifyAccount = async () => {
            const usp = searchParams.get('usp');
            const p = searchParams.get('p');

            if (!usp || !p) {
                setStatus('error');
                setMessage('INVALID VERIFICATION LINK.');
                return;
            }

            try {
                const apiBase = import.meta.env.VITE_API_BASE;
                const response = await axios.get(`${apiBase}/verify`, {
                    params: { usp, p }
                });

                if (response.status === 200) {
                    setStatus('success');
                    setMessage('IDENTITY VERIFIED. ACCESS GRANTED.');
                }
            } catch (error) {
                setStatus('error');
                const errorMsg = error.response?.data?.message || 'LINK EXPIRED OR INVALID.';
                setMessage(errorMsg.toUpperCase());
            }
        };

        verifyAccount();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="bg-white p-10 border-3 border-black w-full max-w-[500px] text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="EZ NEWS" className="w-16 h-16 object-contain" />
                </div>

                <div className="flex justify-center mb-6">
                    <div>
                        {status === 'verifying' && <Loader2 size={48} color="black" className="animate-spin" />}
                        {status === 'success' && <ShieldCheck size={48} color="black" />}
                        {status === 'error' && <ShieldAlert size={48} color="black" />}
                    </div>
                </div>

                <h1 className="text-[2.25rem] font-bold text-black leading-tight uppercase tracking-tighter mb-2">
                    {status === 'verifying' ? 'Verifying...' : status === 'success' ? 'Verified' : 'Failed'}
                </h1>
                
                <div className={`${status=='success'?"bg-green-600":"bg-red-600"} text-white py-2 px-4 inline-block font-black uppercase tracking-widest text-[10px] mb-6`}>
                    {message}
                </div>

                {status === 'success' && (
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full mt-4 bg-white text-black border-3 border-black font-black py-4 flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all uppercase tracking-widest cursor-pointer group"
                    >
                        Proceed to Login 
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                )}

                {status === 'error' && (
                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full mt-4 bg-black text-white border-3 border-black font-black py-4 flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all uppercase tracking-widest cursor-pointer"
                    >
                        Return to Signup <ArrowRight size={20}/>
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserVerification;