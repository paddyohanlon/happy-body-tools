module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "The Happy Body Tools";
      return args;
    });
  },
};
