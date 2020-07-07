"use strict";

/* параметры для gulp-autoprefixer */
var autoprefixerList = [
    'Chrome >= 45',
    'Firefox ESR',
    'Edge >= 12',
    'Explorer >= 10',
    'iOS >= 9',
    'Safari >= 9',
    'Android >= 4.4',
    'Opera >= 30'
];
/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
    build: {
        favicon: 'app/build/',
        html: 'app/build/',
        libs: 'app/src/assets/libs/',
        js: 'app/build/assets/js/',
        css: 'app/build/assets/css/',
        image: 'app/build/assets/image/',
        fonts: 'app/build/assets/fonts/'
    },
    src: {
        favicon: 'app/src/*.ico',
        html: 'app/src/*.html',
        libs: 'app/src/assets/libs/**/*.*',
        js: 'app/src/assets/js/main.js',
        style: 'app/src/assets/style/main.scss',
        image: 'app/src/assets/image/**/*.*',
        fonts: 'app/src/assets/fonts/**/*.*'
    },
    watch: {
        favicon: 'app/src/*.ico',
        html: 'app/src/**/*.html',
        libs: 'app/src/assets/libs/**/*.*',
        js: 'app/src/assets/js/**/*.js',
        css: 'app/src/assets/style/**/*.scss',
        image: 'app/src/assets/image/**/*.*',
        fonts: 'app/srs/assets/fonts/**/*.*'
    },
    clean: './app/build'
};
/* настройки сервера */
var config = {
    server: {
        baseDir: './app/build'
    },
    notify: false
};

/* подключаем gulp и плагины */
var gulp = require('gulp'), // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    uglifyEs = require('gulp-uglify-es').default, // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg	
    pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    del = require('del'), // плагин для удаления файлов и каталогов
    mainBowerFiles = require('main-bower-files');

/* задачи */

// запуск сервера
gulp.task('webserver', function () {
    webserver(config);
});
// обработка библиотек    --->  /*{"overrides" : {*:[]}}*/
gulp.task('libs-js:build', function () {
    return gulp.src(mainBowerFiles('**/*.js', {
        "overrides": {
            "jquery": ["jquery.min.js"]
        }
    }))
        .pipe(gulp.dest(path.build.libs + 'js'));
});


gulp.task('libs-css:build', function () {
    return gulp.src(mainBowerFiles('**/*.css'))
        .pipe(gulp.dest(path.build.libs + 'css'));
});

// сбор html
gulp.task('html:build', function () {
    gulp.src(path.src.html) // выбор всех html файлов по указанному пути
        .pipe(plumber()) // отслеживание ошибок
        .pipe(rigger()) // импорт вложений
        .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
        .pipe(webserver.reload({
            stream: true
        })); // перезагрузка сервера
});

// сбор стилей
gulp.task('css:build', function () {
    gulp.src(path.src.style) // получим main.scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer({ // добавим префиксы
            browsers: autoprefixerList
        }))
        .pipe(cleanCSS()) // минимизируем CSS
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.build.css)) // выгружаем в build
        .pipe(webserver.reload({
            stream: true
        })); // перезагрузим сервер
});

// сбор js
gulp.task('js:build', function () {
    gulp.src(path.src.js) // получим файл main.js
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        .pipe(uglifyEs()) // минимизируем js
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(gulp.dest(path.build.js)) // положим готовый файл
        .pipe(webserver.reload({
            stream: true
        })); // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

// перенос favicon
gulp.task('favicon:build', function () {
    gulp.src(path.src.favicon)
        .pipe(gulp.dest(path.build.favicon));
});

// обработка картинок
gulp.task('image:build', function () {
    gulp.src(path.src.image) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({
                interlaced: true
            }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            })
        ])))
        .pipe(gulp.dest(path.build.image)); // выгрузка готовых файлов
});

// удаление каталога build 
gulp.task('clean:build', function () {
    del.sync(path.clean);
});

// очистка кэша
gulp.task('cache:clear', function () {
    cache.clearAll();
});

// сборка
gulp.task('build', [
    'clean:build',
    'html:build',
    'css:build',
    'favicon:build',
    'libs-js:build',
    'libs-css:build',
    'js:build',
    'fonts:build',
    'image:build'
]);

// запуск задач при изменении файлов
gulp.task('watch', function () {
    gulp.watch(path.watch.favicon, ['favicon:build']);
    gulp.watch(path.watch.html, ['html:build']);
    gulp.watch(path.watch.css, ['css:build']);
    gulp.watch(path.watch.js, ['js:build']);
    gulp.watch(path.watch.libs, ['libs-js:build','libs-css:build']);
    gulp.watch(path.watch.image, ['image:build']);
    gulp.watch(path.watch.fonts, ['fonts:build']);
});

// задача по умолчанию
gulp.task('default', [
    'clean:build',
    'build',
    'webserver',
    'watch'
]);