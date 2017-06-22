import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';

import SpecialTileToggles from './components/SpecialTileToggles.js';
import OptionsMenu from './components/OptionsMenu.js';
import HuntTile from './components/HuntTile.js';
import PoolIcon from './components/PoolIcon.js';
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
    smallViewport: isSmallViewport(),
    tab: 'pool',
    optionsOpen: false,
    appLog: [],
  };
}
function isSmallViewport() {
  return window.matchMedia('screen and (max-width: 48em)').matches;
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
    this.setTab = this.setTab.bind(this);
    this.enterMordor = this.enterMordor.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.checkViewportSize = this.checkViewportSize.bind(this);
    this.confirmReset = this.confirmReset.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    // use component container instead of window?
    if (window) {
      window.addEventListener('resize', this.handleResize, true);
      if (window.document) {
        window.document.addEventListener('keydown', this.handleKeyDown, true);
      }
    }
    if (supportsLocalStorage()) {
      this.localStorageSupported = true;
      if (localStorage.getItem('state')) {
        return this.setState(parse(localStorage.getItem('state')), this.checkViewportSize);
      }
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('resize', this.handleResize, true);
      if (window.document) {
        window.document.removeEventListener('keydown', this.handleKeyDown, true);
      }
    }
  }

  updateState(state) {
    if(this.localStorageSupported) {
      return this.setState(state, () => {
        localStorage.setItem('state', serialize(this.state))
      });
    }
    return this.setState(state);
  }

  checkViewportSize() {
    let { smallViewport } = this.state;
    if (smallViewport && !isSmallViewport()) {
      this.updateState({ smallViewport : false });
    }
    if (!smallViewport && isSmallViewport()) {
      this.updateState({ smallViewport : true });
    }
  }

  handleResize(e) {
    if (!this.resizeTimeout) {
      this.resizeTimeout = window.setTimeout(() => {
       this.resizeTimeout = null;
       this.checkViewportSize();
      }, 125);
    }
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
    if (e.keyCode === 80) {
      this.confirmReset();
    }
  }

  confirmReset() {
    if (window.confirm('Are you sure you want to reset?')) {
      this.updateState(getInitialState());
    }
  }

  addSpecialTile(tile) {
    const targetPool = this.state.inMordor ? 'pool' : 'discarded';

    this.updateState({
      [targetPool]: this.state[targetPool].concat(tile),
    });
  }

  isSpecialTileAdded(tile) {
    return this.state.current === tile ||
      _(this.state)
      .pick(['pool', 'setAside', 'discarded', 'removed'])
      .values()
      .flatten()
      .some(t => t === tile);
  }

  setTab(tab) {
    this.updateState({ tab })
  }

  drawTile() {
    const { pool, current } = this.state;
    const drawnTile = _.sample(pool);
    const tileIndex = _.indexOf(pool, drawnTile);
    if (drawnTile && _.isNull(current)) {
      this.appendFromCollection('pool', tileIndex, 'current');
    }
  }

  appendFromCollection(sourcePool, poolIndex, targetPool) {
    let tile = this.state.current ? [this.state.current] : [];
    let updatedPool = null;
    let updatedTargetPool = (this.state[targetPool] || []).concat(tile);

    // Don't perform invalid operations:
    //  1. Moving to Set Aside list when there are already 3 or more items there
    //  2. Moving an item into Current when there is already an item there
    //  3. Moving an item into its current pool
    if ((targetPool === 'setAside' && _.get(this.state, targetPool, []).length >= 3) ||
        (targetPool === 'current' && !_.isNull(this.state.current)) ||
        (targetPool === sourcePool)) {
      return;
    }

    if (sourcePool !== 'current') {
      updatedPool = this.state[sourcePool].slice();
      tile = updatedPool.splice(poolIndex, 1);
      updatedTargetPool = (this.state[targetPool] || []).concat(tile);
    }
    if (targetPool === 'current') {
      updatedTargetPool = tile[0];
    }

    this.updateState({
      [targetPool]: updatedTargetPool,
      [sourcePool]: updatedPool,
    });
  }

  enterMordor() {
    let { discarded, pool } = this.state;
    const tilesToMove = _.filter(discarded, t => (_.get(SPECIAL_TILES, t) || t === 'Er'));
    discarded = _.without(discarded, ...tilesToMove);
    pool = pool.concat(tilesToMove);

    this.updateState({
      discarded,
      pool,
      inMordor: true,
    });
  }

  render() {
    const { appendFromCollection, setTab, drawTile, enterMordor, addSpecialTile, isSpecialTileAdded, confirmReset, updateState } = this;
    const { current, inMordor, setAside, optionsOpen } = this.state;
    const isCurrentTileSpecial = _.get(SPECIAL_TILES, current, false);
    if (this.state.smallViewport) {
      return (
        <div className='App mobile'>
          <OptionsMenu {...{ optionsOpen, inMordor, enterMordor, addSpecialTile, isSpecialTileAdded, confirmReset, updateState }} />
          <div className='m-button-wrap'>
            <button className='pure-button pure-button-large free' disabled={current} onClick={drawTile}>Draw Tile</button>
          </div>
          <div className='current-tile'>
            <HuntTile
              tile={current}
              big={true}
              smallViewport={true} />
          </div>
          <SpecialTileInfo
            tile={isCurrentTileSpecial}
            smallViewport={true} />
          <div className='m-button-wrap'>
            <button className='pure-button discard-button' disabled={!current} onClick={() => appendFromCollection('current', null, 'discarded')}>
              <PoolIcon pool='discarded' />
              {' '}
              Discard
            </button>
            <button className='pure-button set-aside-button' disabled={!current || setAside.length >= 3} onClick={() => appendFromCollection('current', null, 'setAside')}>
              Set Aside
              {' '}
              <PoolIcon pool='setAside' />
            </button>
          </div>
          <div className='pure-menu pure-menu-horizontal'>
            <ul className='pure-menu-list pure-g m-tab-list'>
              {
                _.map(
                  [
                    { name: 'Hunt Pool', pool: 'pool', cols: '2-5' },
                    { pool: 'discarded', cols: '1-5' },
                    { pool: 'removed', cols: '1-5' },
                    { name: 'Set Aside', pool: 'setAside', cols: '1-5' },
                  ],
                  ({ name, pool, cols }, i) => <li className={`pure-menu-item pure-u-${cols}`} key={`tabs${i}`}>
                      <button className='pure-button' onClick={() => setTab(pool)}>{ pool === 'pool' ? 'Hunt Pool' : <PoolIcon pool={pool} /> } ({this.state[pool].length})</button>
                    </li>,
                )
              }
            </ul>
            <div className='m-tab-tiles pure-menu pure-menu-horizontal'>
              <ul className='pure-menu-list'>
                {
                  _.map(this.state[this.state.tab],
                    (tile, i) => <li className='pure-menu-item' key={`tilepool${i}`}>
                      <HuntTile
                        {...{ tile, appendFromCollection }}
                        smallViewport={true}
                        pool={this.state.tab}
                        poolIndex={i} />
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="App">
        <div className="App-header">
          <h2>WOTR Hunt Pool</h2>
        </div>
        <div className='pure-g'>
          <div className='pure-u-7-24'>
            <HuntPools
              {..._.pick(this.state, ['pool', 'discarded', 'removed'])}
              appendFromCollection={appendFromCollection} />
            <h4>Special Tiles:</h4>
            <SpecialTileToggles
              addSpecialTile={this.addSpecialTile}
              isSpecialTileAdded={this.isSpecialTileAdded} />
          </div>
          <div className='pure-u-10-24'>
            <div className='current-tile'>
              <HuntTile
                tile={current}
                big={true} />
              <SpecialTileInfo tile={isCurrentTileSpecial} />
              <MainControls
                {...{current, inMordor, setAside, appendFromCollection}}
                drawTile={this.drawTile}
                enterMordor={this.enterMordor} />
              <HelpText />
            </div>
          </div>
          <div className='pure-u-7-24'>
            <SetAsideTiles
              tiles={setAside}
              appendFromCollection={appendFromCollection} />
          </div>
        </div>
      </div>
    );
  }
}
const SpecialTileInfo = ({tile, smallViewport}) => (
  tile ?
    <div className={['current-tile-name', tile.special, smallViewport ? 'small-viewport' : ''].join(' ')}>
      { tile.name }
    </div> : null
);
class SetAsideTiles extends Component {
  render() {
    const { tiles, appendFromCollection } = this.props;
    return (
      <div className='pure-menu set-aside'>
        <ol className='pure-menu-list'>
          {
            _.flatten(
              _.map(tiles, (tile, i) => (
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
                              <button className='pure-button' onClick={() => appendFromCollection('setAside', i, 'pool')}>
                                <PoolIcon pool='pool' />
                                Return to Pool
                              </button>
                            </li>
                            <li className='pure-menu-item'>
                              <button className='pure-button' onClick={() => appendFromCollection('setAside', i, 'discarded')}>
                                <PoolIcon pool='discarded' />
                                Discard
                              </button>
                            </li>
                            <li className='pure-menu-item'>
                              <button className='pure-button' onClick={() => appendFromCollection('setAside', i, 'removed')}>
                                <PoolIcon pool='removed' />
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
    )
  }
}

const HelpText = () => (
  <div className='help-text'>
    <p>
      You may set aside up to 3 tiles. Click the "Draw Tile" button to draw a tile from the Hunt Pool,
       then either discard it, set it aside, or return it to the hunt pool, depending on the circumstances of your game.
    </p>
    <p>
      Special tiles are added to Discarded by default to help players keep track of which have entered play.
      Clicking "Enter Mordor" will move all appropriate tiles from Discarded to Hunt Pool. When in Mordor, all Special Tiles
      are added directly to the Hunt Pool. You may still move tiles around as needed when in Mordor.
    </p>
    <p>
      If your browser supports <a href='https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'>LocalStorage</a>,
      then your settings will be preserved on subsequent page loads.
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
)

const MainControls = ({current, setAside, inMordor, drawTile, appendFromCollection, enterMordor}) => (
  <div className='controls'>
    <div className='button-wrap'>
      <button className='pure-button pure-button-large free' disabled={current} onClick={drawTile}>Draw Tile</button>
    </div>
    <button className='pure-button discard-button' disabled={!current} onClick={() => appendFromCollection('current', null, 'discarded')}>
      <PoolIcon pool='discarded' />
      {' '}
      Discard
    </button>
    <button className='pure-button set-aside-button' disabled={!current || setAside.length >= 3} onClick={() => appendFromCollection('current', null, 'setAside')}>
      Set Aside
      {' '}
      <PoolIcon pool='setAside' />
    </button>
    <div className='draw-button'>
      <button className='pure-button pure-button-large shadow' disabled={inMordor} onClick={enterMordor}>{ inMordor ? 'FSP in Mordor' : 'Enter Mordor' }</button>
    </div>
  </div>
)

// Will need to do some state management for a small viewport version of hunt pool
class HuntPools extends Component {
  render() {
    const props = this.props;
    const renderTileList = tilePool => (
      <div className='pure-menu pure-menu-horizontal'>
        <ul className='pure-menu-list hunt-tile-list'>
        {
          props[tilePool].length > 0 ?
            _.map(props[tilePool], (t, i) =>
              <li className='pure-menu-item' key={`tilepool${i}`}>
                <HuntTile
                  tile={t}
                  withOverlay={true}
                  pool={tilePool}
                  poolIndex={i}
                  appendFromCollection={props.appendFromCollection} />
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
              { renderTileList('pool') }
            </div>
          </li>
          <li className='pure-menu-item'>
            <div className='discarded-pool'>
              <h3><PoolIcon pool='discarded' big={true} /> Discarded</h3>
              { renderTileList('discarded') }
              </div>
          </li>
          <li className='pure-menu-item'>
            <div className='removed-pool'>
              <h3><PoolIcon pool='removed' big={true} /> Removed</h3>
              { renderTileList('removed') }
            </div>
          </li>
        </ul>
      </div>
    )
  }
}

export default App;
