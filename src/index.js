import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';

import TimedMap from '@webkrafters/timed-map';

import extractPathInfo from './utils/extract-path-info';
import {
	applyRegexValidation,
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
	/** @type {PathInfo} */ let info;
	if( !pathParamNamesMemo.has( routePath ) ) {
		info = extractPathInfo( routePath );
		pathParamNamesMemo.put(
			routePath,
			getRouteParams( info.path )
		);
	}
	const args = routeArgs.map( arg => (
		isObject( arg )
			? JSON.stringify( arg )
			: !isString( arg )
				? `${ arg }`
				: arg
	) );
	info = info || extractPathInfo( routePath );
	const paramNames = pathParamNamesMemo.get( routePath );
	applyRegexValidation( routePath, info, paramNames, args );
	const routeInfoString = JSON.stringify({ routePath, args });
	!uriMemo.has( routeInfoString ) && uriMemo.put(
		routeInfoString, trimUri( route2Uri(
			info.path, paramNames, args
		) )
	);
	return uriMemo.get( routeInfoString );
};

export default resolve;

/** @typedef {import("./helpers").ArgType} ArgType */
/** @typedef {import("./utils/extract-path-info").PathInfo} PathInfo */
