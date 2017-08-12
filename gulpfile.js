let gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-minify-css'),
    babel = require("gulp-babel"),
    fileinclude = require('gulp-file-include'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    svgmin = require('gulp-svgmin'),
    htmlmin = require('gulp-htmlmin'),
    bower = require('gulp-bower'),
    clean = require('gulp-clean'),
    flatten = require('gulp-flatten'),
    revCollector = require('gulp-rev-collector'),
    browserSync = require('browser-sync').create();


gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(['admin/**/*.html', '!admin/include/**.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin(options))

        .pipe(gulp.dest('dist/admin'))
        .pipe(browserSync.stream());
    gulp.src('front/html/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/front/html'));
});

//不需要合并的js
gulp.task('js', function () {
    gulp.src(['front/js/*.js', '!front/js/simditor.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/front/js'));
    gulp.src('front/js/simditor.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/front/js'));
    gulp.src(['admin/js/*.js', '!admin/js/index.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/admin/js'));
    gulp.src('admin/js/index.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/admin/js'));
    gulp.src('config/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/config'));
});

//不需要合并的css
gulp.task('css', function () {
    gulp.src('front/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/front/css'));
    gulp.src('admin/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/admin/css'))
});

//目前压缩有问题，暂不压缩
gulp.task('image', function () {
    gulp.src('admin/image/*')
    // .pipe(imagemin())
        .pipe(gulp.dest('dist/admin/image'));
    gulp.src('front/image/*')
    // .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('dist/front/image'))

});

gulp.task('font', function () {
    gulp.src('front/font/**/*')
        .pipe(gulp.dest('dist/front/font'));
    gulp.src('admin/css/fonts/*')
        .pipe(gulp.dest('dist/admin/css/fonts'))
});

//转移第三方库
gulp.task('library', () => {
    gulp.src(['bower_components/**/*.css','!bower_components/editor.md/**/*'])
        .pipe(flatten({includeParents: [1, 1]}))
        .pipe(gulp.dest('dist/bower_components'));
    gulp.src(['bower_components/**/*.js','!bower_components/editor.md/**/*'])
        .pipe(flatten({includeParents: [1, 1]}))
        .pipe(gulp.dest('dist/bower_components'));
    gulp.src(['bower_components/editor.md/**/*'])
        .pipe(gulp.dest('dist/bower_components/editor.md'));
});

//foundation路径替换
gulp.task('replace', () => {
    gulp.src(['./rev.json','./front/html/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./dist/front/html/'))
});

// 配置服务器
gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: './dist',
            index:'admin/html/login.html'
        },
        port: 8888
    });
      // or...配置代理
   /* browserSync.init({
        proxy: "127.0.0.1"
    });*/
    // 监听 html


    gulp.watch(['dist/*.html']).on('change', browserSync.reload);

});

gulp.task('clean', function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch('admin/html/**/*.html', ['html']);
    gulp.watch(['front/js/*.js', 'admin/js/*.js'], ['js']);
    gulp.watch(['front/css/*.css', 'admin/css/*.css'], ['css']);
    gulp.watch(['front/image/*', 'admin/image/*'], ['image']);
});

gulp.task('default', ['clean'], function () {
    gulp.start('js', 'css', 'image', 'html', 'font', 'library', 'replace', 'server', 'watch')
});


