module.exports = function(grunt) {
	//https://www.npmjs.com/package/grunt-remove-logging-calls

	/* grunt.registerTask('default', ['jshint', 'remove-logging-calls', 'uglify', 'cssmin', ]);
	## build process ##
	js/*.js 	=> jshint
	js/*.js    	=> remove console.log() 
	js/*.js		=> uglify (compress)
	css/*.css  	=> cssmin
	*/

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
		  	//files: ['gruntfile.js', 'server.js', 'public/js/client.js', 'public/js/simpleClock.js']
		  	all: ['gruntfile.js', 'server.js', 'public/js/*' , '!public/js/angular*' , '!public/js/jquery*'  ]	
		},
		
		uglify: {
			options: {
				manage: false,
				mangle: false,
				//beautify: true,
				banner: '/*! <%= pkg.name %> (c) Hermann Rösser License: MIT <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			my_target: {
				files: 	[ 
					{'public/js/ang.app.min.js': ['public/js/ang.app.js'] },
					{'public/js/ang.config.min.js': ['public/js/ang.config.js'] },
					{'public/js/ang.controllers.min.js': ['public/js/ang.controllers.js'] },
					{'public/js/ang.directives.min.js': ['public/js/ang.directives.js'] },					
					{'public/js/ang.filters.min.js': ['public/js/ang.filters.js'] },					
					{'public/js/ang.helpers.min.js': ['public/js/ang.helpers.js'] },
					{'public/js/ang.socketHelper.min.js': ['public/js/ang.socketHelper.js'] },
					{'public/js/ang.services.min.js': ['public/js/ang.services.js'] },
					{'public/js/simpleClock.min.js': ['public/js/simpleClock.js'] }
				]
				/**
			   	files: {
			        'public/app.min.js': ['public/js/ang.app.js','public/js/ang.config.js','public/js/ang.controllers.js',
			        	'public/js/ang.directives.js','public/js/ang.filters.js','public/js/ang.helpers.js','public/js/ang.socketHelper.js',
						'public/js/ang.services.js','public/js/simpleClock.js']
			     }*/
			}
		},
		/***  if you fork, then do LESS 
        less: {
                 development: {
                     options: {
                         paths: ["public/css"]
                     },
                     files: {"public/css/style.css": "public/less/style.less"}
                 }
        },
		*/
		cssmin: {
			target:{ 	
				files: [{	
					expand: true,
					cwd:'public/css/',	// dir to look in
					src: [ '*.css', '!*.min.css'],	// exclude already minified css files
					dest: 'public/css/',
					ext: '.min.css'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	//grunt.loadNpmTasks('grunt-remove-logging-calls');

	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	//grunt.loadNpmTasks('grunt-remove-logging');

	//grunt.registerTask('default', ['jshint',   'cssmin',  'less'  'uglify']);
	grunt.registerTask('default', [  'uglify', 'cssmin' ]);
};
