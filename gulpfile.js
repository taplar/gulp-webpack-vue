'use strict';

var concat = require( 'gulp-concat' );
var del = require( 'del' );
var gulp = require( 'gulp' );
var less = require( 'gulp-less' );
var minify = require( 'gulp-minify' );
var path = require( 'path' );
var runSequence = require( 'run-sequence' );
var util = require( 'gulp-util' );
var webpack = require( 'webpack' );

var production = false;
var rootPath = path.resolve( './' );

function buildForProduction ( callback ) {
	production = true;

	return runSequence( 'development-nowatch', callback );
}

function bundleJavascript () {
	var environment = ( production ? 'production' : 'development' );
	var filepaths = [
		rootPath +'/node_modules/es5-shim/es5-shim.min.js'
		, rootPath +'/repo/public/scripts/vendor/'+ environment +'/**/*.*'
		, rootPath +'/repo/public/scripts/src/**/*.js'
		, '!'+ rootPath +'/repo/public/scripts/src/application.js'
	];

	return gulp
		.src( filepaths )
		.pipe( concat( 'all.js' ) )
		.pipe( gulp.dest( rootPath +'/build/public/scripts/src/' ) );
}

function compileLess () {
	var filepaths = [
		rootPath +'/repo/public/styles/variables.less'
		, rootPath +'/repo/public/styles/**/*.less'
	];

	var options = {
		compile: true
		, compress: true
		, noUnderscores: false
		, noIDs: false
		, zeroUnits: false
	};
	
	return gulp
		.src( filepaths )
		.pipe( concat( 'all.less' ) )
		.pipe( less( options ).on( 'error', handleError ) )
		.pipe( concat( 'all.css' ) )
		.pipe( gulp.dest( rootPath +'/build/public/styles/' ) );
}

function compileVue () {
	webpack( require( rootPath +'/webpack.config.js' ), ( err, stats ) => {
		if ( err ) throw new util.PluginError( 'webpack', err );

		gulp
			.src( rootPath +'/build/public/scripts/src/application.js' )
			.pipe( minify() )
			.pipe( gulp.dest( rootPath +'/build/public/scripts/src' ) );
    } );
}

function copyBuildFilesToServer () {
	return gulp
		.src( [ rootPath +'/build/**/*.*', rootPath +'/build/**/.*' ], { base: 'build' } )
		.pipe( gulp.dest( rootPath +'/server' ) );
}

function copyStaticFilesToBuild () {
	var filepaths = [
		rootPath +'/repo/*.*'
		, rootPath +'/repo/.*'
		, rootPath +'/repo/private/**/*.*'
		, rootPath +'/repo/private/**/.*'
		, rootPath +'/repo/public/images/**/*.*'
		, rootPath +'/repo/public/images/**/.*'
		, rootPath +'/repo/public/styles/vendor/**/*.*'
	];

	return gulp
		.src( filepaths, { base: 'repo' } )
		.pipe( gulp.dest( rootPath +'/build/' ) );
}

function deleteAllBuiltAndDeployedFiles () {
	var filepaths = [
		rootPath +'/build/**',
		rootPath +'/build/**/.*',
		'!'+ rootPath +'/build',
		rootPath +'/server/**',
		rootPath +'/server/**/.*',
		'!'+ rootPath +'/server'
	];

	return del( filepaths );
}

function handleError ( error ) {
	console.log( error.toString() );
	this.emit( 'end' );
}

gulp.task( 'build', callback => runSequence( 'build-css', 'build-vue', 'build-js-vendor', 'build-other', callback ) );
gulp.task( 'build-css', compileLess );
gulp.task( 'build-js-vendor', bundleJavascript );
gulp.task( 'build-other', copyStaticFilesToBuild );
gulp.task( 'build-vue', compileVue );
gulp.task( 'clean', deleteAllBuiltAndDeployedFiles );
gulp.task( 'default', callback => runSequence( 'development', callback ) );
gulp.task( 'deploy', copyBuildFilesToServer );
gulp.task( 'development', callback => runSequence( 'development-nowatch', 'watch', callback ) );
gulp.task( 'development-nowatch', callback => runSequence( 'clean', 'build', 'deploy', callback ) );
gulp.task( 'production', buildForProduction );
gulp.task( 'watch', () => gulp.watch( [ 'repo/**/*', 'repo/**/.*', 'repo/**/*.*' ], () => runSequence( 'development-nowatch' ) ) );
