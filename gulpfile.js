var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  bowerFiles = require('main-bower-files'),
  concat = require('gulp-concat-sourcemap'),
  deploy = require('gulp-gh-pages'),
  del = require('del'),
  runSequence = require('run-sequence');

var paths = {
  assetsSvg: 'assets/**/*.svg',
  assets: 'src/assets/**/*',
  less: 'src/css/main.less',
  index: 'src/index.html',
  js: ['src/scripts/_init.js', 'src/scripts/lib/*.js', 'src/scripts/**/*.js'],
  build: 'build',
  dist: 'dist'
};

gulp.task('clean', function (cb) {
  return del([paths.build, paths.dist], cb);
});

gulp.task('copy', function () {
  return gulp.src(paths.assets)
    .pipe(gulp.dest(paths.dist + '/assets'));
});

gulp.task('svg2png', function () {
  gulp.src(paths.assetsSvg)
    .pipe($.debug({title: 'svg:'}))
    .pipe($.svg2png())
    .pipe(gulp.dest(paths.build + '/assets'));
});

gulp.task('javascript', function () {
  return gulp.src(paths.js)
    // .pipe($.sort())
    .pipe($.sourcemaps.init())
    .pipe($.iife())
    // .pipe($.babel({
    //     presets: ['es2015']
    // }))
    .pipe(concat('main.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.build));
});

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe($.less())
    .pipe(gulp.dest(paths.build));
});

gulp.task('processhtml', function () {
  return gulp.src(paths.index)
    .pipe($.processhtml())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('inject', ['javascript'], function () {
  return gulp.src(paths.index)
    .pipe($.inject(gulp.src(bowerFiles()), {name: 'bower', relative: true}))
    .pipe(gulp.dest('src'));
});

gulp.task('reload', ['javascript'], function () {
  gulp.src(paths.index)
    .pipe($.connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(paths.js, ['javascript', 'reload']);
  gulp.watch(paths.less, ['less', 'reload']);
  gulp.watch(paths.index, ['reload']);
  gulp.watch(paths.assetsSvg, ['svg2png', 'reload']);
});

gulp.task('connect', function () {
  $.connect.server({
    root: [__dirname + '/src', paths.build],
    port: 9000,
    livereload: false
  });
});

gulp.task('open', function () {
  gulp.src(paths.index)
    .pipe($.open({uri: 'http://localhost:9000'}));
});

gulp.task('minifyJs', function () {
  var all = bowerFiles().concat(paths.build + '/main.js');
  return gulp.src(all)
    .pipe($.uglifyjs('all.min.js', {outSourceMap: false}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minifyCss', ['less'], function () {
  return gulp.src(paths.build + '/main.css')
    .pipe($.minifyCss())
    .pipe(gulp.dest(paths.dist))
});

gulp.task('deploy', function () {
  return gulp.src('dist/**/*')
    .pipe(deploy());
});

gulp.task('default', function () {
  // runSequence('clean', ['inject', 'svg2png', 'less', 'connect', 'watch'], 'open');
  runSequence('clean', ['inject', 'svg2png', 'less', 'connect', 'watch']);
});
gulp.task('build', function () {
  return runSequence('clean', ['copy', 'minifyJs', 'minifyCss', 'processhtml']);
});
