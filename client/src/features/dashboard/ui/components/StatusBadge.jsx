import React from 'react';

const StatusBadge = ({ status, variant = 'default' }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'live':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'injured':
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'pending':
      case 'scheduled':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getVariantStyles = () => {
    if (variant === 'country') {
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    }
    return getStyles();
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getVariantStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
