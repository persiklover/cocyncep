gulp = require 'gulp'

# CSS
sass = require 'gulp-sass'
minifyCSS = require 'gulp-csso'
autoprefixer = require 'gulp-autoprefixer'

browserSync = require('browser-sync').create()
notify = require 'gulp-notify'

_public = 'public/'

gulp.task 'html', ->
  gulp.src _public+'index.html'
    .pipe do browserSync.stream

gulp.task 'css', ->
  gulp.src _public+'sass/**/*.{sass,scss}'
    .pipe sass
      outputStyle: 'expanded'
    .on 'error', do notify.onError
    .pipe autoprefixer
      browsers: ['last 15 versions']
    .pipe do minifyCSS
    .pipe gulp.dest _public+'css'
    .pipe browserSync.stream
      match: '**/*.css'

gulp.task 'js', ->
  gulp.src _public+'js/**'
    .pipe do browserSync.stream

gulp.task 'default', gulp.parallel 'html', 'css', 'js', (done) ->
  browserSync.init
    server:
      baseDir: _public
    port: 1337
    notify: off

  gulp.watch _public+'index.html', gulp.parallel 'html'
  gulp.watch _public+'sass/**',    gulp.parallel 'css'
  gulp.watch _public+'js/**',      gulp.parallel 'js'
  do done