import React from 'react';
import cx from 'classnames';
import {
  INITIAL_TILES,
  BLUE_SPECIAL_TILES
} from './constants';

import blueBg from './images/blue512.png';
import redBg from './images/red512.png';
import brownBg from './images/brown512.png';
import revealIcon from './images/reveal.png';
import { ReactComponent as StopIcon } from './images/stop.svg';
import './css/HuntTile.css';

function Stop() {
  return <div className='stop'><StopIcon /></div>;
}
function Reveal({ revealStyle }) {
  return <div className='reveal'><div className='reveal-icon' style={revealStyle} /></div>;
}

function HuntTile({ tile = '', small, large }) {
  if (!tile) {
    return <div className={cx('hunt-tile', 'empty', { small, large })}></div>;
  }

  const damage = tile.charAt(0);
  const extra = tile.substring(1);
  const tileBg = INITIAL_TILES.includes(tile) ? brownBg :
    BLUE_SPECIAL_TILES.includes(tile) ? blueBg : redBg;
  const reveal = extra.includes('r') ? revealIcon : '';
  const stop = extra.includes('s');
  const bgImg = imgSrc => ({backgroundImage: 'url(' + imgSrc + ')'});
  const prefix = extra && extra[0] === '-' ? '-' : '';

  return (
    <div className={cx('hunt-tile', { small, large })} style={bgImg(tileBg)}>
      <div className='damage'>{prefix + damage}</div>
      <div className='extras'>
        {reveal ? <Reveal revealStyle={bgImg(reveal)} /> : null}
        {stop ? <Stop /> : null}
      </div>
    </div>
  )
}


export default HuntTile;