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


gulp.task( 'build', callback => runSequence( 'build-styles', 'build-scripts', 'build-static', callback ) );
gulp.task( 'build-js-vendor', bundleJavascript );
gulp.task( 'build-scripts', callback => runSequence( 'build-vue', 'build-js-vendor', callback ) );
gulp.task( 'build-static', copyStaticFilesToBuild );
gulp.task( 'build-styles', compileLess );
gulp.task( 'build-vue', compileVue );
gulp.task( 'clean', callback => runSequence( 'clean-styles', 'clean-scripts', 'clean-static', callback ) );
gulp.task( 'clean-scripts', deleteAllScriptFiles );
gulp.task( 'clean-server', deleteAllServerFiles );
gulp.task( 'clean-static', deleteAllServerFiles );
gulp.task( 'clean-styles', deleteAllStyleFiles );
gulp.task( 'development', callback => runSequence( 'clean', 'build', 'deploy', callback ) );
gulp.task( 'development-watch', callback => runSequence( 'development', 'watch', callback ) );
gulp.task( 'deploy', callback => runSequence( 'deploy-styles', 'deploy-scripts', 'deploy-static', callback ) );
gulp.task( 'deploy-scripts', copyScriptFilesToServer );
gulp.task( 'deploy-static', copyStaticFilesToServer );
gulp.task( 'deploy-styles', copyStyleFilesToServer );
gulp.task( 'mark-as-production', callback => { production = true; callback(); } );
gulp.task( 'production', callback => runSequence( 'mark-as-production', 'clean', 'build', 'deploy', callback ) );
gulp.task( 'production-watch', callback => runSequence( 'production', 'watch', callback ) );
gulp.task( 'watch', callback => runSequence( 'watch-styles', 'watch-scripts', 'watch-static', callback ) );
gulp.task( 'watch-styles', watchStyles );
gulp.task( 'watch-scripts', watchScripts );
gulp.task( 'watch-static', watchStatic );


function bundleJavascript () {
	var environment = ( production ? 'production' : 'development' );
	var filepaths = [
		rootPath +'/node_modules/es5-shim/es5-shim.min.js'
		, rootPath +'/repo/public/scripts/vendor/'+ environment +'/**/*.*'
		, rootPath +'/repo/public/scripts/src/**/*.js'
		, '!'+ rootPath +'/repo/public/scripts/src/application.js'
		, '!'+ rootPath +'/repo/public/scripts/src/dataModel.js'
	];

	return gulp
		.src( filepaths )
		.pipe( concat( 'all.js' ) )
		.pipe( gulp.dest( rootPath +'/build/scripts/public/scripts/src/' ) );
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
		.pipe( gulp.dest( rootPath +'/build/styles/public/styles/' ) );
}

function compileVue ( callback ) {
	var environment = ( production ? '.production' : '' );

	webpack( require( rootPath +'/webpack'+ environment +'.config.js' ), ( err, stats ) => {
		if ( err ) throw new util.PluginError( 'webpack', err );

		gulp
			.src( rootPath +'/build/scripts/public/scripts/src/application.js' )
			.pipe( minify() )
			.pipe( gulp.dest( rootPath +'/build/scripts/public/scripts/src' ) );
		
		callback();
    } );
}

function copyFilesToServer ( subdirectory ) {
	var baseFilePath = rootPath +'/build/'+ subdirectory;

	return gulp
		.src( [ baseFilePath +'/**/*.*', baseFilePath +'/**/.*' ], { base: 'build/'+ subdirectory } )
		.pipe( gulp.dest( rootPath +'/server' ) );
}

function copyScriptFilesToServer () {
	return copyFilesToServer( 'scripts' );
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
		.pipe( gulp.dest( rootPath +'/build/static/' ) );
}

function copyStaticFilesToServer () {
	return copyFilesToServer( 'static' );
}

function copyStyleFilesToServer () {
	return copyFilesToServer( 'styles' );
}

function deleteAllScriptFiles () {
	return del( [ rootPath +'/build/scripts' ] );
}

function deleteAllServerFiles () {
	return del( [ rootPath +'/server/**/*', rootPath +'/server/**/*.*', rootPath +'/server/**/.*' ] );
}

function deleteAllStaticFiles () {
	return del( [ rootPath +'/build/static' ] );
}

function deleteAllStyleFiles () {
	return del( [ rootPath +'/build/styles' ] );
}

function handleError ( error ) {
	console.log( error.toString() );
	this.emit( 'end' );
}

function watchScripts () {
	return gulp.watch( [ rootPath +'/repo/public/scripts/**/*.*' ], () => runSequence( 'clean-server', 'clean-scripts', 'build-scripts', 'deploy' ) );
}

function watchStatic () {
	var filepaths = [
		rootPath +'/repo/**/*.*'
		, rootPath +'/repo/**/.*'
		, '!'+ rootPath +'/repo/**/*.babel'
		, '!'+ rootPath +'/repo/**/*.vue'
		, '!'+ rootPath +'/repo/**/*.js'
		, '!'+ rootPath +'/repo/**/*.less'
		, '!'+ rootPath +'/repo/**/*.css'
	];

	return gulp.watch( filepaths, () => runSequence( 'clean-server', 'clean-static', 'build-static', 'deploy' ) );
}

function watchStyles () {
	var filepaths = [
		rootPath +'/repo/public/styles/**/*.*'
		, '!'+ rootPath +'/repo/public/styles/vendor'
	];

	return gulp.watch( filepaths, () => runSequence( 'clean-server', 'clean-styles', 'build-styles', 'deploy' ) )
}
