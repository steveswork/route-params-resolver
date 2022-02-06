# Route-Params-Resolver
Hassle free args-to-params mapper: resolves route path params to convert a route into a valid URI.<br />
- Hassle-free<br />
- Clunk-free<br />

<h4><u>Install</u></h4>
npm i -S @webkrafters/route-params-resolver

<h3>Usage:</h3>
  <p><code>import resolve from '@webkrafters/route-params-resolver';</code></p>
 
  <div style="padding-left: 32px">
    <p>
    <b><u>Signature:</u> <code>resolve(routePath: string, ...routeArgs: *[]): string</code></b>
    </p>
    <p>
      All non-string route args are converted to its default native string representation.<br />
      Such is a default native Javascript behavior.<br />
      The utility applies `JSON.stringify` to route args of object types.
    </p>
  </div>
  
  <p><code>resolve('/test/demo', 1, 2, 3); // '/test/demo'</code></p>
  
  <p><code>resolve('/test/demo/, 1, 2, 3); // '/test/demo'</code></p>

  <p><code>resolve('/test/demo/:first/:second/:third', 1, 2, 3); // '/test/demo/1/2/3'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second.:third/:fourth', 1, 2, 3, 4); // '/test/demo/1/2.3/4'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second/:third/:fourth', 1, null, null, null); // '/test/demo/1/null/null/null'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second/:third/:fourth', 1); // '/test/demo/1'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second/:third/:fourth', 1, undefined, undefined, undefined); // '/test/demo/1'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second/:third/:fourth', 1, null, null, null); // '/test/demo/1/null/null/null'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second/:third/:fourth', undefined, null, undefined, undefined, undefined); // '/test/demo/undefined/null'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second([a-f0-9])/:third([A-Za-z]{24})?/:fourth', 1, null, 3, {a: 'b'}, undefined); // '/test/demo/1/null/3/{"a":"b"}'</code></p>

  <p><code>resolve('/test/demo/:first/:second/:third', [ 1, 2, 3 ], new Date( 1643935827014 ), true); // '/test/demo/[1,2,3]/"2022-02-04T00:50:27.014Z"/true'</code></p>

## License

	ISC

