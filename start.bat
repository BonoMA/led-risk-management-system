@echo off
echo 正在启动 LED 风险管理系统...
echo.
echo 请确保已经安装了 Node.js 和 npm
echo.
echo 正在安装依赖...
npm install
echo.
echo 正在启动开发服务器...
echo.
echo 应用将在浏览器中自动打开
echo 如果没有自动打开，请手动访问: http://localhost:3001
echo.
echo 按 Ctrl+C 停止服务器
echo.
npm run dev
pause 