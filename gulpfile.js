//build file
var
	gulp = require("gulp"),
	ts = require("gulp-typescript"),
	typescript = require("typescript"),

	del = require("del"), //删除文件
	watch = require("gulp-watch"),
	inject = require("gulp-inject"), //将js css 可以注入到 index.html 等模板中
	plumber = require("gulp-plumber"),
	concat = require("gulp-concat"),
	autoprefixer = require("gulp-autoprefixer"),
	cache = require("gulp-cached"),
	changed = require("gulp-changed"),
	newer = require("gulp-newer"),
	sass = require("gulp-sass"),
	filter = require("gulp-filter"),
	_ =  require("lodash");



var changed = require("gulp-changed");
var vinylPaths = require('vinyl-paths');
var runSequence = require('run-sequence'); // 按顺序执行task
var browserSync = require('browser-sync').create();// browser sync
var jade = require('gulp-jade');
var argv = require('minimist')(process.argv.slice(2)); // gulp 参数
var ngAnnotate = require('gulp-ng-annotate'); // angular 注解
var cache = require('gulp-cached');

var tank = require('./gulp/tank');

var	tsProject = ts.createProject('tsconfig.json', {
	typescript: typescript,
	noEmitOnError: false,
	declarationFiles: true

	}); // typescript 配置


//// 代理到api服务器 配合 browserSync 使用
//https://github.com/chimurai/http-proxy-middleware/blob/master/examples/browser-sync/index.js
var proxyMiddleware = require('http-proxy-middleware');
var yaml = require('js-yaml');
var fs = require('fs');
var url = require('url');



try {
    var options = yaml.safeLoad(fs.readFileSync('./config.yaml', 'utf-8'));
} catch (error) {
    throw new Error(error);
}

var path = options.path;



gulp.task('default', function () {
	var tsResult = gulp.src("src/**/*.ts")
		.pipe(ts(tsProject));

	return tsResult.js.pipe(gulp.dest("dist"));
});

/**
 * 模拟服务器
 */
gulp.task('serve', ['build'], function(){

	var proxy = proxyMiddleware(options.route, options.proxyOptions);

	options.browserSync.server.middleware.push(proxy);
	browserSync.init(options.browserSync);

	gulp.watch(path.scss, ['sass-dev'])
		// .on('change', browserSync.stream({match: '**/*.css'}));
	gulp.watch(path.jade, ['jade'])
		// .on('change', browserSync.reload);
	gulp.watch(path.js, ['es6'])
		.on('change', browserSync.reload);
})


gulp.task('es6', function(){

	var tsResult = gulp.src(path.ts)
		.pipe(plumber())
		.pipe(filterNonCodeFiles())
		.pipe(changed(path.output, { extension: '.js' }))
		.pipe(ts(tsProject));

	return tsResult.js.pipe(gulp.dest(path.output));
})

gulp.task('jade', function(){

	return gulp.src(path.jade)
		.pipe(cache("jade"))
		.pipe(plumber())
		.pipe(changed(path.output, {extension: '.html'}))
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest(path.output));


})



gulp.task('sass-dev', function(){

	return gulp.src(path.scss)
		.pipe(filterNonCodeFiles())
		.pipe(plumber())
		.pipe(changed(path.output, {extension: '.css'}))
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(tank("css"))
		.pipe(concat("app.css"))
		.pipe(gulp.dest(path.output));

})


gulp.task('clean', function(done){
	del([path.output, path.release], done);
})


gulp.task('build', function(done){
	runSequence('clean', ['jade', 'es6', 'sass-dev'], sequenceComplete(done));
})


/**
 * gulp src stream 中过滤不需要的文件
 */
function filterNonCodeFiles() {
  return filter(function(file) {
    return !/demo|module\.json|\.spec.js|\.spec.ts|README/.test(file.path);
  });
}


//private

/**
 * 序列任务完成
 */
function sequenceComplete(done) {
  return function (err) {
    if (err) {
      var error = new Error('build sequence failed');
      error.showStack = false;
      done(error);
    } else {
      done();
    }
  };
}
