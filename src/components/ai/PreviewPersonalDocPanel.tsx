import React from 'react';
import { PersonalDoc } from '../../types';
import { X, Bot, FileText, Calendar, Tag, ShieldCheck } from 'lucide-react';

interface PreviewPersonalDocPanelProps {
  doc: PersonalDoc;
  onClose: () => void;
  onAskAboutDoc: (doc: PersonalDoc) => void;
}

export const PreviewPersonalDocPanel: React.FC<PreviewPersonalDocPanelProps> = ({
  doc,
  onClose,
  onAskAboutDoc,
}) => {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200 text-left">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 truncate">{doc.name}</h3>
            <span className="text-[10px] text-slate-400 font-mono">Mã ẩn danh: {doc.anonCode}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Meta Info */}
      <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Kích thước: {doc.size}</span>
        <span>Ngày tải lên: {doc.uploadDate}</span>
      </div>

      {/* Tags */}
      {doc.tags.length > 0 && (
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 flex-wrap">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          {doc.tags.map((t, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Content Frame */}
      <div className="flex-1 overflow-y-auto p-6 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-line bg-white">
        {doc.content}
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-white transition-colors"
        >
          Đóng
        </button>
        <button
          onClick={() => onAskAboutDoc(doc)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
        >
          <Bot className="w-4 h-4" />
          <span>Hỏi về tài liệu này</span>
        </button>
      </div>
    </div>
  );
};
