module.exports = function (grunt) {
    grunt.initConfig( {
        
        clean: {
            dist: {
                files: [{
                        dot: true,
                        src: [
                            '.tmp',
                            'dist/app.ts'
                        ]
                    }]

            }
        },

        typescript: {
            base: {
                src: ['dist/app.ts'],
                dest: 'dist',
                options: {
                    module: 'commonjs', //or amd
                    target: 'es5', //or es3
                    sourcemap: true,
                    declaration: false,
                    removeComments: true,
                    generateTsConfig: false
                }
            }
        },

        concat: {
            options: {
                separator: '',
            },
            dist: {
                src: ['src/*.ts', 'src/**/*.ts'],
                dest: 'dist/app.ts',
            },
        },

        dtsGenerator: {
            dist: {
                src: 'dist/*.ts',
                options: {
                    name: 'swagger-ts-codegen',
                    baseDir: 'dist',
                    out: 'dist/swagger-ts-codegen.d.ts',
                    main: 'swagger-ts-codegen/app',
                    indent: '\r\n'
                }
            }
        }

    });
    grunt.loadNpmTasks('dts-generator');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat', 'typescript', 'dtsGenerator', 'clean']);


};