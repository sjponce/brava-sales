import React from 'react';
import PropTypes from 'prop-types';

const DashboardLayout = ({ children }) => (
  <div
    style={{
      marginLeft: 140,
    }}
  >
    {children}
  </div>
);

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
