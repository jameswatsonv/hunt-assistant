import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import { SPECIAL_TILES } from './../hunt_tiles.js';

const renderSpecialTileButton = (tileInfo, props) => (
  <li className="pure-menu-item" key={`toggle${tileInfo.value}`}>
    <button className={`pure-button tile-button ${tileInfo.special}`} disabled={props.isSpecialTileAdded(tileInfo.value)} onClick={() => props.addSpecialTile(tileInfo.value)}>{tileInfo.name}</button>
  </li>
);
const renderButtonGroup = (specialTiles, props) => (
  <div className='pure-menu pure-menu-horizontal' key={`toggle-${props.side}`}>
    <ul className="pure-menu-list">
      {
        _.map(
          specialTiles,
          tileInfo => renderSpecialTileButton(tileInfo, props)
        )
      }
    </ul>
  </div> 
);
export default props => {
  const classes = cx(
    'special-tile-buttons',
    { 'pure-g': !props.smallViewport },
    { 'small-viewport': props.smallViewport },
  );
  if (props.smallViewport) {
    return (
      <div className={classes}>
      {
        _.map(
          _.keys(SPECIAL_TILES),
          side => (
            <div key={`toggle-c-${side}`}>
              {
                renderButtonGroup(
                  _.map(
                    SPECIAL_TILES[side],
                    (t, k) => _.assign({ value: `${side}.${k}` }, t)
                  ),
                  _.assign({ side }, props),
                )
              }
            </div>
          )
        )
      }
      </div>
    );
  }
  return (
    <div className={classes}>
    {
      _.map(
        _.keys(SPECIAL_TILES),
        side => (
          <div className='pure-u-1-2' key={`toggle-c-${side}`}>
            {
              renderButtonGroup(
                _.map(
                  SPECIAL_TILES[side],
                  (t, k) => _.assign({ value: `${side}.${k}` }, t)
                ),
                _.assign({ side }, props),
              )
            }
          </div>
        )
      )
    }
    </div>
  )
}