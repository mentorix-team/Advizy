import PropTypes from 'prop-types';

const STATUS_STYLES = {
  session: {
    Completed: 'bg-green-100 text-green-800',
    'reschedule requested': 'bg-yellow-100 text-yellow-800',
    rescheduled: 'bg-yellow-100 text-yellow-800',
    'cancellation requested': 'bg-red-100 text-red-800',
    cancelled: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
  },
  payment: {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
    'on hold': 'bg-orange-100 text-orange-800',
    default: 'bg-gray-100 text-gray-800'
  }
};

const StatusBadge = ({ status, type = 'session' }) => {
  const statusKey = status.toLowerCase();
  const styles = STATUS_STYLES[type][statusKey] || STATUS_STYLES[type].default;

  return (
    <span className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap ${styles}`}>
      {status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['session', 'payment'])
};

export default StatusBadge;