module.exports = {
  devServer: {
    port: 8083
  },

  transpileDependencies: [
    'vuetify'
  ],

  lintOnSave: true,

  chainWebpack: config => {
    config.module
      .rule('eslint')
      .exclude
      .add(/google/)
      .end();
  }
  
}
