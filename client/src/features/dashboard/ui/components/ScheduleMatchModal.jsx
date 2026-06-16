import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Calendar as CalendarIcon, MapPin, Loader2 } from 'lucide-react';
import { createMatch } from '../../state/matchSlice';
import { fetchTeams } from '../../state/teamSlice';
import { fetchSeries } from '../../state/seriesSlice';

const ScheduleMatchModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  const { teams, isLoading: isLoadingTeams } = useSelector(state => state.team);
  const { series, isLoading: isLoadingSeries } = useSelector(state => state.series);
  const { isLoading: isCreating } = useSelector(state => state.match);

  const [formData, setFormData] = useState({
    seriesId: '',
    team1: '',
    team2: '',
    venue: '',
    startTime: '',
    format: 'T20',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchTeams());
      dispatch(fetchSeries());
    }
  }, [isOpen, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.seriesId || !formData.team1 || !formData.team2 || !formData.venue || !formData.startTime) {
      setError('Please fill out all required fields.');
      return;
    }
    
    if (formData.team1 === formData.team2) {
      setError('Team 1 and Team 2 cannot be the same.');
      return;
    }

    try {
      await dispatch(createMatch(formData)).unwrap();
      onClose();
      setFormData({
        seriesId: '',
        team1: '',
        team2: '',
        venue: '',
        startTime: '',
        format: 'T20',
      });
    } catch (err) {
      setError(err || 'Failed to schedule match');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Schedule New Match</h2>
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
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Series / Tournament *</label>
            <select 
              name="seriesId" 
              value={formData.seriesId} 
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
            >
              <option value="">Select Series</option>
              {series.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Team 1 *</label>
              <select 
                name="team1" 
                value={formData.team1} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
              >
                <option value="">Select Team</option>
                {teams.map(t => (
                  <option key={t._id} value={t._id}>{t.name} ({t.shortName})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Team 2 *</label>
              <select 
                name="team2" 
                value={formData.team2} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
              >
                <option value="">Select Team</option>
                {teams.map(t => (
                  <option key={t._id} value={t._id}>{t.name} ({t.shortName})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Venue *</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Wankhede Stadium, Mumbai"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Date & Time *</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Format</label>
              <select 
                name="format" 
                value={formData.format} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#2ebd4f] focus:ring-1 focus:ring-[#2ebd4f] transition-all"
              >
                <option value="T20">T20</option>
                <option value="ODI">ODI</option>
                <option value="TEST">TEST</option>
              </select>
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
              {isCreating ? 'Scheduling...' : 'Schedule Match'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ScheduleMatchModal;
