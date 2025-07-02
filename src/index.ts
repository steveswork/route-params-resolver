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



export interface PatternInfo {
	posInRoute : number;
	value : string;
}

export interface PathInfo {
	path : string,
	patterns: Array<PatternInfo>
}

export type ArgType = unknown;
export interface TopStackBlock {
	close : number;
	open : number;
}

function resolve(
	routePath : string,
	...routeArgs : Array<ArgType>
) : string {
	let info : PathInfo;
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
				: arg as string
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

