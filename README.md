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
