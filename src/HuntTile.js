import React from 'react';
import _ from 'lodash';
import revealIconSrc from './reveal-icon.png';
import eyeIconSrc from './eye-icon.png';
import stopIconSrc from './stop-icon.png';

import { SPECIAL_TILES, imgSrcs } from './hunt_tiles.js';

function getTileInfo(tile) {
  const special = _.get(SPECIAL_TILES, `[${tile}].special`, '');
  const damage = tile.charAt(0) === '-' ? tile.substring(0, 2) : tile.charAt(0); // check for special fellowship tiles (only supports single digit integers)
  const icons = _.filter(tile.split(''), c => c === 'r' || c === 's');
  const hasIcons = icons.length > 0;
  const imgSrc = imgSrcs[tile];
  const imgAlt = SPECIAL_TILES[tile] ? SPECIAL_TILES[tile].name : tile;
  return {
    tile,
    special,
    damage,
    icons,
    hasIcons,
    imgSrc,
    imgAlt,
  };
}

const iconTypeNames = { r: 'reveal', s: 'stop' };
const overlayButtons = {
  'current': fn => <button className='pure-button overlay-button' onClick={fn} role='button' key='overlay-current'><i className='fa fa-arrow-right' /></button>,
  'discarded': fn => <button className='pure-button overlay-button' onClick={fn} role='button' key='overlay-discarded'><i className='fa fa-trash' /></button>,
  'removed': fn => <button className='pure-button overlay-button' onClick={fn} role='button' key='overlay-removed'><i className='fa fa-ban' /></button>,
  'pool': fn => <button className='pure-button overlay-button' onClick={fn} role='button' key='overlay-pool'><i className='fa fa-arrow-left' /></button>,
};
function generateOverlayButtons(pool, poolIndex, fn) {
  if (pool === 'pool') {
    return [
      createButton('current'),
      createButton('discarded'),
    ];
  }
  if (pool === 'discarded') {
    return [
      createButton('pool'),
      createButton('removed'),
    ];
  }
  if (pool === 'removed') {
    return [
      createButton('pool'),
      createButton('discarded'),
    ];
  }
  function createButton(targetPoolName) {
    return overlayButtons[targetPoolName](() => fn(pool, poolIndex, targetPoolName));
  }
}
const HuntTile = ({tile, big = false, withOverlay = false, pool = null, poolIndex = null, appendFromCollection}) => {
  const { special, damage, icons, hasIcons, imgSrc, imgAlt } = getTileInfo(!_.isNil(tile) ? tile : '');
  if (_.isNil(tile)) {
    return (<div className={`hunt-tile empty ${ big ? ' big' : '' }`}></div>);
  }
  if (big) {
    return (
      <div className={`hunt-tile${ big ? ' big' : '' }${ hasIcons ? ' has-icons' : ''} ${special}`}>
        <div className='damage'>
          { damage === 'E' ? <img src={eyeIconSrc} alt='Lidless Eye' className='eye-icon' /> : damage }
        </div>
        { hasIcons ? <div className='icons'>
          { _.map(icons, (i, j) => <HuntTileIcon key={`icon${tile}${j}`} type={iconTypeNames[i]} />) }
        </div> : '' }
      </div>
    );
  }

  return (
    <div className={`hunt-tile ${big ? 'big' : ''} ${hasIcons ? 'has-icons' : ''} ${special}`}>
      <img src={imgSrc} alt={imgAlt} className='tile-image' />
      { withOverlay ? (
          <div className='overlay'>
            {generateOverlayButtons(pool, poolIndex, appendFromCollection)}
          </div>
        ) : null}
    </div>
  );
}

const iconImgSrcs = { 'reveal': revealIconSrc, 'stop': stopIconSrc };
const HuntTileIcon = ({type}) => (<img src={iconImgSrcs[type]} alt={type} className={`${type}-icon`} />);

export default HuntTile;