import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { STARTING_HUNT_POOL } from './hunt_tiles.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('initializes state correctly', () => {
  const app = new App();
  expect(app.state.pool).toEqual(STARTING_HUNT_POOL);
  expect(app.state.discarded).toEqual([]);
  expect(app.state.removed).toEqual([]);
  expect(app.state.setAside).toEqual([]);
  expect(app.state.current).toBeNull()
});

it('draws a tile', () => {
  const wrapper = mount(<App />);
  wrapper.getNode().drawTile();
  expect(wrapper.state().current).not.toBeNull();
});

it('discards the current tile with the discard button', () => {
  const wrapper = mount(<App />);
  wrapper.getNode().drawTile();
  wrapper.find('.controls .discard-button').simulate('click');
  expect(wrapper.state().discarded.length).toEqual(1);
});

it('sets aside the current tile with the set aside button', () => {
  const wrapper = mount(<App />);
  wrapper.getNode().drawTile();
  wrapper.find('.controls .set-aside-button').simulate('click');
  expect(wrapper.state().setAside.length).toEqual(1);
});