const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const runSequence = require('run-sequence')
const del = require('del')
const browserSync = require('browser-sync')

/**
 * 全部 Gulp 插件
 * @type {Object}
 */
const $ = gulpLoadPlugins()

/**
 * Browser Sync
 * @type {Object}
 */
const bs = browserSync.create()

/**
 * 路径配置
 * @type {Object}
 */
const config = {
  src: 'src',
  dist: 'dist',
  debug: process.env.NODE_ENV !== 'production'
}

/**
 * 处理临时文件删除
 */
gulp.task('clean', del.bind(null, [config.dist]))

/**
 * 处理样式编译任务
 */
gulp.task('styles', () => {
  return gulp.src(`${config.src}/assets/scss/*.scss`, { base: config.src })
    .pipe($.plumber())
    .pipe($.if(config.debug, $.sourcemaps.init()))
    .pipe($.sass.sync({ outputStyle: 'expanded' }).on('error', $.sass.logError))
    // https://github.com/gulp-sourcemaps/gulp-sourcemaps/issues/60
    .pipe($.if(!config.debug, $.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] })))
    .pipe($.if(config.debug, $.sourcemaps.write()))
    .pipe($.rename(p => { p.dirname = p.dirname.replace('scss', 'css') }))
    .pipe(gulp.dest(config.dist))
    .pipe(bs.reload({ stream: true }))
})

/**
 * 处理脚本编译任务
 */
gulp.task('scripts', () => {
  return gulp.src(`${config.src}/assets/js/*.js`, { base: config.src })
    .pipe($.plumber())
    .pipe($.if(config.debug, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(config.debug, $.sourcemaps.write('.')))
    .pipe(gulp.dest(config.dist))
    .pipe(bs.reload({ stream: true }))
})

/**
 * 处理图片压缩任务
 */
gulp.task('images', () => {
  return gulp.src(`${config.src}/assets/img/*`, { base: config.src })
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest(config.dist))
})

/**
 * 处理字体文件拷贝任务
 */
gulp.task('fonts', () => {
  return gulp.src(`${config.src}/assets/font/*`, { base: config.src })
    .pipe(gulp.dest(config.dist))
})

/**
 * 处理额外文件的拷贝
 */
gulp.task('extras', () => {
  return gulp.src(`${config.src}/*`)
    .pipe($.if({ isFile: true }, gulp.dest(config.dist)))
})

/**
 * 处理页面模板编译任务
 */
gulp.task('pages', () => {
  return gulp.src(`${config.src}/pages/*.pug`, { base: `${config.src}/pages` })
    .pipe($.plumber())
    .pipe($.pug({ pretty: true }))
    .pipe($.replace('../assets', 'assets'))
    .pipe(gulp.dest(config.dist))
})

/**
 * 处理编译任务
 */
gulp.task('compile', cb => {
  runSequence(['styles', 'scripts', 'images', 'fonts', 'extras', 'pages'], cb)
})

/**
 * 默认任务
 */
gulp.task('build', cb => {
  config.debug = false
  runSequence('clean', 'compile', cb)
})

/**
 * 部署到 GitHub Pages
 */
gulp.task('deploy', ['build'], () => {
  return gulp.src(`${config.dist}/**/*`)
    .pipe($.ghPages())
})

/**
 * 启动一个 Browser Sync 服务器
 */
gulp.task('serve', () => {
  return runSequence(['clean'], ['styles', 'scripts', 'pages'], () => {
    bs.init({
      notify: false,
      port: 2080,
      server: {
        baseDir: [config.dist, config.src],
        routes: { '/node_modules': 'node_modules' }
      },
      plugins: [
        {
          module: 'bs-html-injector',
          options: {
            files: [`${config.dist}/**/*.html`]
          }
        }
      ]
    })

    gulp.watch([
      `${config.src}/assets/img/**/*`,
      `${config.src}/assets/font/**/*`
    ]).on('change', bs.reload)

    gulp.watch(`${config.src}/assets/scss/**/*.scss`, ['styles'])
    gulp.watch(`${config.src}/assets/js/**/*.js`, ['scripts'])
    gulp.watch(`${config.src}/**/*.pug`, ['pages'])
  })
})

/**
 * 启动一个 Browser Sync 服务器
 */
gulp.task('serve:dist', ['build'], () => {
  browserSync.init({
    notify: false,
    port: 2090,
    server: {
      baseDir: config.dist
    }
  })
})
