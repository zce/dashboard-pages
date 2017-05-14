const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const browserSync = require('browser-sync').create()
const plugins = gulpLoadPlugins()

const dist = 'docs'

gulp.task('page', () => {
  return gulp.src('src/*.html', { base: 'src' })
    .pipe(plugins.xhtml())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('style', () => {
  return gulp.src('src/**/*.scss', { base: 'src' })
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      outputStyle: 'expanded',
      precision: 10
    }).on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('script', () => {
  return gulp.src('src/**/*.js', { base: 'src' })
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('extra', () => {
  return gulp.src('src/**/*.{woff,woff2,eot,ttf,otf,svg,png,jpg,jpeg,gif}', { base: 'src' })
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('watch', () => {
  gulp.watch('src/**/*.html', ['page'])
  gulp.watch('src/**/*.{woff,woff2,eot,ttf,otf,svg,png,jpg,jpeg,gif}', ['extra'])
  gulp.watch('src/**/*.scss', ['style'])
  gulp.watch('src/**/*.js', ['script'])
})

gulp.task('default', ['extra', 'page', 'style', 'script'], () => {
  browserSync.init({
    port: 9000,
    open: false,
    notify: false,
    server: {
      baseDir: [dist, '.']
    }
  })
  gulp.start('watch')
})
