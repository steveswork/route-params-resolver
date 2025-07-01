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
	path: '/test/demo/:first/:second([A-Za-z]{3,})/:third([a-f0-9])?/:fourth',
	test: 11,
	uri: '/test/demo/1/null/3/{"a":"b"}'
}, {
	args: [ [ 1, 2, 3 ], new Date( 1643935827014 ), true ],
	path: '/test/demo/:first/:second/:third',
	test: 12,
	uri: '/test/demo/[1,2,3]/"2022-02-04T00:50:27.014Z"/true'
}, {
	args: [ 1, 2, 3, 4, 5 ],
	path: '/test/demo/:first/:second/*',
	test: 13,
	uri: '/test/demo/1/2/3/4/5'
}, {
	args: [ 1, 2, 3, 4, 5 ],
	path: '/test/demo/:first/*/test/*',
	test: 14,
	uri: '/test/demo/1/*/test/2/3/4/5'
}, {
	args: [ 1 ],
	path: '/test/demo/:first/*/test/*',
	test: 15,
	uri: '/test/demo/1/*/test'
}, {
	args: [],
	path: '/test/demo/:first/*/test/*',
	test: 16,
	uri: '/test/demo/undefined/*/test'
}, {
	args: [ undefined, 4, undefined, true, undefined, null, undefined, undefined ],
	path: '/test/demo/*',
	test: 17,
	uri: '/test/demo/undefined/4/undefined/true/undefined/null'
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

	describe( 'optional paths', () => {
		test.concurrent.each(
			[{
				args: [ undefined, null, null, undefined, undefined ],
				path: '/test/demo/:first/:second?/:third/:fourth',
				test: 101,
				uri: '/test/demo/undefined/null/null'
			}, {
				args: [ undefined, undefined, null, undefined, undefined ],
				path: '/test/demo/:first/:second?/:third/:fourth',
				test: 102,
				uri: '/test/demo/undefined/undefined/null'
			}, {
				args: [ undefined, , null, undefined, undefined ],
				path: '/test/demo/:first/:second?/:third/:fourth',
				test: 103,
				uri: '/test/demo/undefined/undefined/null'
			}, {
				args: [ undefined, , null, undefined, undefined ],
				path: '/test/demo/:first/:second/:third/:fourth',
				test: 104,
				uri: '/test/demo/undefined/undefined/null'
			}].map(
				({ args, path, test, uri }) => [ test, path, args, uri ]
			)
		)(	
			'TEST #%i: resolve(%s, ...%s) => %s',
			async ( test, path, args, uri ) => {
				expect( resolve( path, ...args ) ).toEqual( uri )
			}
		)
	} );

	describe( 'regex validation', () => {
		test( 'accepts constant - see :third pathVariable.', () => {
			const args = [ 1, '0ab24', 'd', { a: 'b' }, undefined ];
			const path = '/test/demo/:first/:second(^[a-f0-9]+$)/:third(d)?/:fourth';
			const uri = resolve( path, ...args );
			expect( uri ).not.toEqual( '/test/demo/1/0ab24/3/{"a":"b"}' );
			expect( uri ).toEqual( '/test/demo/1/0ab24/d/{"a":"b"}' );
		});
		test( 'accepts escape sequences - see :third pathVariable.', () => {
			const args = [ 1, '0ab24', 3077, { a: 'b' }, undefined ];
			const path = '/test/demo/:first/:second(^[a-f0-9]+$)/:third(\\d{4})?/:fourth';
			expect( resolve( path, ...args ) ).toEqual( '/test/demo/1/0ab24/3077/{"a":"b"}' )
		});
		test( 'throws upon encountering regex failure', () => {
			const args = [ 1, 'null', 3, { a: 'b' }, undefined ];
			const path = '/test/demo/:first/:second(^[a-f0-9]+$)/:third([A-Za-z]{24})?/:fourth';
			expect(() => resolve( path, ...args )).toThrow( 'RegExp validation failed for param :second' )
		});
	} );

} );
