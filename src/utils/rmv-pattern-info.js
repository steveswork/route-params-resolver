/**
 * Reads the `path` string starting from `start`, populates
 * `openParensStack` array with indexes of all open parens
 * found within a top parens block, and returns the boundary
 * of first closed segment found within the block.
 *
 * -Mutates the `openParensStack` parameter
 *
 * @param {string} path
 * @param {number} start
 * @param {number[]} openParensStack
 * @returns {TopStackBlock}
 */
const manageParensStack = ( path, start, openParensStack ) => {
	for( let pos = start; pos < path.length; pos++ ) {
		if( path[ pos ] === '(' ) {
			openParensStack.push( pos );
			continue;
		}
		if( path[ pos ] === ')' && openParensStack.length ) {
			return {
				topCloseParenPos: pos,
				topOpenParensPos: openParensStack.pop()
			};
		}
	}
	return null;
};

/**
 * @param {string} routePath
 * @returns {string}
 */
const rmvPatternInfo = routePath => {
	let path = routePath.slice();
	const openParensStack = [];
	let cursorPos = 0;
	do {
		const closedSegmentRange = manageParensStack( path, cursorPos, openParensStack );
		if( closedSegmentRange === null ) {
			return path;
		}
		const {
			topCloseParenPos: close,
			topOpenParensPos: open
		} = closedSegmentRange;
		cursorPos = open;
		path = `${ path.slice( 0, open ) }${ path.slice( close + 1 ) }`
	} while( true );
};

export default rmvPatternInfo;

/** @typedef {import("../helpers").TopStackBlock} TopStackBlock */