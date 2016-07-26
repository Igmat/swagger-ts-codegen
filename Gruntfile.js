module.exports = function (grunt) {
    var appConfig = {
        app: 'src',
        dist: 'dist',
        test: 'test'
    };

    grunt.initConfig( {
        // Project settings
        yeoman: appConfig,
        
        // TS compilation settings
        ts: {
            options:{
                fast: 'never'
            },
            app: {
                tsconfig: {
                    overwriteFilesGlob: true
                },
                src: ['<%= yeoman.app %>/app.ts'],
                outDir: '<%= yeoman.dist %>/'
            },
            test: {
                tsconfig: {
                    overwriteFilesGlob: true
                },
                src: ['<%= yeoman.test %>/test.ts'],
                outDir: '<%= yeoman.dist %>/'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-ts');
    grunt.registerTask('build', ['ts:app']);
    grunt.registerTask('test', ['ts:test']);
};