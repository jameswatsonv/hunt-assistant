import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
import HuntTile from './HuntTile.js';
import { STARTING_HUNT_POOL, SPECIAL_TILES } from './hunt_tiles.js';

function supportsLocalStorage() {
  const mod = 'test';
  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch (e) {
    return false;
  } 
}
function getInitialState() {
  return {
    pool: STARTING_HUNT_POOL.slice(),
    discarded: [],
    removed: [],
    setAside: [],
    current: null,
    inMordor: false,
  };
}
function serialize(obj) {
  return JSON.stringify(obj);
}
function parse(obj) {
  return JSON.parse(obj);
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = getInitialState();

    this.drawTile = this.drawTile.bind(this);
    this.appendFromCollection = this.appendFromCollection.bind(this);
    this.addSpecialTile = this.addSpecialTile.bind(this);
    this.isSpecialTileAdded = this.isSpecialTileAdded.bind(this);
    this.enterMordor = this.enterMordor.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentWillMount() {
    window.addEventListener('keydown', this.handleKeyDown, true);

    if (supportsLocalStorage() && localStorage.getItem('state')) {
      this.setState(parse(localStorage.getItem('state')));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown, true);
  }

  updateState(state) {
    this.setState(state, () => {
      localStorage.setItem('state', serialize(this.state))
    });
  }

  handleKeyDown(e) {
    const { current } = this.state;
    // D = draw tile
    if (e.keyCode === 68) {
      this.drawTile();
    }
    // A = set aside current tile
    if (e.keyCode === 65 && current) {
      this.appendFromCollection('current', null, 'setAside');
    }
    // C = discard current tile
    if (e.keyCode === 67 && current) {
      this.appendFromCollection('current', null, 'discarded');
    }
    // M = enter mordor
    if (e.keyCode === 77) {
      this.enterMordor();
    }
    // P = reset
    if (e.keyCode === 80 && window.confirm('Do you want to reset?')) {
      this.updateState(getInitialState());
    }
  }

  addSpecialTile(tile) {
    let { pool, discarded, inMordor } = this.state;
    const specialTile = [SPECIAL_TILES[tile].value];
    if (inMordor) {
      pool = pool.concat(specialTile);
    } else {
      discarded = discarded.concat(specialTile);
    }
    this.updateState({
      pool,
      discarded,
    });
  }

  isSpecialTileAdded(tile) {
    let tileAdded = false;
    if (this.state.current === tile) {
      tileAdded = true;
    } else {
      _.forEach(
        _.flatten(
          _.values(
            _.pick(this.state, ['pool', 'setAside', 'discarded', 'removed'])
          )
        ),
        t => {
          if (t === tile) tileAdded = true;
        }
      )
    }
    return tileAdded;
  }

  drawTile() {
    const { pool, current } = this.state;
    const drawnTile = _.sample(pool);
    const updatedPool = _.filter(pool, (t, i) => i !== _.indexOf(pool, drawnTile));
    if (drawnTile && _.isNull(current)) {
      this.updateState({
        pool: updatedPool,
        current: drawnTile,
      });
    }
  }

  appendFromCollection(pool, poolIndex, targetPool) {
    const tilePoolContents = pool === 'current' ? null : _.get(this.state, `[${pool}]`).slice();
    const tile = pool === 'current' ? this.state.current : tilePoolContents.splice(poolIndex, 1);
    const targetPoolCurrent = _.get(this.state, `[${targetPool}]`);
    const targetPoolUpdated = targetPoolCurrent ? targetPoolCurrent.concat(tile) : tile[0];

    if ((targetPool === 'setAside' && _.get(this.state, targetPool, []).length >= 3)
        || (targetPool === 'current' && !_.isNull(this.state.current))) {
      return;
    }

    this.updateState({
      [targetPool]: targetPoolUpdated,
      [pool]: tilePoolContents,
    });
  }

  enterMordor() {
    let discarded = this.state.discarded;
    const tilesToMove = _.reduce(discarded, (r, t, k) => {
      if (SPECIAL_TILES[t] || t === 'Er') {
        r[k] = t;
      }
      return r;
    }, {});
    discarded = _.pull(discarded, ..._.values(tilesToMove));
    const pool = this.state.pool.concat(_.values(tilesToMove));
    this.updateState({
      discarded,
      pool,
      inMordor: true,
    });
  }

  render() {
    const { pool, discarded, removed, current, inMordor, setAside } = this.state;
    const isCurrentTileSpecial = SPECIAL_TILES[this.state.current];
    return (
      <div className="App">
        <div className="App-header">
          <h2>WOTR Hunt Pool</h2>
        </div>
        <div className='main-sections pure-g'>
          <div className='pure-u-7-24'>
            <HuntPools
              pool={pool}
              discarded={discarded}
              removed={removed}
              appendFromCollection={this.appendFromCollection} />
            <h4>Special Tiles:</h4>
            <SpecialTileToggles
              addSpecialTile={this.addSpecialTile}
              isSpecialTileAdded={this.isSpecialTileAdded} />
          </div>
          <div className='pure-u-10-24 current-tile'>
            <HuntTile tile={this.state.current} big={true} />
            { 
              isCurrentTileSpecial ? <div className={`current-tile-name ${isCurrentTileSpecial.special}`}>
                { isCurrentTileSpecial.name }
              </div> : null
            }
            <MainControls
              current={current}
              inMordor={inMordor}
              drawTile={this.drawTile}
              appendFromCollection={this.appendFromCollection}
              enterMordor={this.enterMordor} />
            <p>
              {`You may set aside up to 3 tiles. Click the "Draw Tile" button to draw a tile from the Hunt Pool,
               then either discard it, set it aside, or return it to the hunt pool, depending on the circumstances of your game.`}
            </p>
            <p>
              {`Clicking "Enter Mordor" will move all appropriate tiles from Discarded to Hunt Pool. When in Mordor, all Special Tiles
                are added directly to the Hunt Pool. You may still move tiles around as needed when in Mordor.`}
            </p>
            <p>The following keyboard shortcuts are also available:</p>
            <fieldset>
              <legend>Shortcuts</legend>
              <div><span>D</span> = Draw Tile</div>
              <div><span>C</span> = Discard</div>
              <div><span>A</span> = Set Aside Tile</div>
              <div><span>P</span> = Reset</div>
            </fieldset>
          </div>
          <div className='pure-u-7-24 set-aside'>
            <div className='pure-menu'>
              <ol className='pure-menu-list'>
                {
                  _.flatten(
                    _.map(setAside, (tile, i) => (
                      [
                        <li className='pure-menu-heading' key={i}>Set Aside Tile #{i+1}</li>,
                        <li className='pure-menu-item set-aside-tile' key={i+3}>
                          <div className='pure-g'>
                            <div className="pure-u-1-4">
                              <HuntTile tile={tile} />
                            </div>
                            <div className="pure-u-3-4">
                              <div className='pure-menu set-aside-btns'>
                                <ul className='pure-menu-list'>
                                  <li className='pure-menu-item'>
                                    <button className='pure-button' onClick={() => this.appendFromCollection('setAside', i, 'pool')}>
                                      <i className='fa fa-arrow-left' aria-hidden="true"></i>
                                      Return to Pool
                                    </button>
                                  </li>
                                  <li className='pure-menu-item'>
                                    <button className='pure-button' onClick={() => this.appendFromCollection('setAside', i, 'discarded')}>
                                      <i className="fa fa-trash" aria-hidden="true"></i>
                                      Discard
                                    </button>
                                  </li>
                                  <li className='pure-menu-item'>
                                    <button className='pure-button' onClick={() => this.appendFromCollection('setAside', i, 'removed')}>
                                      <i className="fa fa-ban" aria-hidden="true"></i>
                                      Remove
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </li>                
                      ]
                    ))
                  )
                }
              </ol>  
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const MainControls = ({current, inMordor, drawTile, appendFromCollection, enterMordor}) => (
  <div className='controls'>
    <div className='button-wrap'>
      <button className='pure-button pure-button-large free' disabled={current} onClick={drawTile}>Draw Tile</button>
    </div>
    <button className='pure-button' disabled={!current} onClick={() => appendFromCollection('current', null, 'discarded')}>
      <i className='fa fa-trash' aria-hidden="true"></i>&nbsp;
      Discard
    </button>
    <button className='pure-button' disabled={!current} onClick={() => appendFromCollection('current', null, 'setAside')}>
      Set Aside Tile &nbsp;
      <i className='fa fa-arrow-right' aria-hidden='true'></i>
    </button>
    <div className='draw-button'>
      <button className='pure-button pure-button-large shadow' disabled={inMordor} onClick={enterMordor}>{ inMordor ? 'FSP in Mordor' : 'Enter Mordor' }</button>
    </div>
  </div>
)

// Will need to do some state management for a small viewport version of hunt pool
class HuntPools extends Component {
  render() {
    const { pool, discarded, removed } = this.props;
    const renderTileList = (tiles, name) => (
      <div className='pure-menu pure-menu-horizontal'>
        <ul className='pure-menu-list hunt-tile-list'>
        {
          tiles.length > 0 ?
            _.map(tiles, (t, i) =>
              <li className='pure-menu-item' key={`${name}${i}`}>
                <HuntTile
                  tile={t}
                  withOverlay={true}
                  pool={name}
                  poolIndex={i}
                  appendFromCollection={this.props.appendFromCollection} />
              </li>
            ) : '<Empty>'
        }
        </ul>
      </div>   
    );
    return (
      <div className='pure-menu pools'>
        <ul className='pure-menu-list'>
          <li className='pure-menu-item'>
            <div className='hunt-pool'>
              <h2>Hunt Pool</h2>
              { renderTileList(pool, 'pool') }
            </div>
          </li>
          <li className='pure-menu-item'>
            <div className='discarded-pool'>
              <h3><i className='fa fa-trash fa-lg' /> Discarded</h3>
              { renderTileList(discarded, 'discarded') }
              </div>
          </li>
          <li className='pure-menu-item'>
            <div className='removed-pool'>
              <h3><i className='fa fa-ban fa-lg' /> Removed</h3>
              { renderTileList(removed, 'removed') }
            </div>
          </li>
        </ul>
      </div>
    )
  }
}

const SpecialTileToggles = ({addSpecialTile, isSpecialTileAdded}) => {
  const specialTileKeys = _.keys(SPECIAL_TILES);
  const renderSpecialTileButton = tileInfo => (
    <li className="pure-menu-item" key={`toggle${tileInfo.value}`}>
      <button className={`pure-button tile-button ${tileInfo.special}`} disabled={isSpecialTileAdded(tileInfo.value)} onClick={() => addSpecialTile(tileInfo.value)}>{tileInfo.name}</button>
    </li>
  );
  const specialButtons = {
    fellowship: (
      <div className='pure-menu pure-menu-horizontal'>
        <ul className="pure-menu-list">
          {
            _.map(
              _.range(4),
              i => renderSpecialTileButton(SPECIAL_TILES[specialTileKeys[i]])
            )
          }
        </ul>
      </div>
    ),
    shadow: (
      <div className='pure-menu pure-menu-horizontal'>
        <ul className="pure-menu-list">
          {
            _.map(
              _.range(4, 8),
              i => renderSpecialTileButton(SPECIAL_TILES[specialTileKeys[i]])
            )
          }
        </ul>
      </div>
    )
  };
  return (
    <div className='pure-g special-tile-buttons'>
      <div className='pure-u-1-2'>
        {specialButtons['fellowship']}
      </div>
      <div className='pure-u-1-2'>
        {specialButtons['shadow']}
      </div>
    </div>
  );
}

export default App;
