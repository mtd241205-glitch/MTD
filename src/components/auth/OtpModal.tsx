import React, { useState, useEffect, useRef } from 'react';
import { Shield, Clock, Mail, AlertCircle, RefreshCw, X } from 'lucide-react';

interface OtpModalProps {
  phone: string;
  email: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({ phone, email, onSuccess, onClose }) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes (02:00)
  const [sendMethod, setSendMethod] = useState<'phone' | 'email'>('phone');
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val.slice(-1);
    setDigits(newDigits);
    setErrorMessage('');

    // Auto-focus next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const code = digits.join('');
    if (code.length < 6) {
      setErrorMessage('Vui lòng nhập đủ 6 chữ số mã xác thực.');
      return;
    }

    // Demo code: accept '123456' or any 6 digits for testing ease
    if (code === '000000') {
      setErrorMessage('Mã xác thực không đúng. Vui lòng kiểm tra lại.');
      setAttempts((a) => a + 1);
      return;
    }

    onSuccess();
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    setTimeLeft(120);
    setDigits(['', '', '', '', '', '']);
    setErrorMessage('');
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          Hộp Thoại Xác Thực Mã OTP (Màn 11)
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Mã xác thực 6 số đã được gửi tới {sendMethod === 'phone' ? 'số điện thoại' : 'email'}:{' '}
          <strong className="text-slate-800">
            {sendMethod === 'phone' ? phone || '0988xxxxxx' : email || 'user@email.com'}
          </strong>
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 6 Digit Inputs */}
        <div className="flex justify-center gap-2.5 sm:gap-3 mb-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-10 sm:w-12 h-12 text-center text-xl font-bold rounded-xl border border-slate-300 focus:border-red-600 focus:ring-2 focus:ring-red-500/20 focus:outline-hidden font-mono"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Thời gian còn lại: </span>
          <span className="font-mono font-bold text-red-600">{formatTimer(timeLeft)}</span>
        </div>

        {/* Switch to Email / Resend Buttons */}
        <div className="flex items-center justify-between text-xs mb-6 px-2">
          <button
            type="button"
            onClick={() => setSendMethod(sendMethod === 'phone' ? 'email' : 'phone')}
            className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 hover:underline"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{sendMethod === 'phone' ? 'Gửi mã qua Email' : 'Gửi mã qua SĐT'}</span>
          </button>

          <button
            type="button"
            disabled={timeLeft > 0}
            onClick={handleResend}
            className="text-red-600 disabled:text-slate-300 font-bold hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Gửi lại mã</span>
          </button>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all"
        >
          Xác nhận mã OTP
        </button>
      </div>
    </div>
  );
};
