import React, { memo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import './styles.scss';
import { ReactComponent as Spinner } from 'assets/images/spinner.svg';

const Loader = ({ fixed, absolute }) => {
  
  return (
    <span className={clsx('loader-wrapper', { fixed, absolute })}>
      <Spinner />
    </span>
  );
}

export default memo(Loader);

Loader.propTypes = {
  fixed: PropTypes.bool,
  absolute: PropTypes.bool
};
