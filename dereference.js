var $RefParser = require('json-schema-ref-parser');
var fs = require('fs');
var file1 = fs.readFileSync('codan.policy.schema2.json', 'utf8');

// console.log(file1);

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

    fs.writeFile('dereferenced.json', newSchemaTxt, 'utf8', function(){
		console.log('new file written!');
	});
  })
  .catch(function(err) {
    console.error(err);
  });
