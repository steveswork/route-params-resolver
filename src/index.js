import isObject from 'lodash.isobject';

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
	!pathParamNamesMemo.has( routePath ) &&
		pathParamNamesMemo.put(
			routePath, getRouteParams(
				rmvPatternInfo( routePath )
			)
		);
	const args = routeArgs.map( arg => (
		isObject( arg )
			? JSON.stringify( arg )
			: arg
	) );
	const routeInfoString = JSON.stringify(
		{ routePath, args }, ( k, v ) => (
			typeof v === 'undefined'
				? 'undefined'
				: v
		)
	);
	!uriMemo.has( routeInfoString ) && uriMemo.put(
		routeInfoString, trimUri( route2Uri(
			rmvPatternInfo( routePath ),
			pathParamNamesMemo.get( routePath ),
			args
		) )
	);
	return uriMemo.get( routeInfoString );
};

export default resolve;

/** @typedef {import("./helpers").ArgType} ArgType */
