const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const HOST = process.env.HOST
const PORT = (process.env.PORT && Number(process.env.PORT)) || '8080'
const utils = require('./utils')
const webpack = require('webpack')



const devWebpackConfig = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer:{
        clientLogLevel: 'warning',
        historyApiFallback: true, //�ڿ�����ҳӦ��ʱ�ǳ����ã���������HTML5 history API���������Ϊtrue�����е���ת��ָ��index.html
        noInfo: false,
        hot: true, // �ȼ���
        host: HOST||'localhost',
        port: PORT,
        inline: true, //�Զ�ˢ��
        open: true, //�Զ��������
        overlay: { warnings: false, errors: true }, // ���������ȫ����ʾ�����errors��warnings��
        quiet: true, // necessary for FriendlyErrorsPlugin // �ն������ֻ�г�ʼ������Ϣ�� webpack �ľ���ʹ����ǲ�������ն˵�
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        //��ʾģ�����·��
        new webpack.NamedModulesPlugin(),
        //����ʾ������Ϣ
        new webpack.NoEmitOnErrorsPlugin(),
    ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = PORT
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port
      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: utils.createNotifierCallback(),
      }))
      resolve(devWebpackConfig)
    }
  })
})