let path = require( 'path' );
let cppPath = path.relative( '.', path.join( __dirname, '../cpp' ) );
console.log( cppPath );