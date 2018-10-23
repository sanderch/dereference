if (!process.argv[2]){
	console.log('Emergency exit! first parameter "source" not specified.')
	return process.exit(0);
} else {
	console.log(`using '${process.argv[2]}' as a source`)
}

var destination = 'dereferenced.json';

if (process.argv[3]){
	destination = process.argv[3];
	console.log(`destination set to: '${destination}'`);
} else {
	console.log(`using default destination: '${destination}'`);
}

var $RefParser = require('json-schema-ref-parser');
var fs = require('fs');
var file1 = fs.readFileSync(process.argv[2], 'utf8');

var mySchema = JSON.parse(file1);

$RefParser.dereference(mySchema)
  .then(function(schema) {
    console.log('done!');
    var cache = [];
    var newSchemaTxt = JSON.stringify(schema, function(key, value){
	    if (typeof value === 'object' && value !== null) {
	        if (cache.indexOf(value) !== -1) {
	            // Duplicate reference found
	            try {
	                // If this value does not reference a parent it can be deduped
	                return JSON.parse(JSON.stringify(value));
	            } catch (error) {
	                // discard key if value cannot be deduped
	                return;
	            }
	        }
	        // Store value in our collection
	        cache.push(value);
	    }
	    return value;
	});
    cache = null;

    fs.writeFile(destination, newSchemaTxt, 'utf8', function(){
		console.log('new file written!');
	});
  })
  .catch(function(err) {
    console.error(err);
  });
