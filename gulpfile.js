/**编译reactjs 相关 author eric**/
var gulp = require('gulp');//工程自动化
var babel = require('gulp-babel');//语法转换
var jshint = require('gulp-jshint');//检查语法
var concat = require('gulp-concat');//文件合并
var rename = require('gulp-rename');//文件改名
var uglify = require('gulp-uglify');//文件压缩
var react = require('gulp-react');//react 编译
var clean = require('gulp-clean');//清理文件
var del = require('del');//清理文件

//编译reactjs  jsx形式为es5
/*gulp.task('babel', function (){
    return gulp.src('public/js/plugins/view.jsx')
        .pipe(babel({
            presets: ['es2015']
        }))
		.pipe(jshint())
    	.pipe(jshint.reporter('default'))
    	.pipe(rename(function (path) {
		    path.basename += ".min";
		 }))
        .pipe(gulp.dest('public/js/plugins/'));
});*/
gulp.task('clean', function() {
	return gulp.src('public/js/plugins/view.js')
	// del(["public/js/plugins/view.js"]);
});
gulp.task('react',function () {
    return gulp.src('public/js/plugins/view.jsx')
        .pipe(react())
    	.pipe(jshint())
    	.pipe(jshint.reporter('default'))
    	/*.pipe(rename(function (path) {
		    path.basename += ".min";
		 }))*/
        .pipe(gulp.dest('public/js/plugins/'));
});

/*gulp.task('watch', function() {
    gulp.watch('public/js/plugins/*.js', ['babel']);
});
*/
gulp.task('watch', function() {
    gulp.watch('public/js/plugins/view.jsx', ['react']);
});

// gulp.task("default",["babel","watch"])
gulp.task("default",["clean"],function(){
	gulp.start("react","watch");
})