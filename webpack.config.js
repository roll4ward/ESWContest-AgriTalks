const path = require("path");

module.exports = {
  entry: "./webos/app/src/index", // 번들링할 시작 파일
  output: {
    filename: "bundle.js", // 생성될 번들 파일 이름
    path: path.resolve(__dirname, "dist"), // 번들 파일이 생성될 경로
  },
  mode: "development", // 개발 모드로 설정 (또는 'production'으로 변경 가능)
  module: {
    rules: [
      {
        test: /\.js$/, // .js 파일에 대해
        exclude: /node_modules/, // node_modules 폴더는 제외
        use: {
          loader: "babel-loader", // Babel을 사용해 최신 JavaScript 문법 트랜스파일
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // 최신 JS와 React JSX 처리
          },
        },
      },
      {
        test: /\.css$/i, // 모든 .css 파일에 대해
        use: ["style-loader", "css-loader"], // CSS 로더 사용
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // 이미지 파일들에 대해
        type: "asset/resource", // Webpack의 기본 자원 처리 사용
      },
    ],
  },
  externals: {
    webOS: "webOS", // webOS를 외부 라이브러리로 설정
    WebOSServiceBridge: "WebOSServiceBridge",
  },
  resolve: {
    fallback: {
      fs: false, // 'fs' 모듈은 브라우저 환경에서 사용하지 않으므로 false로 설정
    },
  },
};
