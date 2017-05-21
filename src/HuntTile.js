import React from 'react';
import _ from 'lodash';

import { SPECIAL_TILES, imgSrcs } from './hunt_tiles.js';

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
    <img src={imgSrcs[damage]} alt={damage === 'E' ? 'Lidless Eye' : 'Shelob Attacks!'} className='img-damage-icon' /> :
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
  'current': fn => <button className='pure-button overlay-button' onClick={fn} role='button' key='overlay-current'><i className='fa fa-arrow-right' /></button>,
  'discarded': fn => <button className='pure-button overlay-button' onClick={fn} role='button' key='overlay-discarded'><i className='fa fa-trash' /></button>,
  'removed': fn => <button className='pure-button overlay-button' onClick={fn} role='button' key='overlay-removed'><i className='fa fa-ban' /></button>,
  'pool': fn => <button className='pure-button overlay-button' onClick={fn} role='button' key='overlay-pool'><i className='fa fa-arrow-left' /></button>,
};
function generateOverlayButtons(pool, poolIndex, fn) {
  if (pool === 'pool') {
    return createButtons(['current', 'discarded']);
  }
  if (pool === 'discarded') {
    return createButtons(['pool', 'removed']);
  }
  if (pool === 'removed') {
    return createButtons(['pool', 'discarded']);
  }
  return null;
  function createButtons(targetPools) {
    return _.map(targetPools, p => overlayButtons[p](() => fn(pool, poolIndex, p)));
  }
}
const HuntTile = ({tile, big = false, withOverlay = false, pool = null, poolIndex = null, appendFromCollection}) => {
  const { special, damage, icons, hasIcons, img, name } = getTileInfo(!_.isNil(tile) ? tile : '');
  if (_.isNil(tile)) {
    return (<div className={`hunt-tile empty ${ big ? ' big' : '' }`}></div>);
  }
  if (big) {
    return (
      <div className={`hunt-tile${ big ? ' big' : '' }${ hasIcons ? ' has-icons' : ''} ${special}`}>
        <div className='damage'>
          { damage }
        </div>
        { hasIcons ? <div className='icons'>
          { _.map(icons, i => <HuntTileIcon key={`${TILE_ICONS[i].name}-icon`} icon={TILE_ICONS[i]} />) }
        </div> : '' }
      </div>
    );
  }

  return (
    <div className={`hunt-tile  ${special}`}>
      <img src={img} alt={name} className='tile-image' />
      { withOverlay ? (
          <div className='overlay'>
            {generateOverlayButtons(pool, poolIndex, appendFromCollection)}
          </div>
        ) : null}
    </div>
  );
}

const HuntTileIcon = ({icon}) => (<img src={icon.src} alt={icon.name} className={`${icon.name}-icon`} />);

export default HuntTile;