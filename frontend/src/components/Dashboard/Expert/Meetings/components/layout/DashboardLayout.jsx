import PropTypes from 'prop-types';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen border rounded-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default DashboardLayout;