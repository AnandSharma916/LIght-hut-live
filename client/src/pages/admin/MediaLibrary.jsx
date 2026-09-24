import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  UploadCloud,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Loader2,
  Search,
  Filter,
} from 'lucide-react';
import { uploadService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const MediaLibrary = () => {
  const { addToast } = useToast();

  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Deletion modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await uploadService.getMediaLibrary();
      if (res.success) {
        setMediaList(res.files || res.media || []);
      }
    } catch (err) {
      addToast('Failed to load media assets.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addToast('Asset URL copied to clipboard.', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleting(true);
      const res = await uploadService.deleteMedia(itemToDelete._id || itemToDelete.id);
      if (res.success) {
        addToast('Asset removed from library.', 'info');
        setDeleteModalOpen(false);
        setItemToDelete(null);
        loadMedia();
      }
    } catch (err) {
      addToast('Error removing media asset.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredMedia = mediaList.filter((m) =>
    (m.filename || m.url || m.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block mb-1">
            Digital Asset Management
          </span>
          <h1 className="text-2xl font-serif-luxury font-bold text-white tracking-wide">
            Media & Photography Library
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Storefront photographs, specification schematics, PDF spec sheets, and high-resolution CAD assets.
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-[#14171d] border border-white/10 p-6 rounded-2xl shadow-xl">
        <h2 className="text-sm font-serif-luxury font-bold text-white mb-3">
          Upload New Assets
        </h2>
        <ImageUploader
          label="Drag & Drop Luminaire Imagery (JPG, PNG, WebP, PDF)"
          onUploadSuccess={() => loadMedia()}
        />
      </div>

      {/* Search & Counter Bar */}
      <div className="bg-[#14171d] border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search media files by name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#090a0d] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs transition-colors"
          />
        </div>

        <span className="text-xs text-neutral-400 font-mono">
          {filteredMedia.length} Assets Registered
        </span>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-500">
          <Loader2 className="w-8 h-8 text-[#DC2626] animate-spin mx-auto mb-2" />
          <span>Scanning storage repository...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-[#14171d] border border-white/10 rounded-2xl p-12 text-center">
          <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-300">No media assets in library</p>
          <p className="text-xs text-neutral-500 mt-1">
            Drag and drop images into the upload zone above to begin building your luminaire gallery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((media, idx) => {
            const id = media._id || media.id || idx;
            const url = media.url || media.path || '';
            const name = media.filename || media.name || `Asset-${idx + 1}`;
            return (
              <div
                key={id}
                className="bg-[#14171d] border border-white/10 rounded-2xl overflow-hidden shadow-lg group hover:border-white/20 transition-all flex flex-col justify-between"
              >
                {/* Thumbnail Preview */}
                <div className="h-36 bg-[#090a0d] relative overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={url}
                    alt={name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/favicon.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Open full size"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleCopyUrl(url, id)}
                      className="p-2 rounded-lg bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors"
                      title="Copy URL to clipboard"
                    >
                      {copiedId === id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Info & Footer */}
                <div className="p-3 bg-[#0e1014] border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="truncate text-neutral-300 font-mono text-[11px]" title={name}>
                    {name}
                  </span>
                  <button
                    onClick={() => {
                      setItemToDelete(media);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors shrink-0 ml-1"
                    title="Delete media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Media Asset?"
        message="Are you sure you want to delete this photographic asset? Any products referencing this specific URL will require new imagery."
        confirmText="Delete File"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
};
