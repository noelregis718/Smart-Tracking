import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Helper function to merge class names
const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
};

// Custom Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "default" | "outline";
    className?: string;
}

const Button = ({
    children,
    variant = "default",
    className = "",
    ...props
}: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variantStyles = {
        default: "bg-primary-shadcn bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Custom Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Input = ({ className = "", style = {}, ...props }: InputProps) => {
    return (
        <input
            style={{ paddingLeft: '0.70rem', paddingRight: '0.70rem', ...style }}
            className={`flex h-10 w-full rounded-md border bg-background py-2 text-sm text-gray-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
};



export const Auth = () => {
    const { login, loginWithEmail, registerWithEmail } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await loginWithEmail(formData.email, formData.password);
            } else {
                result = await registerWithEmail(formData.email, formData.password, formData.name);
            }

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Authentication failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white shadow-xl"
            >
                {/* Left side - Map */}
                <div className="hidden md:block w-1/2 h-[650px] relative overflow-hidden border-r border-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                            <div className="relative top-[-70px] flex flex-col items-center">
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="mb-8"
                                >
                                    <img src="/2-removebg-preview.png" alt="Logo" className="h-28 w-28 object-contain" />
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className="text-4xl font-bold mb-8 text-center"
                                >
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent py-4 leading-relaxed block overflow-visible">
                                        Expensify
                                    </span>
                                </motion.h2>
                                <div className="h-3" />
                                <motion.p
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className="text-base text-center text-gray-600 max-w-xs"
                                >
                                    Sign in to access your global expense dashboard and manage your wealth smarter
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Sign In Form */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-start pt-8 bg-white" style={{ paddingLeft: '8mm' }}>
                    <div className="h-6 md:h-8" />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-sm mx-auto pl-[57px] pr-[10px] text-left"
                    >
                        <h1 className="text-2xl md:text-3xl font-bold mb-0 text-gray-800 text-left whitespace-nowrap">
                            {isLogin ? 'Welcome back' : 'Get started'}
                        </h1>
                        <div className="h-2" />
                        <p className="text-gray-500 mb-0 text-left">
                            {isLogin ? 'Sign in to your account' : 'Create your free account now'}
                        </p>
                        <div className="h-4" />

                        <div className="mb-0">
                            <button
                                type="button"
                                className="w-full h-10 flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-md px-8 hover:bg-gray-50 transition-all duration-300 text-gray-800 font-bold shadow-md text-lg"
                                onClick={() => {
                                    // Trigger Google Login - we'll use a hidden GoogleLogin for simplicity 
                                    const googleButton = document.querySelector('[role="button"]') as HTMLElement;
                                    if (googleButton) googleButton.click();
                                }}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fillOpacity=".54"
                                    />
                                    <path
                                        fill="#4285F4"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                    <path fill="#EA4335" d="M1 1h22v22H1z" fillOpacity="0" />
                                </svg>
                                <span className="text-sm font-medium">Login with Google</span>

                            </button>
                        </div>

                        <div style={{ display: 'none' }}>
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    if (credentialResponse.credential) {
                                        login(credentialResponse.credential);
                                    }
                                }}
                                onError={() => {
                                    setError('Google login failed');
                                }}
                            />
                        </div>

                        <div className="h-4" />
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm py-2">
                                <span className="px-2 bg-white text-gray-500">or</span>
                            </div>
                        </div>

                        <div className="h-4" />

                        <form className="space-y-0" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
                                    {error}
                                </div>
                            )}
                            {/* message state was not provided in the original code, assuming it's removed or handled elsewhere */}

                            {!isLogin && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-0">
                                        Full Name <span className="text-blue-500">*</span>
                                    </label>
                                    <div className="h-2" />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your full name"
                                        required={!isLogin}
                                        className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {!isLogin && <div className="h-6" />}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-0">
                                    Email <span className="text-blue-500">*</span>
                                </label>
                                <div className="h-2" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter your email address"
                                    required
                                    className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="h-4" />

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-0">
                                    Password <span className="text-blue-500">*</span>
                                </label>
                                <div className="h-2" />
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={isPasswordVisible ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter your password"
                                        required
                                        style={{ paddingRight: '3.5rem', paddingLeft: '0.70rem' }}
                                        className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="h-4" />

                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onHoverStart={() => setIsHovered(true)}
                                onHoverEnd={() => setIsHovered(false)}
                                className=""
                            >
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className={cn(
                                        "w-full h-10 bg-gradient-to-r relative overflow-hidden from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-bold rounded-md transition-all duration-300",
                                        isHovered ? "shadow-xl shadow-blue-200" : "",
                                        loading ? "opacity-70 cursor-not-allowed" : ""
                                    )}
                                >
                                    <span className="flex items-center justify-center font-semibold">
                                        {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
                                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                                    </span>
                                    {isHovered && !loading && (
                                        <motion.span
                                            initial={{ left: "-100%" }}
                                            animate={{ left: "100%" }}
                                            transition={{ duration: 1, ease: "easeInOut" }}
                                            className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                            style={{ filter: "blur(8px)" }}
                                        />
                                    )}
                                </Button>
                            </motion.div>

                            <div className="h-4" />

                            <div className="h-4" />

                            <div className="text-center mt-6 space-y-3">
                                <p className="text-gray-500 text-sm">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLogin(!isLogin);
                                            setError('');
                                        }}
                                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                    >
                                        {isLogin ? 'Sign up' : 'Sign in'}
                                    </button>
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};
