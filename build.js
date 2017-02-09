var stealTools = require("steal-tools");

stealTools.export({
	steal: {
		config: __dirname + "/package.json!npm"
	},
	outputs: {
		"+amd": {},
		"+cjs": {},
		"+global-js": {}
	}
}).catch(function(e){

	setTimeout(function(){
		throw e;
	},1);

});
