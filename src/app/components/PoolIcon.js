import React from 'react';
import cx from 'classnames';

const POOL_ICON_CLASSES = {
  pool: 'fa-arrow-left',
  discarded: 'fa-trash',
  removed: 'fa-ban',
  setAside: 'fa-arrow-right',
  current: 'fa-dot-circle-o',
};

export default ({ big, pool }) => {
  return <i className={cx('fa', { 'fa-lg': big }, { [POOL_ICON_CLASSES[pool]]: true })} aria-hidden='true'/>;
};
