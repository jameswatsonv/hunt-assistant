export const INITIAL_TILES = ['3', '3', '3', '2', '2', '1', '1', 'er', 'er', 'er', 'er', '2r', '1r', '1r', '0r', '0r'];
export const BLUE_SPECIAL_TILES = ['0_a', '0_b', '1-', '2-'];
export const RED_SPECIAL_TILES = ['1rs', '3s', 'Ss', 'ers'];
export const SPECIAL_TILES = BLUE_SPECIAL_TILES.concat(RED_SPECIAL_TILES);
export const SPECIAL_TILE_LABELS = {};

export const REMOVED = 'removed';
export const SETASIDE = 'setAside';
export const DISCARDED = 'discarded';
export const POOL = 'huntPool';
export const CURRENT = 'current';
export const POOL_LABELS = {
    [REMOVED]: 'Removed',
    [DISCARDED]: 'Discarded',
    [POOL]: 'Hunt Pool',
};