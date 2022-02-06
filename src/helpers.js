const ROUTE_PARAM_GLOBAL_PATTERN = /:[^:\/]+/g;
const DANGLING_RANGE_PARAM_CONNECTOR_PATTERN = /[\.\-]$/;
const UNDEFINED_URI_ENDINGS_PATTERN = (
	/\/(undefined|undefined-undefined|undefined\.undefined)\/*$/
);

/** @type {(routePath: string) => string[]} */
export const getRouteParams = routePath => ((
	routePath.match( ROUTE_PARAM_GLOBAL_PATTERN ) || []
).map( p => DANGLING_RANGE_PARAM_CONNECTOR_PATTERN.test( p )
	? p.slice( 0, p.length - 1 )
	: p
) );

/**
 * @param {string} routePath
 * @param {string[]} params
 * @param {ArgType[]} args
 * @returns {string}
 */
export const route2Uri = ( routePath, params, args ) => {
	const _args = args.slice();
	let path = routePath;
	_args.length = params.length;
	for( let p = 0; p < _args.length; p++ ) {
		path = path.replace( params[ p ], _args[ p ] );
	}
	return path;
};

/**
 * Removes all `undefined` path endings
 *
 * @type {(uri: string) => string}
 */
export const trimUri = uri => {
	let _uri = uri.replace( /\/+$/, '' );
	while( true ) {
		const exUri = _uri;
		_uri = _uri.replace( UNDEFINED_URI_ENDINGS_PATTERN, '' );
		if( exUri === _uri ) {
			break;
		}
	}
	return _uri;
};

/** @typedef {*} ArgType */

/**
 * @typedef {{
 * 		close: number,
 * 		open: number
 * }} TopStackBlock
 */
