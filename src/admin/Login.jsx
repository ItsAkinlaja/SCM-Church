import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Lock, Mail, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-scm-blue/5 rounded-full blur-3xl -mr-64 -mt-64 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-scm-red/5 rounded-full blur-3xl -ml-64 -mb-64"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 transform transition-all hover:scale-[1.01]">
          {/* Header */}
          <div className="bg-scm-blue p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl group-hover:rotate-12 transition-all duration-500">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 underline decoration-scm-red/40 underline-offset-8">Admin Access</h1>
            <p className="text-white/60 text-sm font-bold tracking-widest uppercase">SCM Church Ministry Portal</p>
          </div>

          {/* Form */}
          <div className="p-10 lg:p-12">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-start space-x-3 text-red-600 animate-shake">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-black">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2 group">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-scm-blue transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                    placeholder="admin@scm.org.ng"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Access Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-scm-blue transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-scm-blue text-white rounded-2xl font-black text-lg hover:bg-blue-900 transition-all shadow-xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    Secure Login <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
               <Link to="/" className="text-gray-400 hover:text-scm-blue font-bold text-sm transition-colors flex items-center justify-center group">
                  <ArrowRight size={16} className="mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                  Back to Public Website
               </Link>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-10 text-center text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
          &copy; 2026 Student Christian Movement. Secure Portal.
        </p>
      </div>
    </div>
  );
};

export default Login;
