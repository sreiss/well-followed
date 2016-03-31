var gulp = require('gulp'),
    concat = require('gulp-concat'),
    print = require('gulp-print'),
    path = require('path'),
    del = require('del'),
    less = require('gulp-less'),
    filter = require('gulp-filter'),
    minify = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    bowerFiles = require('main-bower-files'),
    ngAnnotate = require('gulp-ng-annotate'),
    templateCache = require('gulp-angular-templatecache'),
    shell = require('gulp-shell'),
	es = require('event-stream'),
	spawn = require('child_process').spawn,
    node;

var resources = {
    "js": {
        "src": "client/src/js/**/*.js",
        "dest": "client/build/js",
        "fileName": "scripts.min.js"
    },
    "less": {
        "src": "client/src/less/**.less",
        "dest": "client/build/css",
        "fileName": "app.min.css"
    },
    "appTemplates": {
        "src": "client/src/app/**/*.html",
        "dest": "client/build/js",
        "module": "wfTemplates",
        "standalone": true
    },
    "appJs": {
        "src": ["client/src/app/**/*.js", "client/src/app/**.js"],
        "dest": "client/build/js",
        "fileName": "app.min.js"
    },
    "appImg": {
        "src": ["client/src/img/**/*.{png,jpg,gif}"],
        "dest": "client/build/img"
    }
};

var bowerConfig = {
    "js": {
        "dest": "client/build/lib/js",
        "fileName": "lib.min.js"
    },
    "css": {
        "dest": "client/build/lib/css",
        "fileName": "lib.min.css"
    },
    "templates": {
        "dest": "client/build/lib/js",
        "module": "wfLibTemplates",
        "standalone": true,
        "transformUrl": function (url) {
            return "template/" + url;
        },
        "filePaths": [
            "client/src/bower_components/angular-ui-bootstrap/template/**/*.html"
        ]
    },
    "fonts": {
        "dest": "client/build/lib/fonts"
    }
};

var getJsFilter = function () {
    return filter('**.js', {restore: true});
};

var getLessFilter = function () {
    return filter('**.less', {restore: true});
};

var getCssFilter = function () {
    return filter('**.css', {restore: true});
};

var getHtmlFilter = function () {
    return filter('**.html', {restore: true});
};

var getFontFilter = function () {
    return filter('**.{eot,svg,ttf,woff,woff2}', {restore: true});
};

gulp.task('server', function () {
	if (node) node.kill()
	node = spawn('node', ['server/server.js'], { stdio: 'inherit' })
	node.on('close', function (code) {
		if (code === 8) {
			gulp.log('Error detected, waiting for changes...');
		}
	});
})

gulp.task('clean', function () {
    var destPaths = [];
    for (var resourceType in resources) {
        var resource = resources[resourceType];

        destPaths.push(resource.dest);
    }
    return del(destPaths);
});

gulp.task('cleanLib', function () {
    var libDestPaths = [];

    libDestPaths.push(bowerConfig.js.dest);
    libDestPaths.push(bowerConfig.css.dest);

    return del(libDestPaths);
});

gulp.task('index', function() {
    return gulp.src('client/src/index.html')
        .pipe(gulp.dest('client/build'));
});

gulp.task('bower', ['cleanLib', 'index'], function () {
    var srcPaths = [];

    var jsPath = bowerConfig.js.dest;
    var cssPath = bowerConfig.css.dest;
    var fontPath = bowerConfig.fonts.dest;

    var jsFilter = getJsFilter();
    var lessFilter = getLessFilter();
    var cssFilter = getCssFilter();
    var fontFilter = getFontFilter();

    gulp.src(bowerConfig.templates.filePaths)
        .pipe(print())
        .pipe(templateCache({
            module: bowerConfig.templates.module,
            standalone: bowerConfig.templates.standalone,
            transformUrl: bowerConfig.templates.transformUrl
            //templateBody: bowerResouces.templates.templateBody
        }))
        .pipe(gulp.dest(jsPath));

    return gulp.src(bowerFiles())
        .pipe(jsFilter)
        .pipe(print())
        //.pipe(uglify())
        .pipe(concat(bowerConfig.js.fileName))
        .pipe(gulp.dest(jsPath))
        .pipe(jsFilter.restore)
        .pipe(lessFilter)
        .pipe(print())
        .pipe(less())
        .pipe(minify())
        .pipe(concat(bowerConfig.css.fileName))
        .pipe(lessFilter.restore)
        .pipe(cssFilter)
        .pipe(print())
        .pipe(minify())
        .pipe(concat(bowerConfig.css.fileName))
        .pipe(gulp.dest(cssPath))
        .pipe(cssFilter.restore)
        .pipe(fontFilter)
        .pipe(print())
        .pipe(gulp.dest(fontPath))
        .pipe(fontFilter.restore);
});

gulp.task('resources', ['clean'], function () {
    var stream;
    for (var resourceType in resources) {
        var options = resources[resourceType];

        if (!!options.src && !!options.dest) {
            var srcPath = options.src;
            var destPath = options.dest;

            var jsFilter = getJsFilter();
            var htmlFilter = getHtmlFilter();
            var lessFilter = getLessFilter();

            if (resourceType == 'appJs') {
                stream = gulp.src(srcPath)
                    .pipe(print())
                    .pipe(jsFilter)
                    .pipe(ngAnnotate())
                    .pipe(jsFilter.restore)
                    .pipe(concat(options.fileName))
                    .pipe(gulp.dest(destPath));
            } else if (resourceType == 'appTemplates') {
                stream = gulp.src(srcPath)
                    .pipe(print())
                    .pipe(templateCache({
                        module: options.module,
                        standalone: options.standalone
                    }))
                    .pipe(gulp.dest(destPath));
            } else if (resourceType == 'appImg') {
                stream = gulp.src(srcPath)
                    .pipe(print())
                    .pipe(gulp.dest(destPath));
            } else {
                stream = gulp.src(srcPath)
                    .pipe(print())
                    .pipe(jsFilter)
                    //.pipe(uglify())
                    .pipe(jsFilter.restore)
                    .pipe(lessFilter)
                    .pipe(less())
                    .pipe(minify())
                    .pipe(lessFilter.restore)
                    .pipe(concat(options.fileName))
                    .pipe(gulp.dest(destPath));
            }
        }
    }
    return stream;
});

gulp.task('default', ['resources'], function () {
    for (var resourceType in resources) {
        var stream;
        var options = resources[resourceType];

        if (!!options.src && !!options.dest) {
            var srcPath = options.src;

            gulp.watch(srcPath, ['resources']);
        }
	}
});
