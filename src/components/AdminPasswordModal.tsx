import { useState, FormEvent, useEffect, useRef } from 'react';
import { Lock, KeyRound, ShieldAlert, X, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = '742000';

export default function AdminPasswordModal({ isOpen, onClose, onSuccess }: AdminPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      setIsShake(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password.trim() === ADMIN_PASSWORD) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setIsShake(true);
      setTimeout(() => setIsShake(false), 600);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className={`bg-white rounded-3xl border-4 border-slate-950 max-w-sm w-full p-6 sm:p-7 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transition-all ${
          isShake ? 'animate-shake' : 'animate-fade-in'
        }`}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-amber-100 border-2 border-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-amber-700">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black font-display text-slate-950 uppercase tracking-tight">
            Staff Access
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Enter the authorized staff passcode to open the Playgolf booking database.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 font-mono block">
              Staff Passcode
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={10}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter passcode..."
                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-center text-lg tracking-[0.3em] font-mono font-bold focus:outline-none transition-colors ${
                  error
                    ? 'border-rose-500 bg-rose-50/50 text-rose-950'
                    : 'border-slate-950 focus:border-emerald-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-[11px] font-bold text-rose-600 flex items-center justify-center gap-1 pt-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Incorrect passcode. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Unlock Admin Portal
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 text-center">
          <span className="text-[10px] text-slate-400 font-mono">
            Authorized Playgolf Northwick Park Personnel Only
          </span>
        </div>
      </div>
    </div>
  );
}
