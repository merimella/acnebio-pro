const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
                use: []
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
                exclude: [
                    /node_modules\/@react-aria\/ssr/
                ]
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'vendor'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/bootstrap/dist/css')
                ]
            }
        ]
    },
    resolve: {
        alias: {
            Vendor: path.resolve(__dirname, 'vendor/')
        }
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        proxy: {
            '/woocommerce-api.php': {
                target: 'http://localhost',
                changeOrigin: true
            },
            '/acnebio.it': {
                target: 'https://acnebio.it',
                changeOrigin: true,
                pathRewrite: { '^/acnebio.it': '' }
            },
            '/acnebio.roydermal.it': {
                target: 'https://acnebio.roydermal.it',
                changeOrigin: true,
                pathRewrite: { '^/acnebio.roydermal.it': '' }
            }
        }
    },
    devtool: 'source-map'
};
