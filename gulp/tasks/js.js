import webpack from 'webpack-stream';
import TerserPlugin from 'terser-webpack-plugin';

export const js = () => {
	return app.gulp.src(app.path.src.js, {sourcemaps: true})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: 'JS',
				message: 'Error <%= error.message %>'
			})
		))
		.pipe(webpack({
			mode: 'production',
			optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							keep_fnames: true
						},
						extractComments: false,
					}),
				],
			},
			output: {
				filename: 'app.js'
			}
		}))
		.pipe(app.plugins.include())
		.pipe(app.plugins.beautify.js({
			indent_with_tabs: true,
			indent_size:1,
			max_preserve_newlines: 1
		}))
		.pipe(app.gulp.dest(app.path.build.js))
		.pipe(app.plugins.terser({
			keep_fnames: true,
			format: {
				comments: false,
			}
			//mangle: false
		}))
		.pipe(app.plugins.rename({
			extname: '.min.js'
		}))
		.pipe(app.gulp.dest(app.path.build.js))
		.pipe(app.plugins.browsersync.stream());
}