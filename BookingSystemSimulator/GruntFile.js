'use strict';

module.exports = function(grunt) {

    function setInstance () {
        global.instance = 'feedbarc.cloudapp.net';
        global.user     = 'azureuser';
        global.keyfile  = './FeedBarc.pem';
    }
    setInstance ();

    grunt.registerTask ('configure', ['copy:datasourcesConfig']);
    grunt.registerTask ('configure-test', ['copy:datasourcesTestConfig']);
    grunt.registerTask ('default', ['configure', 'jsdoc', 'nodemon']);
    grunt.registerTask ('build', ['configure', 'loopback_sdk_angular', 'jsdoc', 'compress']);
    grunt.registerTask ('test', ['configure-test', 'jsdoc', 'mochaTest', 'jsdoc']);
    grunt.registerTask ('deploy-dev', ['configure', 'jsdoc', 'rsync:dev']);
    //grunt.registerTask('deploy-stage', ['exec:zred', 'exec:chmod', 'rsync:stage', 'exec:restart', 'exec:znet']);
    grunt.registerTask ('deploy-demo', ['configure', 'jsdoc', 'exec:chmod', 'rsync:stage', 'exec:restart']);
    grunt.registerTask ('deploy-stage', ['configure', 'jsdoc', 'exec:chmod', 'rsync:stage', 'exec:restart']);
    grunt.registerTask ('deploy-prod', ['configure', 'jsdoc', 'exec:chmod', 'rsync:prod', 'exec:restart']);
    grunt.registerTask ('init-instance', ['configure', 'jsdoc', 'exec:chmod', 'exec:init']);

    grunt.initConfig({
        copy: {
            datasourcesConfig: {
                files: [
                    {
                        expand: true,
                        src: 'server/datasources.run.json',
                        dest: '/server',
                        rename: function () {return 'server/datasources.json'}
                    }
                ]
            },
            datasourcesTestConfig: {
                files: [
                    {
                        expand: true,
                        src: 'server/datasources.test.json',
                        dest: '/server',
                        rename: function () {return 'server/datasources.json'}
                    }
                ]
            }
        },

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
                    archive: './BookingSystemSimulator.tgz',
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
                         ' "cd ~/BookingSystemSimulator && npm install && npm update && pm2 restart server/server.js"'
            }
        },

        jsdoc : {
            dist : {
                src: ['common/**/*.js', 'init/**/*.js', 'server/**/*.js', 'test/**/*.js'],
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
                    src: ['./server', './common', './*.json'],
                    dest: '../dist/'
                }
            },
            stage: {
                options: {
                    src: ['./server', './common', './*.json'],
                    dest: '~/BookingSystemSimulator/',
                    privateKey: './' + global.keyfile,
                    host: '' + global.user + '@' + global.instance
                }
            },
            prod: {
                options: {
                    src: ['./server', './common', './*.json'],
                    dest: '~/BookingSystemSimulator/',
                    privateKey: './' + global.keyfile,
                    host: '' + global.user + '@' + global.instance
                }
            }
        },

        loopback_sdk_angular: {
            options: {
                input: "server/server.js",
                output: "client/js/lb-services.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-rsync');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-loopback-sdk-angular');
};
