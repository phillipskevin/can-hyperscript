var stealTools = require("steal-tools");

stealTools.export({
	steal: {
		config: __dirname + "/package.json!npm",
		main: "lib/can-hyperscript"
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
