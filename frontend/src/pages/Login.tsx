import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        if (user.role === 'admin') {
          navigate('/');
        } else {
          const redirectUrl = location.state?.from || '/';
          navigate(redirectUrl);
        }
      } catch (e) {
        // Handle invalid JSON
      }
    }
  }, [navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, name, phone })
        });
        
        let data;
        try {
          const text = await response.text();
          if (text.includes("Cookie check") || text.includes("Action required to load your app")) {
            throw new Error("Browser is blocking cookies in this preview. Please click 'Open App' (top right arrow icon) to use auth.");
          }
          try {
            data = JSON.parse(text);
          } catch(e) {
            data = { error: `Invalid response: ${text.substring(0, 40)}` };
          }
        } catch(e: any) {
           data = { error: e.message || 'Failed to read response body' };
        }
        
        if (!response.ok) {
          setError(data.error || 'Registration failed');
        } else {
          setMessage('Sign up successful! You can now sign in.');
          setIsSignUp(false);
        }
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        let data;
        try {
          const text = await response.text();
          if (text.includes("Cookie check") || text.includes("Action required to load your app")) {
            throw new Error("Browser is blocking cookies in this preview. Please click 'Open App' (top right arrow icon) to use auth.");
          }
          try {
            data = JSON.parse(text);
          } catch(e) {
            data = { error: `Invalid response: ${text.substring(0, 40)}` };
          }
        } catch(e: any) {
           data = { error: e.message || 'Failed to read response body' };
        }
        
        if (!response.ok) {
          setError(data.error || 'Login failed');
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          if (data.user.role === 'admin') {
            navigate('/');
          } else {
            const redirectUrl = location.state?.from || '/';
            navigate(redirectUrl);
          }
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2670&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm z-0"></div>
      <div className="w-full max-w-md bg-brand-black/60 p-10 shadow-2xl backdrop-blur-md rounded-sm border border-brand-white/10 z-10 text-brand-white">
        <div className="flex justify-center items-center gap-4 mb-8">
          <img src="/logo.svg" alt="AMR - FRAGRANCES" className="h-10 md:h-12 w-auto object-contain brightness-0 invert opacity-90" />
        </div>
        <div className="text-center mb-8">
            <span className="block text-2xl font-serif tracking-widest text-brand-white">AMR - FRAGRANCES</span>
        </div>
        <h2 className="text-center font-serif text-xl mb-6 tracking-wide">{isSignUp ? 'Create an Account' : 'Sign In'}</h2>
        
        {error && (
            <div className="bg-red-500/10 text-red-500 p-3 mb-6 border border-red-500/20 text-sm">{error}</div>
        )}
        {message && (
            <div className="bg-green-500/10 text-green-400 p-3 mb-6 border border-green-500/20 text-sm">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-brand-white/30 pb-2 px-2 focus:outline-none focus:border-brand-white/20 transition-colors rounded-none bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-b border-brand-white/30 pb-2 px-2 focus:outline-none focus:border-brand-white/20 transition-colors rounded-none bg-transparent"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-brand-white/30 pb-2 px-2 focus:outline-none focus:border-brand-white/20 transition-colors rounded-none bg-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-brand-white/30 pb-2 px-2 focus:outline-none focus:border-brand-white/20 transition-colors rounded-none bg-transparent"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-brand-black text-brand-white py-4 text-xs uppercase tracking-[0.15em] hover:bg-zinc-800 transition-colors mt-4"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-brand-white/70">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => setIsSignUp(false)} className="underline hover:text-brand-white transition-colors">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsSignUp(true)} className="underline hover:text-brand-white transition-colors">
                Create one
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
