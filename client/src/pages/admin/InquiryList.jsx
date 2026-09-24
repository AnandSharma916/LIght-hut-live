import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { inquiryService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const InquiryList = () => {
  const { addToast } = useToast();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // View modal
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Deletion modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const res = await inquiryService.getInquiries();
      if (res.success) {
        setInquiries(res.inquiries || []);
      }
    } catch (err) {
      addToast('Failed to load inquiries list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await inquiryService.updateInquiry(id, { status: newStatus });
      if (res.success) {
        addToast(`Inquiry status updated to ${newStatus}.`, 'success');
        setInquiries((prev) =>
          prev.map((i) => (i._id === id ? { ...i, status: newStatus } : i))
        );
        if (selectedInquiry?._id === id) {
          setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      addToast('Error updating status.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!inquiryToDelete) return;
    try {
      setDeleting(true);
      const res = await inquiryService.deleteInquiry(inquiryToDelete._id);
      if (res.success) {
        addToast('Inquiry record deleted.', 'info');
        setDeleteModalOpen(false);
        setInquiryToDelete(null);
        if (selectedInquiry?._id === inquiryToDelete._id) {
          setSelectedInquiry(null);
        }
        loadInquiries();
      }
    } catch (err) {
      addToast('Failed to delete inquiry.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const inqStatus = (inq.status || '').toLowerCase();
    const filterStatus = statusFilter.toLowerCase();
    const matchesStatus =
      filterStatus === 'all' ||
      inqStatus === filterStatus ||
      ((filterStatus === 'completed' || filterStatus === 'resolved') &&
        (inqStatus === 'completed' || inqStatus === 'resolved'));
    const matchesSearch =
      (inq.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block mb-1">
            CRM & Client Inquiries
          </span>
          <h1 className="text-2xl font-serif-luxury font-bold text-white tracking-wide">
            Architectural Project Requests
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage bespoke luminaire quote requests and technical specification consultations from interior designers & architects.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#14171d] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-lg">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inquiries by client name, email, or message..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090a0d] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#DC2626] text-xs transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'new', 'contacted', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-luxury transition-all ${
                statusFilter === st
                  ? 'bg-[#DC2626] text-white font-bold shadow-md shadow-red-600/10'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-[#14171d] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1014] text-neutral-400 uppercase tracking-luxury font-semibold border-b border-white/10 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Project / Interest</th>
                <th className="py-3.5 px-4">Received</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-500">
                    Loading client requests...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <MessageSquare className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-neutral-300">No client inquiries found</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      New requests submitted through the storefront will display here immediately.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr
                    key={inq._id}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelectedInquiry(inq)}
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{inq.name}</span>
                      {inq.company && (
                        <span className="text-[11px] text-neutral-400 block">{inq.company}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="flex items-center gap-1 text-neutral-300">
                        <Mail className="w-3 h-3 text-[#DC2626]" />
                        <span>{inq.email}</span>
                      </div>
                      {inq.phone && (
                        <div className="flex items-center gap-1 text-neutral-500 mt-0.5">
                          <Phone className="w-3 h-3 text-neutral-600" />
                          <span>{inq.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="text-xs font-medium text-[#DC2626] block">
                        {inq.productTitle || inq.projectType || 'General Consultation'}
                      </span>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {inq.message || inq.subject}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={inq.status || 'New'}
                        onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[#090a0d] focus:outline-none ${
                          (inq.status || '').toLowerCase() === 'new'
                            ? 'text-amber-400 border-amber-500/30'
                            : (inq.status || '').toLowerCase() === 'contacted'
                            ? 'text-blue-400 border-blue-500/30'
                            : 'text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setInquiryToDelete(inq);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedInquiry(null)}
          />

          <div className="relative w-full max-w-lg bg-[#14171d] border border-white/10 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6 shrink-0 bg-[#14171d]">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block">
                  Inquiry Details
                </span>
                <h3 className="text-xl font-serif-luxury font-bold text-white">
                  {selectedInquiry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1 modal-scrollbar">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-black/40 border border-white/5 font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-luxury block mb-1">
                    Email
                  </span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-[#DC2626] hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-luxury block mb-1">
                    Phone
                  </span>
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="text-white hover:text-[#DC2626]"
                  >
                    {selectedInquiry.phone || 'Not provided'}
                  </a>
                </div>
              </div>

              {selectedInquiry.productTitle && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-luxury block mb-0.5">
                    Luminaire of Interest
                  </span>
                  <span className="font-semibold text-white">
                    {selectedInquiry.productTitle}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-luxury block mb-1.5">
                  Message / Technical Scope
                </span>
                <div className="p-4 rounded-xl bg-[#090a0d] border border-white/10 text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message || 'No written message provided.'}
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex items-center justify-between p-4 sm:px-6 border-t border-white/10 bg-[#0e1014] shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Status:</span>
                <select
                  value={selectedInquiry.status || 'New'}
                  onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value)}
                  className="px-3 py-1 rounded-lg bg-[#090a0d] border border-white/10 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <a
                href={`mailto:${selectedInquiry.email}?subject=Regarding your Lighting Inquiry`}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-luxury"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Client Inquiry?"
        message="Are you sure you want to permanently delete this client inquiry from the CRM log?"
        confirmText="Delete Record"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setInquiryToDelete(null);
        }}
      />
    </div>
  );
};
