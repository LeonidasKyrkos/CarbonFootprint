module.exports = {
    css: {
        loaderOptions: {
            scss: {
                prependData: '@import "~@/assets/scss/ethereals.scss";',
            },
        },
    },

    devServer: {
        disableHostCheck: true,
    },

    productionSourceMap: false,

    transpileDependencies: ["color"],
};
