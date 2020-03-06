import React, { useState, useCallback, useReducer } from 'react';
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
import { reducer, initialState } from './tileGroups';

const buttonClasses = ({disable, small, draw, mordor} = {}) => cx('pure-button', {
  'pure-button-disabled': disable,
  'small': small,
  'draw-button': draw,
  'in-mordor': mordor,
});

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mordor, updateMordor] = useState(false);
  const [specialTilesOpen, setTilesOpen] = useState(false);
  const [showResetDialog, updateShowResetDialog] = useState(false);
  const setAsideTiles = state[SETASIDE];
  const currentTile = state[CURRENT];

  const specialTileButtonClick = useCallback(tileIndex => {
    dispatch({type: 'move', indecesToMove: [tileIndex], fromGroup: REMOVED, toGroup: mordor ? POOL : DISCARDED})
    setTilesOpen(false);
  }, [mordor]);

  function enterMordor() {
    // move eyes and special tiles from discarded to pool
    const tilesToMove = [];
    state[DISCARDED].forEach((t, i) => {
      if (SPECIAL_TILES.includes(t) || t.substring(0, 1) === 'e') {
        tilesToMove.push(i);
      }
    });
    dispatch({type: 'move', indecesToMove: tilesToMove, fromGroup: DISCARDED, toGroup: POOL});
    updateMordor(true);
  }

  function resetFn() {
    dispatch({type: 'discard'});
    dispatch({type: 'reset'});
  }

  return (
    <div className="App">
      <div className='pure-menu pure-menu-horizontal app-header'>
        <ul className='pure-menu-list'>
          <li className='pure-menu-item'><button onClick={ () => updateShowResetDialog(true)}>Reseti</button></li>
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
                <button className={buttonClasses({small: true})} onClick={() => dispatch({type: 'move', indecesToMove: [i], fromGroup: SETASIDE, toGroup: POOL})}>Hunt Pool</button>
                <button className={buttonClasses({small: true})} onClick={() => dispatch({type: 'move', indecesToMove: [i], fromGroup: SETASIDE, toGroup: REMOVED})}>Remove</button>
              </div>)}
          </div>
        </div>
      </div>
      <div className='buttons' role='group'>
        <button className={buttonClasses({disable: currentTile, draw: true})} onClick={() => dispatch({type: 'draw'})}>Draw Tile</button>
        <div>
          <button className={buttonClasses({disable: !currentTile, small: true})} onClick={() => dispatch({type: 'discard'})}>Discard</button>
          <button className={buttonClasses({disable: !currentTile, small: true})} onClick={() => setAsideTiles.length < 3 && dispatch({type: 'set-aside'})}>Set Aside</button>
          <button className={buttonClasses({disable: mordor, small: true, mordor})} onClick={() => enterMordor()}>{mordor ? 'In' : 'Enter'} Mordor</button>
        </div>
      </div>
      <button className={buttonClasses()} onClick={() => setTilesOpen(!specialTilesOpen)}>Add Special Tile</button>
      <div className='special-tiles' role='group' style={{display: specialTilesOpen ? 'block' : 'none' }}>
        {
          SPECIAL_TILES.map((t) =>
            <button
              key={`special${t}`}
              className={buttonClasses({disable: !state[REMOVED].includes(t)})}
              onClick={() => specialTileButtonClick(state[REMOVED].findIndex(i => i === t))}
            ><HuntTile tile={t} small={true} /></button>
          )
        }
      </div>
      <div className='tile-groups'>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
