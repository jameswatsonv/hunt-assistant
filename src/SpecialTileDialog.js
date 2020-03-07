import React from 'react';
import './css/SpecialTileDialog.css';

import { SPECIAL_TILES, REMOVED } from './constants';
import HuntTile from './HuntTile';

const inMordorMessage = 'This tile will be added directly to the Hunt Pool.';
const notInMorderMessage = 'This tile will be added to the Discarded group. It will be automatically added to the Hunt Pool when "Enter Mordor" is pressed.';

function SpecialTileDialog({ show, hideFn, state: { [REMOVED]: removedTiles, mordor }, btnClasses, specialTileButtonClick}) {
    return <div className='special-tile-dialog' style={{display: show ? 'block' : 'none'}}>
      <h3>Choose a Special Tile to add</h3>
      <p>{mordor ? inMordorMessage : notInMorderMessage}</p>
      <div className='special-tiles' role='group'>
      {
        SPECIAL_TILES.map((t) =>
        <div className='tile-wrapper' key={`special${t}`}>
          <button
          className={btnClasses({disable: !removedTiles.includes(t)})}
          onClick={() => specialTileButtonClick(removedTiles.findIndex(i => i === t))}
        ><HuntTile tile={t} small={true} /></button></div>
        )
      }
      </div>
      <button className='pure-button' onClick={() => hideFn()}>Cancel</button>
    </div>;
}

export default SpecialTileDialog;