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
                    declaration: true,
                    removeComments: true
                }
            }
        },

        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['app.ts', 'modules/**/*.ts'],
                dest: 'dist/app.ts',
            },
        }
    });
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat', 'typescript', 'clean']);


};