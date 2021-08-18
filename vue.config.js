module.exports = {
  devServer: {
    //改变运行在3000端口
    port: 3000,
    open: true,
    //解决跨域
    proxy: "https://www.escook.cn"
  }
}
