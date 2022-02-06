import resolve from '../src';

const INPUT_LIST = Object.freeze([{
	args: [],
	path: '/test/demo',
	test: 1,
	uri: '/test/demo'
}, {
	args: [],
	path: '/test/demo/',
	test: 2,
	uri: '/test/demo'
}, {
	args: [ 1, 2, 3 ],
	path: '/test/demo',
	test: 3,
	uri: '/test/demo'
}, {
	args: [ 1, 2, 3 ],
	path: '/test/demo/',
	test: 4,
	uri: '/test/demo'
}, {
	args: [ 1, 2, 3, 4 ],
	path: '/test/demo/:first/:second.:third/:fourth',
	test: 5,
	uri: '/test/demo/1/2.3/4'
}, {
	args: [ 1, null, null, null ],
	path: '/test/demo/:first/:second/:third/:fourth',
	test: 6,
	uri: '/test/demo/1/null/null/null'
}, {
	args: [ 1 ],
	path: '/test/demo/:first/:second/:third/:fourth',
	test: 7,
	uri: '/test/demo/1'
}, {
	args: [ 1, undefined, undefined, undefined ],
	path: '/test/demo/:first/:second/:third/:fourth',
	test: 8,
	uri: '/test/demo/1'
}, {
	args: [ 1, null, null, null ],
	path: '/test/demo/:first/:second/:third/:fourth',
	test: 9,
	uri: '/test/demo/1/null/null/null'
}, {
	args: [ undefined, null, undefined, undefined, undefined ],
	path: '/test/demo/:first/:second/:third/:fourth',
	test: 10,
	uri: '/test/demo/undefined/null'
}, {
	args: [ 1, null, 3, { a: 'b' }, undefined ],
	path: '/test/demo/:first/:second([a-f0-9])/:third([A-Za-z]{24})?/:fourth',
	test: 11,
	uri: '/test/demo/1/null/3/{"a":"b"}'
}, {
	args: [ [ 1, 2, 3 ], new Date( 1643935827014 ), true ],
	path: '/test/demo/:first/:second/:third',
	test: 12,
	uri: '/test/demo/[1,2,3]/"2022-02-04T00:50:27.014Z"/true'
}]);

describe( 'RouteParamsResolver', () => {
	test.concurrent.each( INPUT_LIST.map(
		({ args, path, test, uri }) => [ test, path, args, uri ]
	) )(
		'TEST #%i: resolve(%s, ...%s) => %s',
		async ( test, path, args, uri ) => {
			expect( resolve( path, ...args ) ).toEqual( uri )
		}
	);
});
