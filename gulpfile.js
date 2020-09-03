const {src , dest, task , watch , series , parallel} = require( 'gulp' );
var rename = require( 'gulp-rename' );
var sourcemaps =  require( 'gulp-sourcemaps' );

//scss extensions
var sass =  require( 'gulp-sass' );
var autoprefixer =  require( 'gulp-autoprefixer' );

//js extensions
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');



var styleSRC = 'src/scss/style.scss';

var styleWatch = 'src/scss/**/*.scss';

var styleDIST = 'css/';

function style(done){
	src(styleSRC)
		.pipe( sourcemaps.init() )
		.pipe( sass(
		{
			errorLogToConsole : true,
			outputStyle : 'compressed'
		}) )
		.on( 'error', console.error.bind( console ) )
		.pipe( autoprefixer({ overrideBrowserslist : ['last 2 versions'], cascade : false }) )
		.pipe( rename({ suffix : '.min' } ))
		.pipe( sourcemaps.write('./') )
		.pipe( dest(styleDIST) );
		
	done();
};


task("style", style);

function watch_files(done)
{
	watch(styleWatch, style);
    done();
}
task("watch",watch_files);
