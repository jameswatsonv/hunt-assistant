import React from 'react';
import cx from 'classnames';
import onClickOutside from 'react-onclickoutside';
import SpecialTileToggles from './SpecialTileToggles';

class  OptionsMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  handleClickOutside() {
    this.props.updateState({ optionsOpen: false });
  }
  render() {
    const { optionsOpen, inMordor, addSpecialTile, isSpecialTileAdded, enterMordor, confirmReset, updateState } = this.props;
    return (
      <div className={cx('m-options', {'open' : optionsOpen})}>
        <div className='m-options-btn' onClick={() => updateState({ optionsOpen: !optionsOpen })}>Options</div>
        <div className={cx('m-options-menu', {'open' : optionsOpen})}>
          <h4>Options Menu</h4>
          <h5>Special Tiles</h5>
          <SpecialTileToggles
            addSpecialTile={addSpecialTile}
            isSpecialTileAdded={isSpecialTileAdded}
            smallViewport={true} />
          <h5>Mordor</h5>
          <button className='pure-button shadow mordor-btn' disabled={inMordor} onClick={enterMordor}>{ inMordor ? 'FSP in Mordor' : 'Enter Mordor' }</button>
          <h5>Reset App</h5>
          <button className='pure-button' onClick={confirmReset}>Reset</button>
        </div>
      </div>
    );
  }
}

export default onClickOutside(OptionsMenu);
