import _ from 'lodash';

import st0r from './images/tiles/0r.png';
import st1 from './images/tiles/1.png';
import st1r from './images/tiles/1r.png';
import st2 from './images/tiles/2.png';
import st2r from './images/tiles/2r.png';
import st3 from './images/tiles/3.png';
import stEr from './images/tiles/Er.png';
import f0 from './images/tiles/0.png';
import f1 from './images/tiles/-1.png';
import f2 from './images/tiles/-2.png';
import s1rs from './images/tiles/1rs.png';
import s3s from './images/tiles/3s.png';
import sErs from './images/tiles/Ers.png';
import sSs from './images/tiles/Ss.png';
import revealIconSrc from './images/reveal-icon.png';
import eyeIconSrc from './images/eye-icon.png';
import stopIconSrc from './images/stop-icon.png';
import shelobIconSrc from './images/shelob-icon.png';

const STARTING_HUNT_POOL = ['0r', '0r', '1r', '1r', '2r', '1', '1', '2', '2', '3', '3', '3', 'Er', 'Er', 'Er', 'Er'];
const SPECIAL_TILE_VALUES = {
  '0_1': {
    name: 'Elven Cloaks',
    special: 'f',
    damage: '0',
    icons: [],
  },
  '0_2': {
    name: 'Elven Rope',
    special: 'f',
    damage: '0',
    icons: [],
  },
  '-1': {
    name: 'Smeagol Helps Nice Master',
    special: 'f',
    damage: '-1',
    icons: [],
  },
  '-2': {
    name: 'Phial of Galadriel',
    special: 'f',
    damage: '-2',
    icons: [],
  },
  '1rs': {
    name: 'Give It To Uss!',
    special: 's',
    damage: '1',
    icons: ['r', 's'],
  },
  '3s': {
    name: 'On, On They Went',
    special: 's',
    damage: '3',
    icons: ['s'],
  },
  'Ss': {
    name: 'Shelob\'s Lair',
    special: 's',
    damage: 'S',
    icons: ['s'],
  },
  'Ers': {
    name: 'The Ring is Mine!',
    special: 's',
    damage: 'E',
    icons: ['r', 's'],
  },
};
const SPECIAL_TILES = {
  'freepeoples': _.pick(SPECIAL_TILE_VALUES, ['0_1', '0_2', '-1', '-2']),
  'shadow': _.pick(SPECIAL_TILE_VALUES, ['1rs', '3s', 'Ss', 'Ers']),
};

const imgSrcs = {
  '0r': st0r,
  '1': st1,
  '1r': st1r,
  '2': st2,
  '2r': st2r,
  '3': st3,
  'Er': stEr,
  '0': f0,
  '-1': f1,
  '-2': f2,
  '1rs': s1rs,
  '3s': s3s,
  'Ers': sErs,
  'Ss': sSs,

  'E': eyeIconSrc,
  'S': shelobIconSrc,
  'reveal': revealIconSrc,
  'stop': stopIconSrc,
};

export {
  STARTING_HUNT_POOL,
  SPECIAL_TILES,
  imgSrcs,
} 