import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Sparkles,
  ExternalLink,
  CheckCircle,
  MoveUp,
  MoveDown,
  Layout,
  Image as ImageIcon,
} from 'lucide-react';
import { homepageService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ImageUploader } from '../../components/admin/ImageUploader';

export const HomepageCms = () => {
  const { addToast } = useToast();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [saving, setSaving] = useState(false);

  const normalizeSection = (s) => ({
    ...s,
    badge: s.badge || s.metadata?.badge || '',
    image: s.image || s.images?.[0] || '',
    cta: {
      text: s.cta?.text || s.buttonText || '',
      link: s.cta?.link || s.buttonLink || '',
    },
    secondaryCta: {
      text: s.secondaryCta?.text || s.secondaryButtonText || '',
      link: s.secondaryCta?.link || s.secondaryButtonLink || '',
    },
    content: s.content || s.description || '',
  });

  const loadSections = async () => {
    try {
      setLoading(true);
      const res = await homepageService.getAllSections();
      if (res.success) {
        const secs = (res.sections || []).map(normalizeSection);
        setSections(secs);
        if (secs.length > 0 && !selectedSection) {
          setSelectedSection(secs[0]);
        } else if (selectedSection) {
          const updated = secs.find((s) => s._id === selectedSection._id);
          if (updated) setSelectedSection(updated);
        }
      }
    } catch (err) {
      addToast('Failed to load homepage CMS sections.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleToggleSectionActive = async (sec) => {
    try {
      const updatedEnabled = !sec.isEnabled;
      const res = await homepageService.updateSection(sec._id, {
        isEnabled: updatedEnabled,
      });
      if (res.success) {
        addToast(
          `Section "${sec.name}" is now ${updatedEnabled ? 'active' : 'hidden'}.`,
          'success'
        );
        loadSections();
      }
    } catch (err) {
      addToast('Error updating section visibility.', 'error');
    }
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    if (!selectedSection) return;

    try {
      setSaving(true);
      const res = await homepageService.updateSection(selectedSection._id, {
        name: selectedSection.name,
        title: selectedSection.title,
        subtitle: selectedSection.subtitle,
        badge: selectedSection.badge,
        content: selectedSection.content,
        description: selectedSection.content,
        cta: selectedSection.cta,
        buttonText: selectedSection.cta?.text,
        buttonLink: selectedSection.cta?.link,
        secondaryCta: selectedSection.secondaryCta,
        secondaryButtonText: selectedSection.secondaryCta?.text,
        secondaryButtonLink: selectedSection.secondaryCta?.link,
        image: selectedSection.image,
        images: selectedSection.image ? [selectedSection.image] : [],
        isEnabled: selectedSection.isEnabled,
      });

      if (res.success) {
        addToast(`Section "${selectedSection.name}" changes saved.`, 'success');
        loadSections();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save section.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index, direction) => {
    const newSections = [...sections];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setSections(newSections);

    try {
      const orderedIds = newSections.map((s) => s._id);
      await homepageService.reorderSections(orderedIds);
      addToast('Section hierarchy updated.', 'success');
    } catch (err) {
      addToast('Failed to persist section order.', 'error');
      loadSections();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block mb-1">
            Storefront Layout & Presentation
          </span>
          <h1 className="text-2xl font-serif-luxury font-bold text-white tracking-wide">
            Homepage Content Management
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure headline banners, photography, call-to-actions, and reorder active visual blocks.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="btn-outline-gold px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-luxury flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Preview Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-500">
          <Loader2 className="w-8 h-8 text-[#DC2626] animate-spin mx-auto mb-2" />
          <span>Loading dynamic section tree...</span>
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-[#14171d] border border-white/10 rounded-2xl p-12 text-center text-neutral-400 text-xs">
          No dynamic sections discovered. Run backend database seeding to initialize homepage CMS components.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section List Left Panel */}
          <div className="space-y-4">
            <h2 className="text-sm font-serif-luxury font-bold text-white uppercase tracking-luxury">
              Page Section Blocks
            </h2>

            <div className="bg-[#14171d] border border-white/10 rounded-2xl overflow-hidden shadow-xl divide-y divide-white/5">
              {sections.map((sec, idx) => {
                const isSelected = selectedSection?._id === sec._id;
                return (
                  <div
                    key={sec._id}
                    className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'bg-[#DC2626]/10 border-l-4 border-l-[#DC2626]'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedSection(sec)}
                      className="text-left flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs truncate">
                          {sec.name || sec.sectionKey}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono block">
                        key: {sec.sectionKey}
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Move Up/Down */}
                      <button
                        onClick={() => handleMove(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 1)}
                        disabled={idx === sections.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Active Toggle */}
                      <button
                        onClick={() => handleToggleSectionActive(sec)}
                        className={`p-1 rounded transition-colors ${
                          sec.isEnabled
                            ? 'text-emerald-400 hover:bg-emerald-500/10'
                            : 'text-neutral-600 hover:bg-white/5'
                        }`}
                        title={sec.isEnabled ? 'Active (Click to hide)' : 'Hidden (Click to enable)'}
                      >
                        {sec.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Edit Form Right Panel */}
          <div className="lg:col-span-2">
            {selectedSection ? (
              <div className="bg-[#14171d] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block">
                      Section Content Editor
                    </span>
                    <h2 className="text-lg font-serif-luxury font-bold text-white tracking-wide">
                      {selectedSection.name} ({selectedSection.sectionKey})
                    </h2>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedSection.isEnabled
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-neutral-800 text-neutral-400 border border-white/5'
                    }`}
                  >
                    {selectedSection.isEnabled ? 'Live on Storefront' : 'Hidden from View'}
                  </span>
                </div>

                <form noValidate onSubmit={handleSaveContent} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                      Display Title / Headline
                    </label>
                    <input
                      type="text"
                      value={selectedSection.title || ''}
                      onChange={(e) =>
                        setSelectedSection((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="e.g. Architectural & Luxury Decorative Lighting"
                      className="w-full px-4 py-3 rounded-xl bg-[#090a0d] border border-white/10 text-white text-sm focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                      Subtitle / Narrative Description
                    </label>
                    <textarea
                      rows={3}
                      value={selectedSection.subtitle || ''}
                      onChange={(e) =>
                        setSelectedSection((p) => ({ ...p, subtitle: e.target.value }))
                      }
                      placeholder="Atmospheric narrative and design philosophy..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                      Eyebrow Tag / Badge
                    </label>
                    <input
                      type="text"
                      value={selectedSection.badge || ''}
                      onChange={(e) =>
                        setSelectedSection((p) => ({ ...p, badge: e.target.value }))
                      }
                      placeholder="e.g. 2026 LUXURY COLLECTION"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>

                  {/* Primary CTA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                        Primary CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={selectedSection.cta?.text || ''}
                        onChange={(e) =>
                          setSelectedSection((p) => ({
                            ...p,
                            cta: { ...p.cta, text: e.target.value },
                          }))
                        }
                        placeholder="Explore Catalog"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                        Primary CTA Link Target
                      </label>
                      <input
                        type="text"
                        value={selectedSection.cta?.link || ''}
                        onChange={(e) =>
                          setSelectedSection((p) => ({
                            ...p,
                            cta: { ...p.cta, link: e.target.value },
                          }))
                        }
                        placeholder="/catalog"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Background / Hero Imagery */}
                  <div className="pt-3">
                    <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
                      Background Photography
                    </label>
                    <ImageUploader
                      label="Upload Section Background Asset"
                      onUploadSuccess={(url) =>
                        setSelectedSection((p) => ({ ...p, image: url }))
                      }
                    />
                    <div className="mt-2">
                      <input
                        type="text"
                        value={selectedSection.image || ''}
                        onChange={(e) =>
                          setSelectedSection((p) => ({ ...p, image: e.target.value }))
                        }
                        placeholder="Or direct image URL (/uploads, Unsplash, CDN)..."
                        className="w-full px-3 py-2 rounded-xl bg-[#090a0d] border border-white/10 text-xs text-white placeholder-neutral-600 font-mono"
                      />
                    </div>
                    {selectedSection.image && (
                      <div className="mt-3 h-36 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                        <img
                          src={selectedSection.image}
                          alt="Section preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-gold px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-luxury flex items-center gap-2 shadow-xl"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Save Section Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-[#14171d] border border-white/10 rounded-2xl p-12 text-center text-neutral-500 text-xs">
                Select a section from the left column to modify its settings.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
