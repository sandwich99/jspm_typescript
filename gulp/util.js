
var autoprefixer = require('gulp-autoprefixer');




exports.autoprefix = autoprefix;



function autoprefix () {

	return autoprefixer({browsers: [
	'last 2 versions', 'last 4 Android versions'
	]});

}