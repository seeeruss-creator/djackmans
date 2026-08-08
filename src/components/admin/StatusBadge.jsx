import { STATUS_LABELS } from '../../constants/statuses.js';

export default function StatusBadge({ status, type }) {
  if (!status) return <span className="text-gray-400 text-xs">—</span>;
  const label = STATUS_LABELS[status] || status.replace(/_/g, ' ');
  return (
    <span className={`status-${status} inline-flex text-xs font-medium px-2.5 py-1 rounded-full capitalize`}>
      {type === 'payment' || type === 'delivery' ? label : label}
    </span>
  );
}
