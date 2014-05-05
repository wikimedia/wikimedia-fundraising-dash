// requireJS will manage modules

({
	appDir: "../",
	baseUrl: "javascripts",
	dir: "../../app-build/",
	optimize: "none",

	paths: {
		"jquery": "jquery-1.11.1",
		"underscore": "libs/underscore",
		"backbone": "libs/backbone"
	},

	modules: [
		{
			name: "jquery-1.11.1"
		}
	]
})