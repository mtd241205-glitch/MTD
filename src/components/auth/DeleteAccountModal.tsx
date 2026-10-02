import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteAccountModalProps {
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose }) => {
  const { deleteCurrentAccount } = useApp();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Vui lòng nhập mật khẩu xác nhận.');
      return;
    }
    const success = deleteCurrentAccount(password);
    if (!success) {
      setErrorMsg('Mật khẩu không chính xác.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-200 text-center relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-rose-50">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Xóa Tài Khoản Vĩnh Viễn (Màn 19)
        </h3>

        <p className="text-xs text-rose-700 font-semibold mb-4 leading-relaxed">
          Cảnh báo: Hành động này không thể hoàn tác! Toàn bộ lịch sử hỏi đáp, văn bản và thông tin tài khoản của bạn sẽ bị hủy bỏ hoàn toàn khỏi hệ thống xã.
        </p>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleDelete} className="space-y-4 text-left text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nhập lại mật khẩu để xác nhận *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa tài khoản</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
