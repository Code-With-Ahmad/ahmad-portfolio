import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { loginWithPassword } from '@/firebase/adminAuth';
import { notify } from '@/lib/toast';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithPassword(password);
    } catch (err) {
      notify.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink">Admin Access</h1>
        <p className="mt-2 text-[15px] text-ink-muted">Enter the password to manage site content.</p>

        <div className="mt-8 flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">
            Password
          </label>
          <div className="flex items-center gap-2 border-b border-border focus-within:border-accent">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent py-2 text-[15px] text-ink outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="text-ink-muted transition-colors hover:text-ink"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-accent px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] text-accent-ink transition-opacity disabled:opacity-60"
        >
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
