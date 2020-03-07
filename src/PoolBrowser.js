import React, { useState } from 'react';
import cx from 'classnames';
import './css/PoolBrowser.css';

import {
  REMOVED,
  DISCARDED,
  POOL,
  POOL_LABELS
} from './constants';
import HuntTile from './HuntTile';

const buttonsByGroup = {
  [POOL]: [DISCARDED, REMOVED],
  [DISCARDED]: [POOL, REMOVED],
  [REMOVED]: [POOL, DISCARDED],
}

function PoolBrowser({ state, btnClasses, moveTileButtonClick }) {
  const [currentTab, setCurrentTab] = useState(null);

  return <div className='pool-browser'>
    <div className='pure-menu pure-menu-horizontal tabs'>
      <ul className='pure-menu-list'>
        {
          [POOL, DISCARDED, REMOVED].map(pool =>
          <li key={`tab${pool}`} className={cx('pure-menu-item', { 'current-tab': currentTab === pool})}><button onClick={() => setCurrentTab(pool)}>{POOL_LABELS[pool]} ({(state[pool]?.length || '0')})</button></li>  
          )
        }
      </ul>
    </div>
    <div className='tiles'>
      {
        currentTab && state[currentTab].map((t, i) => 
        <div className='tile-wrapper' key={`pooltile${i}`}>
          <div className='tile'>
            <HuntTile tile={t} />
          </div>
          <div className='buttons'>
            {
              buttonsByGroup[currentTab].map(group =>
              <button className={btnClasses({small: true})} onClick={() => moveTileButtonClick(i, currentTab, group)}>{POOL_LABELS[group]}</button>
              )
            }
          </div>
        </div>)
      }
    </div>
  </div>;
}

export default PoolBrowser;