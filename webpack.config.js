const path = require('path');
module.exports = {
    mode:'production',
    entry: './src/apr.js',  // 表示webpack的入口
    output: {
        filename: 'apr.js',  // 表示webpack输出的文件名字叫这个 在本例中在index.html文件中以script的形式进行了引入
        path: path.resolve(__dirname, 'dist'),  // 表示输出到哪一个文件目录
    },
    module: {
        rules: [
            {
                test: /\.css$/i,  // 它这里是使用正则来进行匹配所有后缀为css的文件
                use: [
                    {
                        loader: 'style-loader',
                        options: {injectType: 'singletonStyleTag'},
                        // 这里需要注意 style-loader 似乎是需要加入到 css-loader之前的 其主要的作用是将引入的css文件以style标签的形式引入本例的index.html文件中
                    },
                    {
                        loader: "css-loader",  
                        options: {
                            modules: {
                                auto: (r) => r.endsWith(".min.css"),
                                // auto: (r) => r.endsWith(".css"),
                                localIdentName: "apr-[local]-[hash:base64:5]"
                            },

                        },
                    }
                ],

            },
        ],
    },
};
