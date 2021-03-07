import React from 'react';
import PropTypes from 'prop-types';

const Main = ({ children }) => {
  
  return (
    <div className='main-wrapper'>
      {children}
    </div>
  );
}

export default Main;

Main.propTypes = {
  children: PropTypes.any.isRequired,
};
