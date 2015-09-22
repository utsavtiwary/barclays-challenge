'use strict';

module.exports = function(grunt) {

    function setInstance () {
        global.instance = 'feedbarc.cloudapp.net';
        global.user     = 'azureuser';
        global.keyfile  = '../BookingSystemSimulator/FeedBarc.pem';
    }
    setInstance ();

    grunt.registerTask ('default', ['jsdoc', 'nodemon']);
    grunt.registerTask ('build', ['jsdoc', 'compress']);
    grunt.registerTask ('test', ['jsdoc', 'mochaTest', 'jsdoc']);
    grunt.registerTask ('deploy-dev', ['jsdoc', 'rsync:dev']);
    //grunt.registerTask('deploy-stage', ['exec:zred', 'exec:chmod', 'rsync:stage', 'exec:restart', 'exec:znet']);
    grunt.registerTask ('deploy-demo', ['jsdoc', 'exec:chmod', 'rsync:stage', 'exec:restart']);
    grunt.registerTask ('deploy-stage', ['jsdoc', 'exec:chmod', 'rsync:stage', 'exec:restart']);
    grunt.registerTask ('deploy-prod', ['jsdoc', 'exec:chmod', 'rsync:prod', 'exec:restart']);
    grunt.registerTask ('init-instance', ['jsdoc', 'exec:chmod', 'exec:init']);

    grunt.initConfig({
        nodemon: {
            dev: {
                script: 'server/server.js',
                options: {
                    watch: ['server', 'common']
                }
            }

        },
        compress: {
            dev: {
                options: {
                    archive: './API.tgz',
                    mode: 'tgz'
                },
                files: [
                    { src: './*.json' },
                    { src: './common/**' },
                    { src: './server/**' }
                ]
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.spec.js']
            }
        },

        exec: {
            zred: {
                command: 'wifi zred'
            },
            znet: {
                command: 'wifi znet'
            },
            chmod: {
                command: 'chmod 600 ./' + global.keyfile
            },
            restart: {
                command: 'ssh -i ./' + global.keyfile + ' ' + global.user + '@' + global.instance +
                         ' "cd ~/API && npm install && npm update && pm2 restart api"'
            }
        },

        jsdoc : {
            dist : {
                src: ['src/**/*.js'],
                jsdoc: 'node_modules/grunt-jsdoc/bin',
                options: {
                    destination: 'doc'
                }
            }
        },

        rsync: {
            options: {
                args: ['--verbose'],
                recursive: true,
                deleteAll: true // Careful this option could cause data loss, read the docs!
            },
            dev: {
                options: {
                    src: ['./src', './*.json'],
                    dest: '../dist/'
                }
            },
            stage: {
                options: {
                    src: ['./src', './*.json'],
                    dest: '~/API/',
                    privateKey: './' + global.keyfile,
                    host: '' + global.user + '@' + global.instance
                }
            },
            prod: {
                options: {
                    src: ['./src', './*.json'],
                    dest: '~/API/',
                    privateKey: './' + global.keyfile,
                    host: '' + global.user + '@' + global.instance
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-rsync');
    grunt.loadNpmTasks('grunt-jsdoc');
};
