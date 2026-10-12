import React, { useState, useRef } from 'react';
import { Camera, Upload, Link as LinkIcon, Sparkles, Trash2, Check, X, Image as ImageIcon } from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';
import { playBellSound } from '../utils/audioNotification';

interface AvatarUploadModalProps {
  isOpen: boolean;
  currentAvatarUrl?: string;
  studentName: string;
  onClose: () => void;
  onSave: (newAvatarUrl: string | undefined) => void;
}

// 6 Futuristic preset avatars with SVG Data URIs
const PRESET_AVATARS = [
  {
    id: 'cyber-dev',
    title: 'Kiber Dasturchi',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <rect width="140" height="140" rx="36" fill="#040b1e"/>
        <circle cx="70" cy="70" r="54" fill="#0a193d" stroke="#00f2fe" stroke-width="4"/>
        <circle cx="70" cy="54" r="26" fill="#00f2fe" opacity="0.25"/>
        <text x="70" y="64" font-size="34" text-anchor="middle" dominant-baseline="central">⚡</text>
        <rect x="30" y="92" width="80" height="22" rx="11" fill="#00f2fe" opacity="0.9"/>
        <text x="70" y="105" font-family="monospace" font-size="10" font-weight="900" fill="#040b1e" text-anchor="middle" dominant-baseline="central">DEV·AI</text>
      </svg>
    `),
  },
  {
    id: 'ai-robot',
    title: 'AI Muhandis',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <rect width="140" height="140" rx="36" fill="#07041a"/>
        <circle cx="70" cy="70" r="54" fill="#1b0e3d" stroke="#a855f7" stroke-width="4"/>
        <circle cx="70" cy="54" r="26" fill="#a855f7" opacity="0.25"/>
        <text x="70" y="64" font-size="34" text-anchor="middle" dominant-baseline="central">🤖</text>
        <rect x="30" y="92" width="80" height="22" rx="11" fill="#a855f7" opacity="0.9"/>
        <text x="70" y="105" font-family="monospace" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="central">ROBOT·OS</text>
      </svg>
    `),
  },
  {
    id: 'cyber-girl',
    title: 'Kiber Qiz',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <rect width="140" height="140" rx="36" fill="#1a0414"/>
        <circle cx="70" cy="70" r="54" fill="#38092a" stroke="#ec4899" stroke-width="4"/>
        <circle cx="70" cy="54" r="26" fill="#ec4899" opacity="0.25"/>
        <text x="70" y="64" font-size="34" text-anchor="middle" dominant-baseline="central">✨</text>
        <rect x="30" y="92" width="80" height="22" rx="11" fill="#ec4899" opacity="0.9"/>
        <text x="70" y="105" font-family="monospace" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="central">CYBER·GIRL</text>
      </svg>
    `),
  },
  {
    id: 'cyber-coder',
    title: 'Python Kodlovchi',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <rect width="140" height="140" rx="36" fill="#03140e"/>
        <circle cx="70" cy="70" r="54" fill="#082b1f" stroke="#10b981" stroke-width="4"/>
        <circle cx="70" cy="54" r="26" fill="#10b981" opacity="0.25"/>
        <text x="70" y="64" font-size="34" text-anchor="middle" dominant-baseline="central">💻</text>
        <rect x="30" y="92" width="80" height="22" rx="11" fill="#10b981" opacity="0.9"/>
        <text x="70" y="105" font-family="monospace" font-size="10" font-weight="900" fill="#03140e" text-anchor="middle" dominant-baseline="central">PYTHON·AI</text>
      </svg>
    `),
  },
  {
    id: 'scholar-star',
    title: "A'lochi Talaba",
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <rect width="140" height="140" rx="36" fill="#191003"/>
        <circle cx="70" cy="70" r="54" fill="#362208" stroke="#f59e0b" stroke-width="4"/>
        <circle cx="70" cy="54" r="26" fill="#f59e0b" opacity="0.25"/>
        <text x="70" y="64" font-size="34" text-anchor="middle" dominant-baseline="central">🎓</text>
        <rect x="30" y="92" width="80" height="22" rx="11" fill="#f59e0b" opacity="0.9"/>
        <text x="70" y="105" font-family="monospace" font-size="10" font-weight="900" fill="#191003" text-anchor="middle" dominant-baseline="central">MAKTAB-45</text>
      </svg>
    `),
  },
  {
    id: 'quantum-mind',
    title: 'Kvant Miya',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140">
        <rect width="140" height="140" rx="36" fill="#031720"/>
        <circle cx="70" cy="70" r="54" fill="#062e3e" stroke="#06b6d4" stroke-width="4"/>
        <circle cx="70" cy="54" r="26" fill="#06b6d4" opacity="0.25"/>
        <text x="70" y="64" font-size="34" text-anchor="middle" dominant-baseline="central">🧠</text>
        <rect x="30" y="92" width="80" height="22" rx="11" fill="#06b6d4" opacity="0.9"/>
        <text x="70" y="105" font-family="monospace" font-size="10" font-weight="900" fill="#031720" text-anchor="middle" dominant-baseline="central">NEURAL·OS</text>
      </svg>
    `),
  },
];

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  currentAvatarUrl,
  studentName,
  onClose,
  onSave,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(currentAvatarUrl);
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg("Iltimos, faqat rasm faylini tanlang (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);
      const compressedDataUrl = await compressImageFile(file, 256, 0.85);
      setSelectedAvatar(compressedDataUrl);
    } catch {
      setErrorMsg("Rasmni yuklashda xatolik yuz berdi. Boshqa rasm tanlab ko'ring.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setSelectedAvatar(urlInput.trim());
    setErrorMsg(null);
  };

  const handleSave = () => {
    playBellSound('success');
    onSave(selectedAvatar);
    onClose();
  };

  const handleRemoveAvatar = () => {
    setSelectedAvatar(undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md cyber-glass rounded-2xl border-2 border-cyan-500/50 p-5 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-left overflow-hidden">
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-orbitron font-bold text-white">
                Profil Rasmini O'rnatish
              </h3>
              <p className="text-[11px] text-slate-400 font-mono-code">
                {studentName} uchun shaxsiy rasm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex items-center justify-center flex-col gap-2.5 my-3 py-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-cyan-400 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] overflow-hidden flex items-center justify-center">
              {selectedAvatar ? (
                <img
                  src={selectedAvatar}
                  alt={studentName}
                  className="w-full h-full object-cover rounded-[14px]"
                  onError={() => setErrorMsg("Rasm havolasi noto'g'ri yoki yuklanmadi.")}
                />
              ) : (
                <div className="w-full h-full bg-cyan-950 rounded-[14px] flex items-center justify-center text-cyan-300 font-orbitron font-extrabold text-3xl">
                  {studentName.charAt(0)}
                </div>
              )}
            </div>
            {selectedAvatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-colors cursor-pointer"
                title="Rasmni o'chirish"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="text-[11px] text-slate-400 font-mono-code">
            {selectedAvatar ? "✅ Yangi rasm tanlandi" : "Bosh harf ko'rinishi (Standart)"}
          </div>
        </div>

        {/* Tabs: Upload / Presets / URL */}
        <div className="grid grid-cols-3 gap-1.5 mb-3 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Fayl tanlash</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kiber AI</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>URL Havola</span>
          </button>
        </div>

        {/* Tab 1: Device File Upload */}
        {activeTab === 'upload' && (
          <div className="mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-xl p-4 text-center bg-cyan-950/20 hover:bg-cyan-950/40 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">
                Kompyuter yoki Telefongizdan Rasm Tanlang
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                JPG, PNG, WebP formatlari. Rasm avtomatik siqiladi.
              </p>
              <button
                type="button"
                className="mt-2.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/40"
              >
                Faylni ko'rsatish
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Preset Avatars */}
        {activeTab === 'presets' && (
          <div className="mb-4">
            <div className="text-[11px] text-slate-400 mb-2">
              Tayyor Kiber AI avatarlaridan birini bosing:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = selectedAvatar === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedAvatar(preset.url)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <span className="text-[10px] font-mono-code text-slate-300 truncate w-full text-center">
                      {preset.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: URL Link */}
        {activeTab === 'url' && (
          <form onSubmit={handleApplyUrl} className="mb-4 space-y-2">
            <label className="text-[11px] text-slate-400 block">
              Rasmning to'g'ridan-to'g'ri havolasini kiriting:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                Ko'rish
              </button>
            </div>
          </form>
        )}

        {errorMsg && (
          <div className="mb-3 p-2 rounded-lg bg-rose-950/60 border border-rose-500/50 text-[11px] text-rose-300 text-center font-mono-code">
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 text-slate-950" />
            <span>Rasmni Saqlash</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
};
