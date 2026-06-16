import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Loader2 } from 'lucide-react';
import { createTeam } from '../../state/teamSlice';

const AddTeamModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading: isCreating } = useSelector(state => state.team);

  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    type: 'FRANCHISE',
    homeGround: '',
    country: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.shortName || !formData.country) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      await dispatch(createTeam(formData)).unwrap();
      onClose();
      setFormData({
        name: '',
        shortName: '',
        type: 'FRANCHISE',
        homeGround: '',
        country: '',
      });
    } catch (err) {
      setError(err || 'Failed to create team');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Add New Team</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Team Name *</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Mumbai Indians"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Short Name *</label>
              <input 
                type="text" 
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="e.g. MI"
                maxLength={4}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Type</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
              >
                <option value="FRANCHISE">Franchise</option>
                <option value="INTERNATIONAL">International</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Country *</label>
              <input 
                type="text" 
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. India"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Home Ground</label>
              <input 
                type="text" 
                name="homeGround"
                value={formData.homeGround}
                onChange={handleChange}
                placeholder="e.g. Wankhede"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
              />
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isCreating}
              className="px-5 py-2.5 text-white bg-[#1E402F] hover:bg-[#152e22] font-bold text-sm rounded-lg transition-colors flex items-center"
            >
              {isCreating && <Loader2 size={16} className="animate-spin mr-2" />}
              {isCreating ? 'Creating...' : 'Add Team'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddTeamModal;
