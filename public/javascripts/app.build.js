// requireJS will manage modules

({
	appDir: "../",
	baseUrl: "javascripts",
	dir: "../../app-build/",
	optimize: "none",

	paths: {
		"jquery": "require-jquery",
		"underscore": "libs/underscore",
		"backbone": "libs/backbone"
	},

	modules: [
		{
			name: "require-jquery"
		},
		{
			name: "main",
			exclude: ["jquery"]
		}
	]
})