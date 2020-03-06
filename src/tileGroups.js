import {
  INITIAL_TILES,
  SPECIAL_TILES,
  REMOVED,
  SETASIDE,
  DISCARDED,
  POOL,
  CURRENT
} from './constants';

export const initialState = {
  [POOL]: INITIAL_TILES,
  [DISCARDED]: [],
  [REMOVED]: SPECIAL_TILES,
  [SETASIDE]: [],
  [CURRENT]: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'draw':
      const huntPool = state[POOL];
      const drawnTileIndex = Math.floor(Math.random()*huntPool.length);
      const drawnTile = huntPool[drawnTileIndex];
      const updatedHuntPool = huntPool.filter((i, k) => k !== drawnTileIndex);
      return {...state, [POOL]: updatedHuntPool, [CURRENT]: drawnTile};
    case 'discard':
      return {...state, [CURRENT]: null, [DISCARDED]: state[DISCARDED].concat(state[CURRENT])};
    case 'set-aside':
        return {...state, [CURRENT]: null, [SETASIDE]: state[SETASIDE].concat(state[CURRENT])};
    case 'move-tile':
      const { indecesOfTilesToMove, fromGroup, toGroup } = action.payload;
      const updatedFromGroup = state[fromGroup].filter((t, i) => !indecesOfTilesToMove.includes(i))
      const updatedToGroup = state[toGroup].concat(state[fromGroup].filter((t, i) => indeces.includes(i)));
      return {...state, [fromGroup]: updatedFromGroup, [toGroup]: updatedToGroup};
    case 'reset':
      return initialState;
    default:
      throw new Error('action not specified.');
  }
}