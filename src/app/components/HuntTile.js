import React from 'react';
import _ from 'lodash';
import cx from 'classnames';

import PoolIcon from './PoolIcon.js';

import { SPECIAL_TILES, imgSrcs } from './../hunt_tiles.js';

function getTileInfo(tile) {
  let { special, damage, icons, name } = _.get(SPECIAL_TILES, tile, {});
  let hasIcons;
  let img;
  special = special ? special : '';
  damage = damage ? damage : tile.charAt(0); // only single digit integer damage supported for non-special tiles
  icons = icons ? icons : _.filter(tile.split(''), c => c === 'r' || c === 's');
  name = name ? name : tile;
  hasIcons = icons.length > 0;
  img = imgSrcs[`${damage}${icons.join('')}`];
  damage = _.includes(['E', 'S'], damage) ?
    <img src={imgSrcs[damage]} alt={damage === 'E' ? 'Lidless Eye' : name} className='img-damage-icon' /> :
    <span className='number'>{damage}</span>;
  return {
    tile,
    special,
    damage,
    icons,
    name,
    hasIcons,
    img,
  };
}

const TILE_ICONS = {
  'r': {
    src: imgSrcs['reveal'],
    name: 'reveal',
  }, 
  's': {
    src: imgSrcs['stop'],
    name: 'stop',
  }
};
const overlayButtons = {
  'current': fn => <button className='pure-button tile-action-btn' title='Move to Current' onClick={fn} key='overlay-current'><PoolIcon pool='current' /></button>,
  'discarded': fn => <button className='pure-button tile-action-btn' title='Move to Discarded' onClick={fn} key='overlay-discarded'><PoolIcon pool='discarded' /></button>,
  'removed': fn => <button className='pure-button tile-action-btn' title='Move to Removed' onClick={fn} key='overlay-removed'><PoolIcon pool='removed' /></button>,
  'pool': fn => <button className='pure-button tile-action-btn' title='Move to Hunt Pool' onClick={fn} key='overlay-pool'><PoolIcon pool='pool' /></button>,
};
function generateOverlayButtons(pool, poolIndex, fn) {
  return _.get({
    pool: createButtons(['current', 'discarded']),
    discarded: createButtons(['pool', 'removed']),
    removed: createButtons(['pool', 'discarded']),
    setAside: createButtons(['pool', 'removed']),
  }, pool, null);
  function createButtons(targetPools) {
    return _.map(targetPools, p => overlayButtons[p](() => fn(pool, poolIndex, p)));
  }
}
const HuntTile = ({tile, big = false, smallViewport = false, withOverlay = false, pool = null, poolIndex = null, appendFromCollection}) => {
  const { special, damage, icons, hasIcons, img, name } = getTileInfo(!_.isNil(tile) ? tile : '');
  const classes = cx('hunt-tile', { [special]: special }, {
    big,
    'small-viewport': smallViewport,
    'has-icons': hasIcons,
    'empty': _.isNil(tile),
  });
  if (_.isNil(tile)) {
    return (<div className={classes}></div>);
  }
  if (big) {
    return (
      <div className={classes}>
        <div className='damage'>{damage}</div>
        { hasIcons ? <div className='icons'>
          { _.map(icons, i => <HuntTileIcon key={`${i}-icon`} icon={TILE_ICONS[i]} />) }
        </div> : null }
      </div>
    );
  }
  if (smallViewport) {
    return (
      <div className='hunt-tile-container'>
        <div className={classes}>
          <img src={img} alt={name} title={name} className='tile-image' />
        </div>
        <div className='outside-btns'>
          {generateOverlayButtons(pool, poolIndex, appendFromCollection)}
        </div>
      </div>
    );
  }
  return (
    <div className={classes}>
      <img src={img} alt={name} title={name} className='tile-image' />
      { withOverlay ? (
          <div className='overlay'>
            {generateOverlayButtons(pool, poolIndex, appendFromCollection)}
          </div>
        ) : null }
    </div>
  );
}

const HuntTileIcon = ({icon}) => <img src={icon.src} alt={icon.name} className={`${icon.name}-icon`} />;

export default HuntTile;