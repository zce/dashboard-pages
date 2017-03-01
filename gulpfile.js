/*
 * @Author: iceStone
 * @Date:   2015-08-31 11:40:15
 * @Last Modified by:   iceStone
 * @Last Modified time: 2015-12-30 22:10:58
 */

const gulp = require('gulp')
const through = require('through2')
const xtpl = require('node-xtemplate')
const gulpLoadPlugins = require('gulp-load-plugins')
const browserSync = require('browser-sync').create()
const plugins = gulpLoadPlugins()

const xhtml = () => through.obj((file, encoding, callback) => {
  xtpl.render(file.path, {}, (err, content) => {
    if (err) return callback(err)
    file.contents = new Buffer(content)
    callback(null, file)
  })
})

gulp.task('font', () => {
  return gulp.src('src/fonts/*.*', { base: 'src' })
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('page', () => {
  return gulp.src('src/pages/*.html', { base: 'src' })
    .pipe(xhtml())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('style', () => {
  return gulp.src('src/styles/*.scss', { base: 'src' })
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      outputStyle: 'expanded',
      precision: 10
    }).on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    // .pipe(browserSync.stream({ match: '**/*.css' }))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('script', () => {
  return gulp.src('src/scripts/*.js', { base: 'src' })
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('watch', () => {
  gulp.watch('src/**/*.html', ['page'])
  gulp.watch('src/fonts/**/*.*', ['font'])
  gulp.watch('src/styles/**/*.scss', ['style'])
  gulp.watch('src/scripts/**/*.js', ['script'])
})

gulp.task('default', ['font', 'page', 'style', 'script'], () => {
  browserSync.init({
    port: 2017,
    open: false,
    notify: false,
    startPath: 'pages',
    server: {
      baseDir: ['dist', '.']
    }
  })
  gulp.start('watch')
})
