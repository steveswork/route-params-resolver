import { PathInfo } from '.';

const DANGLING_RANGE_PARAM_CONNECTOR_PATTERN = /[\.\-]$/;
const ROUTE_PARAM_GLOBAL_PATTERN = /:[^:\/]+/g;
const UNDEFINED_URI_ENDINGS_PATTERN = (
	/\/(undefined|undefined-undefined|undefined\.undefined)\/*$/
);
const VARIADIC_PATTERN = /\/\*\s*$/;

export function applyRegexValidation(
	routePath : string,
	info : PathInfo,
	params : Array<string>,
	args : Array<string>
) {
	let pIndex = 0;
	while( info.patterns.length ) {
		const pInfo = info.patterns.shift();
		for( const aLen = args.length, pLen = params.length; pIndex < pLen && pIndex < aLen; pIndex++ ) {
			let pName = `/${ params[ pIndex ] }`;
			const isOptional = pName.endsWith( '?' )
			if( isOptional ) { pName = pName.slice( 0, -1 ) }
			const prefix = routePath.slice( 0, pInfo.posInRoute );
			if( !prefix.endsWith( `${ pName }(` ) ) { continue }
			const arg = args[ pIndex ];
			if( isOptional && arg === 'undefined' ) {
				pIndex++;
				break;
			}
			let pVal = pInfo.value;
			if( !pVal.startsWith( '^' ) ) { pVal = `^${ pVal }` }
			if( !pVal.endsWith( '$' ) ) { pVal = `${ pVal }$` }
			if( new RegExp( pVal ).test( arg ) ) {
				pIndex++;
				break;
			}
			throw new Error( `RegExp validation failed for param ${ params[ pIndex ] }.` );
		}
	}
}

export const getRouteParams = ( routePath : string ) : Array<string> => ((
	routePath.match( ROUTE_PARAM_GLOBAL_PATTERN ) || []
).map( p => DANGLING_RANGE_PARAM_CONNECTOR_PATTERN.test( p )
	? p.slice( 0, p.length - 1 )
	: p
) );

export function route2Uri(
	routePath : string,
	params : Array<string>,
	args : Array<string>
) {
	const _args = args.slice();
	let path = routePath;
	_args.length = params.length;
	for( let p = 0; p < _args.length; p++ ) {
		path = path.replace( params[ p ], _args[ p ] );
	}
	const pathLen = path.length;
	path = path.replace( VARIADIC_PATTERN, '' );
	return path.length !== pathLen && args.length > params.length
		? `${ path }/${ args.slice( params.length ).join( '/' ) }`
		: path;
}

/** Removes all `undefined` path endings */
export function trimUri( uri : string ) {
	let _uri = uri.replace( /\/+$/, '' );
	while( true ) {
		const exUri = _uri;
		_uri = _uri.replace( UNDEFINED_URI_ENDINGS_PATTERN, '' );
		if( exUri === _uri ) {
			break;
		}
	}
	return _uri;
}
