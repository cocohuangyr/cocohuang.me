# Coco Huang · Personal Website V1

一个纯 HTML、CSS 和少量 JavaScript 的个人网站。没有框架、依赖安装、数据库、登录、CMS 或第三方追踪器。插画、图标和字体均不依赖外部请求。

## 你之后怎样更新

你不需要亲自修改代码。直接把照片、视频、社交链接或想改的文字发给我，并告诉我「更新 Coco 的个人网站」。我会替换内容、检查手机和桌面效果，再发布更新。

- 换头像：提供一张照片即可，建议竖版，人物位于画面中间。
- 放介绍视频：提供 MP4 和一张封面图。可同时提供英文 WebVTT 字幕。
- 更新作品：提供项目名字、简介、封面、链接，以及可选演示视频。
- 修改社交链接：直接提供 YouTube、LinkedIn、X、Instagram 和 Email 的真实地址。

目前所有头像、视频封面都是原创 SVG 占位插画。所有视频明确显示 Coming soon；社交按钮会提示链接尚未配置。没有虚构社交主页、播放次数或产品成果。

## 文件结构

```text
content/site.json      所有个人资料、项目、视频和社交链接
src/index.html         页面布局模板
src/styles.css         配色、响应式排版、轻量动效
src/app.js             手机菜单、项目弹窗、视频播放
src/assets/            本地插画；以后也在这里放照片和视频
src/_headers           Cloudflare 静态托管响应头
src/404.html           找不到页面时的友好提示
scripts/build.mjs      将内容和模板生成静态网站，无第三方依赖
scripts/serve.mjs      本地预览服务器
dist/                  可直接发布的完整静态网站
.openai/hosting.json   私人预览的 Site 标识与静态目录
```

以下内容供之后协助维护的开发者或助手使用，Coco 不需要执行。

## 本地预览

需要 Node.js 20 或更新版本，无需 `npm install`。

```sh
npm run build
npm run preview
```

打开 http://127.0.0.1:4173 。也可将 `dist/` 发布到任意静态主机。使用 HTTP 预览以保持与正式托管相同的安全行为。

## 内容配置

在 `content/site.json` 中维护内容，再执行 `npm run build`。

- `portrait.image`：本地 `assets/` 图片或 HTTPS 图片；设置 `placeholder: false` 后移除占位标记，并填写真实 `alt`。
- `featuredVideo.src`：MP4 文件路径或 HTTPS 地址；留空时展示占位，配置后点击播放。
- `featuredVideo.poster`：视频封面。
- `featuredVideo.captions`：可选 WebVTT 字幕。默认字幕语言为英语，其他语言请同步调整 `src/app.js`。
- `projects[].url`：项目地址，留空时保留介绍弹窗。
- `projects[].demo.src`：可选产品演示视频，配置后在项目弹窗中显示原生视频控件。
- `videos[]`：三个视频的标题、说明、封面、文件及可选字幕。
- `socials[].url`：真实 HTTPS 主页地址，Email 使用 `mailto:`。

视频仅在用户点击时加载，使用原生播放、暂停、音量、字幕及全屏控件；关闭弹窗会停止播放。移动端使用 `playsinline`。V1 没有强制自动播放或背景视频。

使用同域视频可直接播放；外部视频与字幕需要正确的 MIME 类型及 CORS 配置。较大的视频可在正式内容上线时接入 Cloudflare R2 或 Stream，V1 不创建这些付费或存储资源。

## 发布与域名

`dist/` 是唯一需要发布的目录。Cloudflare Pages 可使用构建命令 `npm run build`、输出目录 `dist`；也可以 Direct Upload 上传该目录。无需运行服务器、安装框架或配置数据库。

目标正式域名为 `cocohuang.me`。在真正公开发布前，将真实照片、视频和社交链接补充完整会让网站更有个人感。Site 的默认预览保持私人访问，不会为了部署修改访问权限。

## GitHub 仓库

网站仓库：[cocohuangyr/cocohuang.me](https://github.com/cocohuangyr/cocohuang.me)，默认分支为 `main`。本地 `origin` 指向此仓库。

源码和已生成的静态文件通过已授权的 GitHub 连接同步，本地与远程 `main` 保持一致。原本的本地提交历史保留在 `local-main-before-github-sync` 备份分支中。

保留仓库创建时的初始提交，以及 Node 模板 `.gitignore` 的原始内容。网站的源文件和可直接托管的 `dist/` 均纳入版本管理；`dist/` 已被跟踪，所以 Node 模板中的忽略规则不会影响后续更新。

本地 `site-preview-history` 分支保留首次私人预览的 Git 历史。本地截图目录、系统文件和临时打包文件通过 `.git/info/exclude` 忽略，不上传到 GitHub，也不修改远程 `.gitignore`。

本次仅连接并同步 GitHub 源码，不启用 GitHub Pages、Cloudflare 自动部署或域名绑定。之后可将 Cloudflare Pages 连接至此仓库，使用上面的构建命令和输出目录。

## 无障碍和性能

- 语义化标题、导航、主内容和页脚，提供跳到正文链接。
- 手机菜单包含展开状态；原生 dialog 提供焦点限制，Escape 关闭并恢复焦点。
- 所有内容直接输出到 HTML；JavaScript 关闭时正文和导航仍可读取。
- 支持系统减少动态效果设置；不使用重型动画库。
- 图片有固定比例与尺寸，非首屏图片延迟加载。
- 无外部字体、分析脚本、Cookie 或第三方嵌入播放器。
- 安全响应头由支持 `_headers` 的静态主机应用。

检查结果见 `QA.md`。
