const merge = require("webpack-merge");
const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");
const tsImportPluginFactory = require("ts-import-plugin");
module.exports = {
  productionSourceMap: process.env.NODE_ENV === "production" ? false : true,
  outputDir:
    process.env.NODE_ENV === "development"
      ? "dist/develop"
      : "dist/shenzhen",
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/styles/variables.scss";`,
      },
      less: {
        modifyVars: {
          red: "#fff",
          blue: "#3eaf7c",
          orange: "#f08d49",
          "text-color": "#111",
        },
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 75,
            propList: ["*",],
            // 该项仅在使用 Circle 组件时需要
            // 原因参见 https://github.com/youzan/vant/issues/1948
            selectorBlackList: ["van-circle__layer",],
          }),
        ],
      },
    },
  },
  chainWebpack: config => {
    config.module
      .rule("ts")
      .use("ts-loader")
      .tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "vant",
                libraryDirectory: "es",
                style: true,
              }),
            ],
          }),
          compilerOptions: {
            module: "es2015",
          },
        });
        return options;
      });
  },
};
