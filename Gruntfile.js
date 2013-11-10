module.exports = function(grunt) {
	var task = grunt.task;
    grunt.initConfig({
        // 配置文件，参考package.json配置方式，必须设置项是
        // name, version, author
        // name作为gallery发布后的模块名
        // version是版本，也是发布目录
        // author必须是{name: "xxx", email: "xxx"}格式
        pkg: grunt.file.readJSON('abc.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // 对build目录进行清理
        clean: {
            build: {
                src: '<%= pkg.version %>/build/*'
			}
        },

        // kmc打包任务，默认情况，入口文件是index.js，可以自行添加入口文件，在files下面
        // 添加
        kmc: {
            options: {
                packages: [
                    {
                        name: '<%= pkg.name %>',
                        path: '../',
						charset:'utf-8'
                    }
                ],
                map: [["<%= pkg.name %>/", "gallery/<%= pkg.name %>/"]]
            },
            main: {
                files: [
                    {
                        src: "<%= pkg.version %>/index.js",
                        dest: "<%= pkg.version %>/build/index.js"
                    }
                ]
            }
        },
		// FlexCombo服务配置
		// https://npmjs.org/package/grunt-flexcombo
		flexcombo:{
			// 无线H5项目调试，可打开host配置，用法参照
			// https://speakerdeck.com/lijing00333/h5-xiang-mu-kai-fa-huan-jing-pei-zhi
			debug:{
				options:{
					target:'<%= pkg.version %>/build/',
					urls:'/s/kissy/gallery/<%= pkg.name %>/<%= pkg.version %>',
					port:'80',
					servlet:'?',
					separator:',',
					charset:'gbk', // 输出文件的编码
					// 默认将"-min"文件映射到源文件
					filter:{
						'-min\\.js':'.js'
					}
				}
			}
		},
		// 监听JS、CSS、LESS文件的修改
        watch: {
            'all': {
                files: [
					'<%= pkg.version %>/**/*.js',
					'<%= pkg.version %>/src/**/*.css',
					'!<%= pkg.version %>/build/**/*'
				],
                tasks: [ 'build' ]
            }
		},
		// 拷贝 CSS 文件
		copy : {
			main: {
				files:[
					{
						expand:true,
						cwd:'<%= pkg.version %>/',
						src: [
							'**/*.css',
							'!build/**/*.css',
							'!demo/**/*.css'
						], 
						dest: '<%= pkg.version %>/build/', 
						filter: 'isFile'
					}
				]
			}
		},
        // 压缩CSS 
		cssmin: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= pkg.version %>/build/',
                        src: ['**/*.css', '!**/*-min.css'],
                        dest: '<%= pkg.version %>/build/',
                        ext: '-min.css'
                    }
                ]
            }
        },
        // 打包后压缩文件
        // 压缩文件和入口文件一一对应
        uglify: {
            options: {
                banner: '<%= banner %>',
                beautify: {
                    ascii_only: true
                }
            },
            base: {
                files: [{
					expand: true,
					cwd: '<%= pkg.version %>/build/',
					src: ['**/*.js','!**/*-min.js'],
					dest: '<%= pkg.version %>/build/',
					ext: '-min.js'
                }]
            }
        }
    });

    // 使用到的任务，可以增加其他任务
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-kmc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-flexcombo');

	grunt.registerTask('build', '默认构建任务', function() {
		task.run(['clean:build', 'kmc','uglify', 'copy','cssmin']);
	});

	// 启动Debug调试时的本地服务
	grunt.registerTask('debug', '开启debug模式', function() {
		task.run(['flexcombo:debug','watch:all']);
	});

    return grunt.registerTask('default', '',function(type){
		if (!type) {
			task.run(['build']);
		}
	});
};
