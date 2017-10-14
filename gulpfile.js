let gulp = require('gulp'),
    // $ = require('gulp-load-plugins')(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    scss=require('gulp-sass');
    cssmin = require('gulp-minify-css'),
    babel = require("gulp-babel"),
    fileinclude = require('gulp-file-include'),
    smushit=require('gulp-smushit'),
    svgmin = require('gulp-svgmin'),
    bower = require('gulp-bower'),
    clean = require('gulp-clean'),
    flatten = require('gulp-flatten'),
    revCollector = require('gulp-rev-collector'),
    stripDebug = require('gulp-strip-debug'),
    gulpSequence=require('gulp-sequence'),
    htmlmin=require('gulp-htmlmin'),
    browserSync = require('browser-sync').create();


gulp.task('admin', function () {
    gulp.src('admin/html/**/*')
        .pipe(htmlmin())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/admin/html'));

});

gulp.task('handlebar', function () {
    gulp.src( ['handlebar/module.min.js','handlebar/hotkeys.min.js','handlebar/uploader.min.js', 'handlebar/simditor.min.js'])
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('editor.js'))
        .pipe(gulp.dest('dist/handlebar'));
    gulp.src('handlebar/index.js')
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('index.js'))
        .pipe(gulp.dest('dist/handlebar'));
});

//不需要合并的js
gulp.task('js', function () {
    gulp.src(['front/js/*.js','!front/js/silder.min.js'])
        // .pipe(stripDebug())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/front/js'));
    gulp.src('front/js/silder.min.js')

        .pipe(gulp.dest('dist/front/js'));

    gulp.src('admin/js/*.js')
         // .pipe(stripDebug())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/admin/js'));
    gulp.src('config/*.js')
        .pipe(stripDebug())
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

//图片压缩
gulp.task('image', function () {
    gulp.src('admin/image/*.{jpg,png}')
    .pipe(smushit())
        .pipe(gulp.dest('dist/admin/image'));
    gulp.src('admin/image/*.ico')
        .pipe(gulp.dest('dist/admin/image'));
    gulp.src('front/image/*.{jpg,png}')
        .pipe(smushit())
        .pipe(gulp.dest('dist/front/image'));
    gulp.src('admin/image/*.ico')
        .pipe(gulp.dest('dist/front/image'));

});

/*字体压缩*/
gulp.task('font', function () {
    gulp.src('front/font/**/*')
        .pipe(gulp.dest('dist/front/font'));
    gulp.src('admin/css/fonts/*')
        .pipe(gulp.dest('dist/admin/css/fonts'))
});

//转移第三方库
gulp.task('library', () => {
    gulp.src(['bower_components/**/*.css', '!bower_components/editor.md/**/*'])
        .pipe(flatten({includeParents: [1, 1]}))
        .pipe(gulp.dest('dist/bower_components'));
    gulp.src(['bower_components/**/*.js', '!bower_components/editor.md/**/*'])
        .pipe(flatten({includeParents: [1, 1]}))
        .pipe(gulp.dest('dist/bower_components'));
    gulp.src(['bower_components/editor.md/**/*'])
        .pipe(gulp.dest('dist/bower_components/editor.md'));
});

//foundation路径替换
gulp.task('replace', () => {
    gulp.src(['./rev.json', './front/html/**/*'])
        .pipe(revCollector())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/front/html/'))
});

// 配置服务器
gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: './dist',
            index: 'admin/html/login.html'
        },
        port: 8888
    });
    // or...配置代理
    /* browserSync.init({
     proxy: "127.0.0.1"
     });*/
    // 监听 html


    gulp.watch(['dist/**/*.html']).on('change', browserSync.reload);

});

gulp.task('clean', function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch('admin/html/**/*.html', ['admin']);
    gulp.watch('front/html/**/*.html', ['replace']);
    gulp.watch(['front/js/*.js', 'admin/js/*.js'], ['js']);
    gulp.watch(['front/css/*.css', 'admin/css/*.css'], ['css']);
    gulp.watch(['front/image/*', 'admin/image/*'], ['image']);
});


gulp.task('default',function (cb) {
   gulpSequence('clean',['library','handlebar','js','image','font','css'],'admin','replace',['server','watch'],cb);
});





