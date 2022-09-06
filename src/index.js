import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';

import TimedMap from '@webkrafters/timed-map';

import rmvPatternInfo from './utils/rmv-pattern-info';
import {
	getRouteParams,
	route2Uri,
	trimUri
} from './helpers';

const pathParamNamesMemo = new TimedMap();
const uriMemo = new TimedMap();

/**
 * @param {string} routePath
 * @param {...ArgType} routeArgs
 * @returns {string}
 */
const resolve = ( routePath, ...routeArgs ) => {
	let routePathNoPattern;
	if( !pathParamNamesMemo.has( routePath ) ) {
		routePathNoPattern = rmvPatternInfo( routePath );
		pathParamNamesMemo.put( routePath, getRouteParams(
			routePathNoPattern
		) );
	}
	const args = routeArgs.map( arg => (
		isObject( arg )
			? JSON.stringify( arg )
			: !isString( arg )
				? `${ arg }`
				: arg
	) );

	const routeInfoString = JSON.stringify({ routePath, args });

	!uriMemo.has( routeInfoString ) && uriMemo.put(
		routeInfoString, trimUri( route2Uri(
			routePathNoPattern || rmvPatternInfo( routePath ),
			pathParamNamesMemo.get( routePath ),
			args
		) )
	);
	return uriMemo.get( routeInfoString );
};

export default resolve;

/** @typedef {import("./helpers").ArgType} ArgType */
