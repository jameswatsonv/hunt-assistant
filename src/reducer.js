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
  mordor: false,
};

export function init(initialState) {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState;
  }
}

function getCurrentTile(currentTile) {
  if (Array.isArray(currentTile))
    return currentTile;
  else
    return currentTile ? [currentTile] : [];
}

function moveTiles(state, {indecesToMove, fromGroup, toGroup}) {
  const updatedFromGroup = state[fromGroup].filter((t, i) => !indecesToMove.includes(i))
  const updatedToGroup = state[toGroup].concat(state[fromGroup].filter((t, i) => indecesToMove.includes(i)));
  return {...state, [fromGroup]: updatedFromGroup, [toGroup]: updatedToGroup};
}

function persistState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
  return state;
}

export function reducer(state, action) {
  //console.log('reducer called for action: ', action.type);
  switch (action.type) {
    case 'draw':
      const huntPool = state[POOL];
      const drawnTileIndex = Math.floor(Math.random()*huntPool.length);
      const drawnTile = huntPool[drawnTileIndex];
      const updatedHuntPool = huntPool.filter((i, k) => k !== drawnTileIndex);
      return persistState({...state, [POOL]: updatedHuntPool, [CURRENT]: drawnTile});
    case 'discard':
      return persistState({...state, [CURRENT]: null, [DISCARDED]: state[DISCARDED].concat(getCurrentTile(state[CURRENT]))});
    case 'set-aside':
      return persistState({...state, [CURRENT]: null, [SETASIDE]: state[SETASIDE].concat(getCurrentTile(state[CURRENT]))});
    case 'move':
      return persistState(moveTiles(state, action));
    case 'enter-mordor':
      return persistState({ ...moveTiles(state, action), mordor: true });
    case 'reset':
      return persistState(initialState);
    default:
      throw new Error('action not specified.');
  }
}