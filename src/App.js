import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import './App.css';

import {
  INITIAL_TILES,
  SPECIAL_TILES,
  REMOVED,
  SETASIDE,
  DISCARDED,
  POOL
} from './constants';
import HuntTile from './HuntTile';
import ConfirmationDialog from './ConfirmationDialog';

const buttonClasses = ({disable, small, draw, mordor} = {}) => cx('pure-button', {
  'pure-button-disabled': disable,
  'small': small,
  'draw-button': draw,
  'in-mordor': mordor,
});

const tileGroupsInitialState = {
  [POOL]: INITIAL_TILES,
  [DISCARDED]: [],
  [REMOVED]: SPECIAL_TILES,
  [SETASIDE]: []
};

function useTileGroups() {
  const [currentTile, updateCurrentTile] = useState(null);
  const [mordor, updateMordor] = useState(false);
  const [tileGroups, updateTileGroups] = useState(tileGroupsInitialState);

  const draw = () => {
    if (currentTile) return;
    const huntPool = tileGroups[POOL];
    const drawnTileIndex = Math.floor(Math.random()*huntPool.length);
    const drawnTile = huntPool[drawnTileIndex];
    const updatedHuntPool = huntPool.filter((i, k) => k !== drawnTileIndex);
    updateCurrentTile(drawnTile);
    updateTileGroups({ ...tileGroups, [POOL]: updatedHuntPool});
  }

  const moveCurrentTile = useCallback(toGroup => {
    if (!currentTile) return;
    updateCurrentTile(null);
    updateTileGroups(tileGroups => ({ ...tileGroups, [toGroup]: tileGroups[toGroup].concat([currentTile])}));
  }, [currentTile]);

  const discard = () => moveCurrentTile(DISCARDED);

  const setAside = () => {
    if (tileGroups[SETASIDE] >= 3)
      return;
    moveCurrentTile(SETASIDE);
  }
  
  const moveTile = (indecesOfTilesToMove = [], fromGroup = REMOVED, toGroup = POOL) => {
    const current = tileGroups[fromGroup];
    const target = tileGroups[toGroup];
    const indeces = indecesOfTilesToMove && Array.isArray(indecesOfTilesToMove) ? indecesOfTilesToMove : [indecesOfTilesToMove];

    if (indeces.length === 0)
      return;
    
    // remove the passed indeces in the fromGroup
    const updatedCurrent = current.filter((t, i) => !indeces.includes(i));
    // add them to the toGroup 
    const updatedTarget = target.concat(current.filter((t, i) => indeces.includes(i)));

    updateTileGroups({ ...tileGroups, [fromGroup]: updatedCurrent, [toGroup]: updatedTarget});
  }

  const reset = () => {
    updateTileGroups({ ...tileGroupsInitialState });
  }

  return { draw, discard, setAside, moveTile, currentTile, tileGroups, mordor, updateMordor, reset };
}

function App() {
  const { draw, discard, setAside, moveTile, currentTile, tileGroups, mordor, updateMordor, reset } = useTileGroups();
  const [specialTilesOpen, setTilesOpen] = useState(false);
  const [showResetDialog, updateShowResetDialog] = useState(false);
  const setAsideTiles = tileGroups[SETASIDE];

  const specialTileButtonClick = useCallback(tileIndex => {
    moveTile([tileIndex], REMOVED, mordor ? POOL : DISCARDED);
    setTilesOpen(false);
  }, [mordor, moveTile]);

  function enterMordor() {
    // move eyes and special tiles from discarded to pool
    const tilesToMove = [];
    tileGroups[DISCARDED].forEach((t, i) => {
      if (SPECIAL_TILES.includes(t) || t.substring(0, 1) === 'e') {
        tilesToMove.push(i);
      }
    });
    moveTile(tilesToMove, DISCARDED, POOL);
    updateMordor(!mordor);
  }

  function resetFn() {
    discard();
    reset();
  }

  return (
    <div className="App">
      <div className='pure-menu pure-menu-horizontal app-header'>
        <ul className='pure-menu-list'>
          <li className='pure-menu-item'><button onClick={ () => updateShowResetDialog(true)}>Reset</button></li>
        </ul>
      </div>
      <ConfirmationDialog resetFn={resetFn} show={showResetDialog} hideFn={() => updateShowResetDialog(false)} />
      <div className='current-tile'>
        <HuntTile tile={currentTile} large={true} />
        <div className='set-aside-tiles' style={{display: setAsideTiles.length > 0 ? 'block' : 'none' }}>
          <h5>Set Aside Tiles</h5>
          <div className='container' role='group'>
            {setAsideTiles.map((t, i) => 
              <div key={i} className='set-aside-tile'>
                <HuntTile tile={t} />
                <button className={buttonClasses({small: true})} onClick={() => moveTile(i, SETASIDE, POOL)}>Hunt Pool</button>
                <button className={buttonClasses({small: true})} onClick={() => moveTile(i, SETASIDE, REMOVED)}>Remove</button>
              </div>)}
          </div>
        </div>
      </div>
      <div className='buttons' role='group'>
        <button className={buttonClasses({disable: currentTile, draw: true})} onClick={() => draw()}>Draw Tile</button>
        <div>
          <button className={buttonClasses({disable: !currentTile, small: true})} onClick={() => discard()}>Discard</button>
          <button className={buttonClasses({disable: !currentTile, small: true})} onClick={() => setAside()}>Set Aside</button>
          <button className={buttonClasses({disable: mordor, small: true, mordor})} onClick={() => enterMordor()}>{mordor ? 'In' : 'Enter'} Mordor</button>
        </div>
      </div>
      <button className={buttonClasses()} onClick={() => setTilesOpen(!specialTilesOpen)}>Add Special Tile</button>
      <div className='special-tiles' role='group' style={{display: specialTilesOpen ? 'block' : 'none' }}>
        {
          SPECIAL_TILES.map((t) =>
            <button
              key={`special${t}`}
              className={buttonClasses({disable: !tileGroups[REMOVED].includes(t)})}
              onClick={() => specialTileButtonClick(tileGroups[REMOVED].findIndex(i => i === t))}
            ><HuntTile tile={t} small={true} /></button>
          )
        }
      </div>
      <div className='tile-groups'>
      <pre>{/*JSON.stringify(tileGroups, null, 2)*/}</pre>
      </div>
    </div>
  );
}

export default App;
