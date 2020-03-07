import React, { useState, useReducer } from 'react';
import cx from 'classnames';
import './App.css';

import {
  SPECIAL_TILES,
  REMOVED,
  SETASIDE,
  DISCARDED,
  POOL,
  CURRENT
} from './constants';
import HuntTile from './HuntTile';
import ConfirmationDialog from './ConfirmationDialog';
import { reducer, initialState, init } from './reducer';
import SpecialTileDialog from './SpecialTileDialog';
import PoolBrowser from './PoolBrowser';

const btnClasses = ({disable, small, draw, mordor} = {}) => cx('pure-button', {
  'pure-button-disabled': disable,
  'small': small,
  'draw-button': draw,
  'in-mordor': mordor,
});

function App() {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const [specialTilesOpen, setTilesOpen] = useState(false);
  const [showResetDialog, updateShowResetDialog] = useState(false);
  const {
    [SETASIDE]: setAsideTiles,
    [CURRENT]: currentTile,
    mordor
  } = state;

  const moveTileButtonClick = (tileIndex, fromGroup, toGroup) => {
    dispatch({type: 'move', indecesToMove: [tileIndex], fromGroup, toGroup});
  };

  const specialTileButtonClick = tileIndex => {
    moveTileButtonClick(tileIndex, REMOVED, mordor ? POOL : DISCARDED);
    setTilesOpen(false);
  };

  function enterMordor() {
    // move eyes and special tiles from discarded to pool
    const tilesToMove = [];
    state[DISCARDED].forEach((t, i) => {
      if (SPECIAL_TILES.includes(t) || t.substring(0, 1) === 'e') {
        tilesToMove.push(i);
      }
    });
    dispatch({type: 'enter-mordor', indecesToMove: tilesToMove, fromGroup: DISCARDED, toGroup: POOL});
  }

  return (
    <div className="App">
      <div className='pure-menu pure-menu-horizontal app-header'>
        <ul className='pure-menu-list'>
          <li className={cx('pure-menu-item', {'pure-menu-selected': showResetDialog})}><button onClick={ () => updateShowResetDialog(true)}>Reset</button></li>
          <li className={cx('pure-menu-item', {'pure-menu-selected': specialTilesOpen})}><button onClick={ () => setTilesOpen(!specialTilesOpen)}>Add Special Tile</button></li>
        </ul>
      </div>
      <ConfirmationDialog
        show={showResetDialog}
        hideFn={() => updateShowResetDialog(false)}
        resetFn={() => dispatch({type: 'reset'})}
        />
      <SpecialTileDialog
        show={specialTilesOpen}
        hideFn={() => setTilesOpen(false)}
        state={state}
        btnClasses={btnClasses}
        specialTileButtonClick={specialTileButtonClick}
        />
      <div className='current-tile'>
        <HuntTile tile={currentTile} large={true} />
        <div className='set-aside-tiles' style={{display: setAsideTiles.length > 0 ? 'block' : 'none' }}>
          <h5>Set Aside Tiles</h5>
          <div className='container' role='group'>
            {setAsideTiles.map((t, i) => 
              <div key={i} className='set-aside-tile'>
                <HuntTile tile={t} />
                <button className={btnClasses({small: true})} onClick={() => dispatch({type: 'move', indecesToMove: [i], fromGroup: SETASIDE, toGroup: POOL})}>Hunt Pool</button>
                <button className={btnClasses({small: true})} onClick={() => dispatch({type: 'move', indecesToMove: [i], fromGroup: SETASIDE, toGroup: REMOVED})}>Remove</button>
              </div>)}
          </div>
        </div>
      </div>
      <div className='main-buttons' role='group'>
        <button className={btnClasses({disable: currentTile, draw: true})} onClick={() => dispatch({type: 'draw'})}>Draw Tile</button>
        <div>
          <button className={btnClasses({disable: !currentTile, small: true})} onClick={() => dispatch({type: 'discard'})}>Discard</button>
          <button className={btnClasses({disable: !currentTile, small: true})} onClick={() => setAsideTiles.length < 4 && dispatch({type: 'set-aside'})}>Set Aside</button>
          <button className={btnClasses({disable: mordor, small: true, mordor})} onClick={() => enterMordor()}>{mordor ? 'In' : 'Enter'} Mordor</button>
        </div>
      </div>
      <div className='tile-groups'>
      <PoolBrowser
        state={state}
        btnClasses={btnClasses}
        moveTileButtonClick={moveTileButtonClick}
        />
      {/* <pre>{JSON.stringify(tiles, null, 2)}</pre> */}
      </div>
    </div>
  );
}

export default App;
