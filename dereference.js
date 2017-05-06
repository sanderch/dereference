var $RefParser = require('json-schema-ref-parser');
var fs = require('fs');
var file1 = fs.readFileSync('schema2.json', 'utf8');

// console.log(file1);

var mySchema = JSON.parse(file1);

$RefParser.dereference(mySchema)
  .then(function(schema) {
    console.log('done!');
    var newSchemaTxt = JSON.stringify(schema);
    fs.writeFile('myjsonfile.json', newSchemaTxt, 'utf8', function(){
		console.log('new file written!');
	});
  })
  .catch(function(err) {
    console.error(err);
  });
