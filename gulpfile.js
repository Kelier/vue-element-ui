let gulp = require('gulp'),
    // $ = require('gulp-load-plugins')(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-minify-css'),
    babel = require("gulp-babel"),
    fileinclude = require('gulp-file-include'),
    clean = require('gulp-clean'),
    flatten = require('gulp-flatten'),
    revCollector = require('gulp-rev-collector'),
    stripDebug = require('gulp-strip-debug'),
    gulpSequence=require('gulp-sequence'),
    htmlmin=require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create();


gulp.task('admin', function () {
    return gulp.src('admin/html/**/*')
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
    return gulp.src('handlebar/index.js')
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('dist/handlebar'));
});

//不需要合并的js
gulp.task('frontjs', function () {
    gulp.src(['front/js/*.js','!front/js/silder.min.js','!front/js/flowplayer.min.js','!front/js/plupload.full.min.js'])
        // .pipe(stripDebug())
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/front/js'));
    return gulp.src(['front/js/silder.min.js','front/js/flowplayer.min.js','front/js/plupload.full.min.js'])

        .pipe(gulp.dest('dist/front/js'));
});

gulp.task('adminjs', function () {

    gulp.src('admin/js/*.js')
    // .pipe(stripDebug())
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/admin/js'));
    return gulp.src('config/*.js')
        .pipe(stripDebug())
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/config'));
});

//不需要合并的css
gulp.task('css', function () {
    gulp.src('front/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/front/css'));
    gulp.src('front/css/**/**')
        .pipe(gulp.dest('dist/front/css'));
    return gulp.src('admin/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/admin/css'))
});

//图片压缩
gulp.task('image', function () {
    // gulp.src('admin/image/*.{jpg,png}')
    // .pipe(smushit())
    //     .pipe(gulp.dest('dist/admin/image'));
    // gulp.src('admin/image/*.ico')
    //     .pipe(gulp.dest('dist/admin/image'));
    // gulp.src('front/image/*.{jpg,png}')
    //     .pipe(smushit())
    //     .pipe(gulp.dest('dist/front/image'));
    // gulp.src('admin/image/*.ico')
    //     .pipe(gulp.dest('dist/front/image'));
    gulp.src('admin/image/*.{jpg,png}')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/admin/image'));
    gulp.src('admin/image/*.ico')
        .pipe(gulp.dest('dist/admin/image'));
    gulp.src('front/image/*.{jpg,png}')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/front/image'));
    return gulp.src('admin/image/*.ico')
        .pipe(gulp.dest('dist/front/image'));

});

/*字体压缩*/
gulp.task('font', function () {
    gulp.src('front/font/**/*')
        .pipe(gulp.dest('dist/front/font'));
    return gulp.src('admin/css/fonts/*')
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
    return gulp.src(['bower_components/editor.md/**/*'])
        .pipe(gulp.dest('dist/bower_components/editor.md'));
});

//foundation路径替换
gulp.task('replace', () => {
    return gulp.src(['./rev.json', './front/html/**/*'])
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
            baseDir: 'dist/',
            index: 'admin/html/login.html'
        },
        port: 8888
    });
    // or...配置代理
    /* browserSync.init({
     proxy: "127.0.0.1"
     });*/
    // 监听 html

    gulp.watch(['dist/**/*']).on('change', browserSync.reload);


});

gulp.task('clean', function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch('admin/html/**/*.html', ['admin']);
    gulp.watch('front/html/**/*.html', ['replace']);
    gulp.watch('front/js/*.js', ['frontjs']);
    gulp.watch(['admin/js/*.js','config/*.js'], ['adminjs']);
    gulp.watch(['front/css/*.css', 'admin/css/*.css'], ['css']);
    gulp.watch(['front/image/*', 'admin/image/*'], ['image']);

});



gulp.task('default',function (cb) {
   gulpSequence('clean',['library','handlebar','frontjs','adminjs','image','font','css'],'admin','replace',['server','watch'],cb);
});

// gulp.task('default', ['library','handlebar','frontjs','adminjs','image','font','css','admin','replace','server'], function() { //执行完[]任务后再执行minicss任务
//     gulp.watch('admin/html/**/*.html', ['admin']);
//     gulp.watch('front/html/**/*.html', ['replace']);
//     gulp.watch('front/js/*.js', ['frontjs']);
//     gulp.watch(['admin/js/*.js','config/*.js'], ['adminjs']);
//     gulp.watch(['front/css/*.css', 'admin/css/*.css'], ['css']);
//     gulp.watch(['front/image/*', 'admin/image/*'], ['image']);
// });



