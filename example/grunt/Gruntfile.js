var cwd = process.cwd();
var appPath = cwd+"/..";
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options: {
                sourceMap: false,
                compressed: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '../static/css/',
                    src: ['**/*.scss'],
                    dest: '../dist/css/',
                    ext: '.css'
                }]
            }
        },

        postcss: {
            options: {
                map: false, // inline sourcemaps
                processors: [
                    require('postcss-jingoal')()
                ]
            },
            dist: {
                src: '../dist/css/*.css'
            }
        },
        
        // 用于去除重复的css 代码，格式化css
        css_purge: {
            options: {
                "verbose": false,
                "no_duplicate_property": true,
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '../dist/css/',
                    src: ['**/*.css'],
                    dest: '../dist/css/',
                    ext: '.css'
                }]
            }
        },

        watch: {
            scripts: {
                files: ['../static/css/*.scss'],
                tasks: ['sass', 'postcss'],
                options: {
                    spawn: false,
                }
            }
        }
    });
    grunt.registerTask('default', ['sass', 'postcss', 'css_purge']);
    grunt.registerTask('default:watch', ['watch']);
};
