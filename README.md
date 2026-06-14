# Soda-Music-Download
Soda(qishui) Music Download / 汽水音乐下载，支持 Chrome / Firefox 浏览器扩展和油猴脚本。

<a href="https://chromewebstore.google.com/detail/aeokelcdhpmgdbncehledgoplhahnacm"><img src="./images/Google_Chrome_icon_(February_2022).svg" width="64" height="64"></a><a href="https://addons.mozilla.org/firefox/addon/soda-qishui-music-download/"><img src="./images/Firefox_logo,_2019.svg" width="64" height="64"></a><a href="https://microsoftedge.microsoft.com/addons/detail/hmcacchmdkhhpadohabcoioafojnnmbm"><img src="./images/Microsoft_Edge_logo_(2019).svg" width="64" height="64"></a>

[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/aeokelcdhpmgdbncehledgoplhahnacm?style=flat-square)](https://chromewebstore.google.com/detail/aeokelcdhpmgdbncehledgoplhahnacm)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/soda-qishui-music-download?style=flat-square)](https://addons.mozilla.org/firefox/addon/soda-qishui-music-download/)
[![Edge Add-on Version](https://img.shields.io/badge/dynamic/json?label=edge%20add-on&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fhmcacchmdkhhpadohabcoioafojnnmbm&style=flat-square)](https://microsoftedge.microsoft.com/addons/detail/hmcacchmdkhhpadohabcoioafojnnmbm)


## 功能

访问以下页面时，在页面标题右侧添加“立即下载”按钮。点击按钮后读取页面变量并下载音频：

- `https://music.douyin.com/qishui/share/track*`
- `https://www.qishui.com/share/track*`


![alt text](images/1280*800.png)



## 调试安装

```sh
sh build-userscript.sh
```
- 工程说明
  - 浏览器扩展使用完整目录：`extension/`
  - 公用代码只在 `extension/shared/download-utils.js` 中维护
- 模版
  - Chrome manifest 模板：`extension/manifest.chrome.json`
  - Firefox manifest 模板：`extension/manifest.firefox.json`
  - 油猴模板源码放在：`userscript/qishui-download.user.template.js`
- 调试目录
  - 油猴最终单文件生成到：`userscript/qishui-download.user.js`
  - Chrome 临时调试目录生成到：`dist/chrome-extension/`
  - Firefox 临时调试目录生成到：`dist/firefox-extension/`
- 构建产物
  - Chrome 扩展发布包生成到：`dist/soda-music-download-chrome-v版本号.zip`
  - Firefox 扩展发布包生成到：`dist/soda-music-download-firefox-v版本号.zip`
  - 油猴最终单文件生成到：`userscript/qishui-download.user.js`




## 免责声明：本项目纯粹用于研究插件开发机制和原理，下载的音乐质量真的差劲，只能听个响。

<p style="color: red;">开源不易，善良的好人们，行行好施舍点银子给我买包烟吧，一块两块不嫌少三块四块会更好，赠人香烟手有余香。——by：爱抽烟的人</p>
<p>
  <img src="https://i.postimg.cc/mk8vWPht/Ali-Pay.webp" alt="支付宝收款码" width="220">
  <img src="https://i.postimg.cc/0jcT1zrz/We-Chat-Pay.webp" alt="微信收款码" width="220">
</p>