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
				close: pos,
				open: openParensStack.pop()
			};
		}
	}
	return null;
};

/**
 * Strips all url param regex substrings from the route path
 *
 * @param {string} routePath
 * @returns {PathInfo}
 */
const extractPathInfo = routePath => {
	let path = routePath.slice();
	const patterns = [];
	const openParensStack = [];
	let cursorPos = 0;
	do {
		const closedSegmentRange = manageParensStack( path, cursorPos, openParensStack );
		if( closedSegmentRange === null ) { return { path, patterns } }
		const { close, open } = closedSegmentRange;
		const value = `${ path.slice( open, close ) }`;
		patterns.push({
			posInRoute: routePath.indexOf( value, open ) + 1,
			value: value.slice( 1 )
		});
		path = `${ path.slice( 0, open ) }${ path.slice( close + 1 ) }`
		cursorPos = open;
	} while( true );
};

export default extractPathInfo;

/** @typedef {import("../helpers").TopStackBlock} TopStackBlock */

/**
 * @typedef {{
 * 	path: string,
 * 	patterns: Array<{
 * 		posInRoute: number,
 * 		value: string
 * 	}>
 * }} PathInfo
 */
