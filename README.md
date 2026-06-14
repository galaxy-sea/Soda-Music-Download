# Soda-Music-Download
Soda(qishui) Music Download / 汽水音乐下载，支持 Chrome / Firefox 浏览器扩展和油猴脚本。

- 项目地址：[galaxy-sea/Soda-Music-Download](https://github.com/galaxy-sea/Soda-Music-Download)
- 作者：ChangJin Wei (魏昌进)

## 功能

访问以下页面时，在页面标题右侧添加“立即下载”按钮。点击按钮后读取页面变量并下载音频：

- `https://music.douyin.com/qishui/share/track*`
- `https://www.qishui.com/share/track*`

首次安装后会弹出通知页面。浏览器扩展会在安装完成时打开通知页；油猴脚本会在首次访问匹配页面时打开一次通知页。





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