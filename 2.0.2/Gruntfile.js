module.exports = function(grunt) {
	var task = grunt.task;
	var path = require('path');
	var clamUtil = require('clam-util');
	var exec = require('child_process').exec;
    var SRC = 'lib/';
    grunt.initConfig({
        // 配置文件，参考package.json配置方式，必须设置项是
        // name, version, author
        // name作为gallery发布后的模块名
        // version是版本，也是发布目录
        // author必须是{name: "xxx", email: "xxx"}格式
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!build time : <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>*/\n',

		// 配置默认分支
		currentBranch: 'master',

        // 对build目录进行清理
        clean: {
            build: {
                src: './build/*'
			}
        },
        // kmc打包任务，默认情况，入口文件是index.js，可以自行添加入口文件，在files下面
        // 添加
        kmc: {
            options: {
                packages: [
                    {
                        name: '<%= pkg.name %>',
                        path: '../'
                    }
                ],
                depFilePath: 'map.js',
                fixModuleName:true,
                map: [["<%= pkg.name %>/lib/", "kg/<%= pkg.name %>/<%= pkg.version %>/"]]
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: SRC,
                        src: [ './*.js' ],
                        dest: 'build/'
                    }
                ]
            }
        },
		// 发布命令
		exec: {
			tag: {
				command: 'git tag publish/<%= currentBranch %>'
			},
			publish: {
				command: 'git push origin publish/<%= currentBranch %>:publish/<%= currentBranch %>'
			},
			commit: {
				command: function (msg) {
					var command = 'git commit -m "' + grunt.config.get('currentBranch') + ' - ' + grunt.template.today("yyyy-mm-dd HH:MM:ss") + ' ' + msg + '"';
					return command;
				}
			},
			add: {
				command: 'git add .'
			},
			prepub: {
				command: 'git push origin daily/<%= currentBranch %>:daily/<%= currentBranch %>'
			},
			grunt_publish: {
				command: 'grunt default:publish'
			},
			grunt_prepub: {
				command: function (msg) {
					return 'grunt default:prepub:' + msg;
				}
			},
			new_branch: {
				command: 'git checkout -b daily/<%= currentBranch %>'
			}
		},
        /**
         * 对JS文件进行压缩
         * @link https://github.com/gruntjs/grunt-contrib-uglify
         */
        uglify: {
            options: {
                compress:{
                    global_defs:{"DEBUG":false},
                    drop_console:true,
                    dead_code:true
                },
                banner: '<%= banner %>',
                beautify: {
                    ascii_only: true
                }
            },
            page: {
                files: [
                    {
                        expand: true,
                        cwd: './build',
                        src: ['**/*.js', '!**/*-min.js'],
                        dest: './build',
                        ext: '-min.js'
                    }
                ]
            }
        },
        // FlexCombo服务配置
        // https://npmjs.org/package/grunt-flexcombo
        flexcombo:{
            // https://speakerdeck.com/lijing00333/grunt-flexcombo
            debug:{
                options:{
                    proxyport:8080,
                    target:'<%= pkg.version %>/build/',
                    urls:'/s/kissy/gallery/<%= pkg.name %>/<%= pkg.version %>',
                    port:'80',
                    servlet:'?',
                    separator:',',
                    charset:'gbk', // 输出文件的编码
                    hosts:{
                        "g.assets.daily.taobao.net":"10.235.136.37"
                    },
                    // 默认将"-min"文件映射到源文件
                    filter:{
                        '-min\\.js':'.js'
                    }
                }
            },
            demo:{
                options:{
                    proxyport:8080,
                    target:'<%= pkg.version %>/',
                    urls:'/s/kissy/gallery/<%= pkg.name %>/<%= pkg.version %>',
                    port:'80',
                    proxyHosts:['demo'],
                    servlet:'?',
                    separator:',',
                    hosts:{
                        "g.assets.daily.taobao.net":"10.235.136.37"
                    },
                    charset:'gbk',
                    filter:{
                        '-min\\.js':'.js'
                    }
                }
            }
        },
        less: {
            options: {
                paths: './'
            },
            main: {
                files: [
                    {
                        expand: true,
						cwd: SRC,
                        src: ['**/*.less',
							'!build/**/*.less',   
							'!demo/**/*.less'],
                        dest: './build/',
                        ext: '.css'
                    }
                ]
            }
        },
		sass: {
			dist: {
				files: [
					{
						expand: true,
						cwd: SRC,
						src: ['**/*.scss'],
						dest: 'build/',
						ext: '.css'
					}
				]
			}
		},
		// 拷贝 CSS 文件
		copy : {
			main: {
				files:[
					{
						expand:true,
						cwd:SRC,
						src: [
							'**/*.css',
							'!build/**/*.css',
							'!demo/**/*.css'
						], 
						dest: './build/', 
						filter: 'isFile'
					}
				]
			}
		},
		// 监听JS、CSS、LESS文件的修改
        watch: {
            'all': {
                files: [
					'./lib/**/*.css',
					'!./build/**/*'
				],
                tasks: [ 'build' ]
            }
		},
        cssmin: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: './build',
                        src: ['**/*.css', '!**/*-min.css'],
                        dest: './build',
                        ext: '-min.css'
                    }
                ]
            }
        }
    });

    // 使用到的任务，可以增加其他任务
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-kmc');
	grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-flexcombo');
    grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('build', '默认构建任务', function() {
		task.run(['clean:build', 'kmc','uglify', 'copy','less','sass','cssmin']);
	});

    // 启动Debug调试时的本地服务：grunt debug
    grunt.registerTask('debug', '开启debug模式', function() {
        task.run(['flexcombo:debug','watch:all']);
    });

    // 启动Demo调试时的本地服务: grunt demo
    grunt.registerTask('demo', '开启demo模式', function() {
        task.run(['flexcombo:demo','watch:all']);
    });

	// 新建一个分支
	grunt.registerTask('newbranch', '获取当前最大版本号,创建新的分支', function (type, msg) {
		var done = this.async();
		exec('git branch -a & git tag', function (err, stdout, stderr, cb) {
			var versions = stdout.match(/\d+\.\d+\.\d+/ig),
				r = clamUtil.getBiggestVersion(versions);
			if (!r || !versions) {
				r = '0.1.0';
			} else {
				r[2]++;
				r = r.join('.');
			}
			grunt.log.write(('新分支：daily/' + r).green);
			grunt.config.set('currentBranch', r);
			task.run(['exec:new_branch']);
			// 回写入 package.json 的 version
			try {
				pkgJSON = require(path.resolve(process.cwd(), 'package.json'));
				pkgJSON.version = r;
				clamUtil.fs.writeJSONFile(path.resolve(process.cwd(),"package.json"), pkgJSON, function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("update package.json.");
					}
				});
			} catch (e) {
				console.log('未找到package.json');
			}
			done();
		});
	});

	// 预发布
	grunt.registerTask('prepub', 'pre publish...', function (msg) {
		var done = this.async();
		clamUtil.getBranchVersion(function(version){
			grunt.log.write(('当前分支：' + version).green);
			grunt.config.set('currentBranch', version);
			task.run(['exec:add', 'exec:commit:' + msg]);
			task.run(['exec:prepub']);
			done();
		});
	});

	// 正式发布
	grunt.registerTask('publish', '组件正式发布', function (msg) {
		var done = this.async();
		clamUtil.getBranchVersion(function(version){
			grunt.log.write(('当前分支：' + version).green);
			grunt.config.set('currentBranch', version);
			// task.run(['default']);
			// task.run(['exec:add', 'exec:commit:' + msg]);
			// task.run(['exec:prepub']);
			task.run(['exec:tag', 'exec:publish']);
			done();
		});
	});

	// 默认构建流程
    return grunt.registerTask('default', '',function(type){
		if (!type) {
			task.run(['build']);
		}
	});
};
