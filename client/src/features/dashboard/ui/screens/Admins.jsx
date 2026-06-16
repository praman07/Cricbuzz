import React, { useEffect, useState } from 'react';
import { Users, Shield, ShieldAlert, Check, Edit2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../state/userSlice';
import axiosInstance from '../../../../config/axiosInstance';
import StatusBadge from '../components/StatusBadge';

const Admins = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.user);
  const { employee } = useSelector((state) => state.auth);
  
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = async (userId) => {
    try {
      await axiosInstance.patch(`/api/users/${userId}/role`, { role: selectedRole });
      dispatch(fetchUsers()); // Refresh data
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role. You may not have permission.');
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'SUPER_ADMIN') {
      return <span className="px-2 py-1 bg-[#fffbeb] text-[#d97706] border border-[#fef3c7] text-[11px] font-bold rounded uppercase tracking-wider">Super Admin</span>;
    }
    return <span className="px-2 py-1 bg-[#f1f5f9] text-slate-600 border border-slate-200 text-[11px] font-bold rounded uppercase tracking-wider">Admin</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm font-bold text-slate-500 mb-2 tracking-wide">
            <span>Administration</span>
            <span className="mx-2">&gt;</span>
            <span className="text-[#1E402F]">System Admins</span>
          </div>
          <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Admin Directory</h2>
          <p className="text-[15px] text-slate-600 mt-1">Manage system administrators and their access privileges.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
        <div className="p-5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#fafafa]">
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
            <Users size={18} className="mr-2 text-[#2ebd4f]" /> Registered Administrators ({users.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-[#e5e7eb]">
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Administrator</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Email Address</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700">Access Level</th>
                <th className="py-4 px-6 text-[13px] font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500 font-bold">Loading administrators...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500 font-bold">No administrators found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <img src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=1E402F&color=fff`} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <div>
                          <p className="font-bold text-[15px] text-slate-900 flex items-center">
                            {user.name}
                            {user._id === employee?._id && <span className="ml-2 text-[10px] bg-[#e7f9eb] text-[#2ebd4f] px-1.5 py-0.5 rounded font-black uppercase tracking-widest">You</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 font-medium text-[14px] text-slate-600">{user.email}</td>
                    <td className="py-5 px-6">
                      {editingUser === user._id ? (
                        <select 
                          value={selectedRole} 
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="px-3 py-1.5 bg-white border border-slate-300 rounded text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#2ebd4f]"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                      ) : (
                        getRoleBadge(user.role)
                      )}
                    </td>
                    <td className="py-5 px-6 text-right">
                       {editingUser === user._id ? (
                         <div className="flex justify-end space-x-2">
                           <button onClick={() => setEditingUser(null)} className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                           <button onClick={() => handleRoleChange(user._id)} className="flex items-center text-sm font-bold text-[#15803d] hover:text-[#166534] transition-colors">
                             <Check size={16} className="mr-1" /> Save
                           </button>
                         </div>
                       ) : (
                         <button 
                           onClick={() => { setEditingUser(user._id); setSelectedRole(user.role); }} 
                           className="text-sm font-bold text-[#4f46e5] hover:text-[#3730a3] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end w-full"
                         >
                           <Edit2 size={14} className="mr-1.5" /> Manage Role
                         </button>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admins;
