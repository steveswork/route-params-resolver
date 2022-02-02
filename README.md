# Route-Params-Resolver
Hassle free args-to-params mapper: resolves route path params to convert a route into a valid URI.<br />
Hassle-free<br />
Clunk-free<br />

<h4><u>Install</u></h4>
npm i -S @webkrafters/route-params-resolver

<h3>Usage:</h3>
  <p><code>import resolve from '@webkrafters/route-params-resolver';</code></p>
 
  <p style="padding-left: 25px">
    <b><u>Signature:</u></b> resolve(routePath: string, ...routeArgs: *[]): string<br />
    All non-string `routeArgs` are converted to its default native string representation.<br />
    Such is a default native Javascript behavior.<br />
    The utility applies `JSON.stringify` to object `routeArgs` types.<br />  
  </p>
  
  <p><code>resolve('/test/demo/:first/:second/:third', 1, 2, 3); // '/test/demo/1/2/3'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second.:third/:fourth', 1, 2, 3, 4); // '/test/demo/1/2.3/4'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second/:third/:fourth', 1, null, null, null); // '/test/demo/1/null/null/null'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second/:third/:fourth', 1); // '/test/demo/1'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second/:third/:fourth', 1, undefined, undefined, undefined); // '/test/demo/1/'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second/:third/:fourth', 1, null, null, null); // '/test/demo/1/null/null/null'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second/:third/:fourth', undefined, null, undefined, undefined, undefined); // '/test/demo/undefined/null'</code></p>
  
  <p><code>resolve('/test/demo/:first/:second([a-f0-9])/:third([A-Za-z]{24})?/:fourth', 1, null, 3, {a: 'b'}, undefined); // '/test/demo/1/null/3/{a: "b"}'</code></p>
</code>
