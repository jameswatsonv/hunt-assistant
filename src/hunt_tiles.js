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

const STARTING_HUNT_POOL = ['0r', '0r', '1r', '1r', '2r', '1', '1', '2', '2', '3', '3', '3', 'Er', 'Er', 'Er', 'Er'];
const SPECIAL_TILES = {
  '0_1': {
    name: 'Elven Cloaks',
    value: '0_1',
    special: 'f',
  },
  '0_2': {
    name: 'Elven Rope',
    value: '0_2',
    special: 'f',
  },
  '-1': {
    name: 'Smeagol Helps Nice Master',
    value: '-1',
    special: 'f',
  },
  '-2': {
    name: 'Phial of Galadriel',
    value: '-2',
    special: 'f',
  },
  '1rs': {
    name: 'Give It To Uss!',
    value: '1rs',
    special: 's',
  },
  '3s': {
    name: 'On, On They Went',
    value: '3s',
    special: 's',
  },
  'Ss': {
    name: 'Shelob\'s Lair',
    value: 'Ss',
    special: 's',
  },
  'Ers': {
    name: 'The Ring is Mine!',
    value: 'Ers',
    special: 's',
  },
};

const imgSrcs = {
  '0r': st0r,
  '1': st1,
  '1r': st1r,
  '2': st2,
  '2r': st2r,
  '3': st3,
  'Er': stEr,
  '0_1': f0,
  '0_2': f0,
  '-1': f1,
  '-2': f2,
  '1rs': s1rs,
  '3s': s3s,
  'Ers': sErs,
  'Ss': sSs,
};

export {
  STARTING_HUNT_POOL,
  SPECIAL_TILES,
  imgSrcs,
} 