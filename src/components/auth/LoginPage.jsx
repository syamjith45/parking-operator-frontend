import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Logo } from '../ui/Logo'
import { useAuth } from '../../context/AuthContext'

export const LoginPage = () => {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (e) {
            console.error("Login error", e);
            setError(e.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-900/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-colors duration-300">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="scale-125 mb-4">
                            <Logo />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300 mt-4">Staff Access Portal</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-brand-blue/50 transition-colors duration-300"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-brand-blue/50 transition-colors duration-300"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex items-center gap-2 text-rose-600 dark:text-rose-500 text-sm bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30"
                            >
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-brand-blue hover:bg-cyan-600 text-white shadow-lg shadow-brand-blue/20 h-11"
                            isLoading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400 dark:text-slate-600 transition-colors duration-300">
                            Protected System • Authorized Personnel Only
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
