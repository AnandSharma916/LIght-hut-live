import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  X,
  Save,
  AlertTriangle,
  UploadCloud,
} from 'lucide-react';
import { categoryService, uploadService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { ImageUploader } from '../../components/admin/ImageUploader';

export const CategoryManagement = () => {
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [uploadingInput, setUploadingInput] = useState(false);

  const isLocalPath = (str) => {
    if (!str || typeof str !== 'string') return false;
    const trimmed = str.trim();
    return /^[a-zA-Z]:\\/i.test(trimmed) || trimmed.startsWith('file://') || (trimmed.includes('\\') && !trimmed.startsWith('http'));
  };

  // Deletion state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories({ admin: 'true' });
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      addToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setModalOpen(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !editingCategory
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : prev.slug,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Category name is required.', 'error');
      return;
    }

    if (isLocalPath(formData.image)) {
      addToast(
        'Local file paths (C:\\...) cannot be saved directly. Please upload the file using the upload box.',
        'error'
      );
      return;
    }

    try {
      setSubmitting(true);
      if (editingCategory) {
        const res = await categoryService.updateCategory(editingCategory._id, formData);
        if (res.success) {
          addToast(`Category "${formData.name}" updated.`, 'success');
          setModalOpen(false);
          loadCategories();
        }
      } else {
        const res = await categoryService.createCategory(formData);
        if (res.success) {
          addToast(`New category "${formData.name}" created.`, 'success');
          setModalOpen(false);
          loadCategories();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving category.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await categoryService.deleteCategory(categoryToDelete._id);
      if (res.success) {
        addToast(`Category "${categoryToDelete.name}" removed.`, 'info');
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        loadCategories();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete category.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block mb-1">
            Taxonomy & Navigation
          </span>
          <h1 className="text-2xl font-serif-luxury font-bold text-white tracking-wide">
            Lighting Collections & Categories
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Organize luminaires by architectural typology: Wall lights, Hanging chandeliers, Desk lamps, and Magnetic tracks.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-gold px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-luxury flex items-center gap-2 self-start sm:self-auto shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Category Grid Cards */}
      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-500">
          <Loader2 className="w-8 h-8 text-[#DC2626] animate-spin mx-auto mb-2" />
          <span>Loading Category Taxonomy...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-[#14171d] border border-white/10 rounded-2xl p-12 text-center">
          <Layers className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-300">No categories established</p>
          <p className="text-xs text-neutral-500 mt-1 mb-4">
            Create your first category to group your lighting catalog.
          </p>
          <button onClick={openCreateModal} className="btn-gold px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-luxury">
            Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-[#14171d] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Category Cover Image */}
                <div className="h-44 bg-[#090a0d] relative overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14171d] via-transparent to-transparent opacity-80" />

                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      cat.isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-neutral-900/80 text-neutral-400 border border-white/10'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>

                {/* Category Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-serif-luxury font-bold text-white tracking-wide">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      /{cat.slug}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mt-2">
                    {cat.description || 'No detailed architectural description assigned.'}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-[#0e1014] border-t border-white/5 flex items-center justify-between">
                <a
                  href={`/category/${cat.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-[#DC2626]" />
                  <span>View Public Page</span>
                </a>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                    title="Edit category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(cat);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#14171d] border border-white/10 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#14171d]">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block">
                  {editingCategory ? 'Update Collection' : 'Create Collection'}
                </span>
                <h3 className="text-lg font-serif-luxury font-bold text-white">
                  {editingCategory ? editingCategory.name : 'New Category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form noValidate onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
              {/* Scrollable Form Body */}
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 modal-scrollbar">
                <div>
                  <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Wall Light, Italian Lights"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#DC2626]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="wall-light"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#DC2626]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Summary of luminaires and design aesthetic in this category..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#DC2626]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                    Cover Image
                  </label>
                  <ImageUploader
                    label="Upload Category Banner Photo"
                    onUploadSuccess={(url) => {
                      setFormData((p) => ({ ...p, image: url }));
                      setImgError(false);
                    }}
                  />

                  {/* Local PC Path Warning */}
                  {isLocalPath(formData.image) && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Local Computer Path Detected</span>
                      </div>
                      <p className="text-[11px] text-amber-200/90 leading-relaxed">
                        You entered a private local file path from your computer (<code className="bg-black/40 px-1 py-0.5 rounded font-mono">{formData.image}</code>). Web browsers cannot access files directly from local drives.
                      </p>
                      <p className="text-[11px] text-white font-medium">
                        👉 <strong>How to fix:</strong> Click the <strong>Upload Category Banner Photo</strong> box above, or drag your image file into it so the image is uploaded to the server!
                      </p>
                    </div>
                  )}

                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, image: e.target.value }));
                        setImgError(false);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          try {
                            setUploadingInput(true);
                            const data = new FormData();
                            data.append('file', e.dataTransfer.files[0]);
                            const res = await uploadService.uploadSingle(data);
                            if (res.success && res.file) {
                              setFormData((p) => ({ ...p, image: res.file.url }));
                              setImgError(false);
                              addToast('Image uploaded successfully from dropped file.', 'success');
                            }
                          } catch (err) {
                            addToast('Failed to upload image from dropped file.', 'error');
                          } finally {
                            setUploadingInput(false);
                          }
                        }
                      }}
                      placeholder="Or paste direct image URL (/uploads, Unsplash, CDN)..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#090a0d] border border-white/10 text-xs text-white placeholder-neutral-600 font-mono"
                    />
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((p) => ({ ...p, image: '' }));
                          setImgError(false);
                        }}
                        className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Live Preview Box */}
                  {formData.image && (
                    <div className="mt-2 h-36 rounded-xl bg-[#090a0d] border border-white/10 overflow-hidden relative p-1 flex items-center justify-center">
                      {isLocalPath(formData.image) ? (
                        <div className="text-center p-3 text-amber-400/90 text-xs">
                          <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-amber-400" />
                          <span className="font-semibold block">Local PC path cannot be loaded</span>
                          <span className="text-[10px] text-neutral-400 mt-0.5 block">
                            Please click the upload box above to upload the file to storage
                          </span>
                        </div>
                      ) : imgError ? (
                        <div className="text-center p-3 text-neutral-500 text-xs">
                          <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span>Unable to load image from URL</span>
                        </div>
                      ) : (
                        <img
                          src={formData.image}
                          alt="Category Preview"
                          onError={() => setImgError(true)}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#DC2626] focus:ring-[#DC2626] bg-[#090a0d] border-white/20 cursor-pointer"
                    />
                    <span className="text-xs text-neutral-300 select-none">
                      Display category in navigation menu & public directory
                    </span>
                  </label>
                </div>
              </div>

              {/* Fixed Footer Buttons */}
              <div className="flex items-center justify-end gap-3 p-4 sm:px-6 border-t border-white/10 bg-[#0e1014] shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-luxury text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-luxury flex items-center gap-2 shadow-lg transition-all"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingCategory ? 'Update Category' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Category?"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? Luminaires assigned to this category will not be deleted, but will be marked unassigned.`}
        confirmText="Delete Category"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
      />
    </div>
  );
};
