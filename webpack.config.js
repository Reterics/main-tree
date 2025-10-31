const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config.js');

const postCSSLoader = defaults.module.rules
    .find((rule) => rule.test && rule.test.toString().includes("css"))
    .use.find((use) => use.loader && use.loader.includes("postcss-loader"));

// Add Tailwind to the PostCSS plugins
postCSSLoader.options.postcssOptions.plugins = [
    require("@tailwindcss/postcss"),
    ...(postCSSLoader.options.postcssOptions.plugins || [])
];


module.exports = {
    ...defaults,
    entry: {
        scripts: path.resolve( process.cwd(), 'assets/src', 'scripts.ts' ),
        admin: path.resolve( process.cwd(), 'assets/src', 'admin.tsx' )
    },
    output: {
        filename: '[name].js',
        path: path.resolve( process.cwd(), 'assets/public' ),
    },
    module: {
        ...defaults.module,
        rules: [
            ...defaults.module.rules,
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json',
                            transpileOnly: true,
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx', ...(defaults.resolve ? defaults.resolve.extensions || ['.js', '.jsx'] : [])]
    }
};