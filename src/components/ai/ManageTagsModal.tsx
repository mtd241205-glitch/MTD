import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tag, Plus, X, Trash2, Check } from 'lucide-react';

interface ManageTagsModalProps {
  selectedDocIds: string[];
  onClose: () => void;
}

export const ManageTagsModal: React.FC<ManageTagsModalProps> = ({
  selectedDocIds,
  onClose,
}) => {
  const { tags, addTag, deleteTag, updatePersonalDocTags, personalDocs } = useApp();

  const [newTagName, setNewTagName] = useState('');
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    addTag(newTagName.trim(), 'bg-slate-100 text-slate-800 border-slate-300');
    setNewTagName('');
  };

  const toggleTagSelection = (name: string) => {
    setSelectedTagNames((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const handleApplyTags = () => {
    selectedDocIds.forEach((docId) => {
      const doc = personalDocs.find((d) => d.id === docId);
      if (doc) {
        const merged = Array.from(new Set([...doc.tags, ...selectedTagNames]));
        updatePersonalDocTags(docId, merged);
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Quản Lý Nhãn Tài Liệu (Màn 29)
            </h3>
            <p className="text-xs text-slate-500">Phân loại và gắn tag cho các tài liệu cá nhân</p>
          </div>
        </div>

        {/* Existing Tags */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Danh sách nhãn hiện có ({tags.length})
          </label>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
            {tags.map((tag) => {
              const isSelected = selectedTagNames.includes(tag.name);
              return (
                <div
                  key={tag.id}
                  onClick={() => toggleTagSelection(tag.name)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>#{tag.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTag(tag.id);
                    }}
                    className={`hover:opacity-75 ${isSelected ? 'text-indigo-200' : 'text-slate-400 hover:text-rose-600'}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create new tag */}
        <form onSubmit={handleCreateTag} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tên nhãn mới (ví dụ: Địa chính, Nghị quyết)..."
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo nhãn</span>
          </button>
        </form>

        {/* Notice for applying to selected docs */}
        {selectedDocIds.length > 0 && (
          <p className="text-xs text-indigo-700 font-semibold mb-4 bg-indigo-50 p-2.5 rounded-xl">
            Sẽ gắn {selectedTagNames.length} nhãn đã chọn cho {selectedDocIds.length} tệp tài liệu đang chọn.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleApplyTags}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
          >
            Lưu nhãn
          </button>
        </div>
      </div>
    </div>
  );
};
