# dsh-finance

财务自由 · DSH 插件：在左侧栏加一个入口，内置整理好的赚钱投资资料库。

![icon](./icon.svg)

## 这是什么

一个 [DeepSeek Harness（DSH）](https://github.com/deepseek-ai) 插件。装上之后，DSH 侧栏会多一个「财务自由」面板，里面是一份已经整理好的「书单 + 纪录片 + 美股博主 + Web3 工具」资料库，可搜索、可标记进度、可写笔记；同时注册一个 `/财务自由` skill，让 AI 也能基于同一份资料库查书、荐书、答疑。

## 内容

| 分类 | 数量 | 说明 |
| --- | --- | --- |
| 📚 书籍 | 16 本 | 入门 / 进阶 / 高级三档，含作者、豆瓣分、一句话简介、PDF 链接 |
| 🎬 纪录片 | 16 部 | 高分金融纪录片，含豆瓣分、时长、年份、国别、在线观看链接 |
| 📺 YouTuber | 23 个 | 美股博主频道，含定位标签、一句话点评、频道链接 |
| 🗂 论坛 / 工具 | 5 个 | 美股论坛、资讯与工具站 |
| 💹 Web3 / 币圈 | 11 组 | 交易所、行情、DeFi、NFT、新闻、数据站（部分带邀请码） |

资料整理自 [codeman008/Financial_freedom](https://github.com/codeman008/Financial_freedom)，内容原样收录。

## 功能

- 全局搜索 + 分区导航
- 书籍 / 纪录片进度标记（想看 → 在读/在看 → 读完/看完）、收藏、笔记
- 「我的记录」汇总 + 导出 / 清空
- 进度保存在浏览器本地（localStorage），关闭不丢
- 附带 `/财务自由` skill：AI 基于资料库查书 / 荐书 / 答疑，不凭空编造

## 安装

DSH 插件通过 profile 的 `package.json` 引入。以本地 link 为例：

1. 把本仓库 clone 或解压到本地；
2. 在你的 DSH profile 的 `package.json` 里，把插件作为依赖 `link:` 进来，并加进 `dsh.profile.bundles`：

   ```json
   {
     "dependencies": {
       "dsh-finance": "link:../dsh-finance"
     },
     "dsh": {
       "profile": {
         "bundles": ["dsh-finance"]
       }
     }
   }
   ```

3. 在 profile 目录 `pnpm install`，然后重启 DSH。

发布到 GitHub 后，也可以直接用 GitHub 地址安装：

```bash
pnpm add github:<用户名>/dsh-finance
```

## 使用

安装并重启后，DSH 左侧栏会出现「财务自由」入口，点开即是资料库页面。对话里也可以直接说「推荐一本理财入门书」「有没有金融纪录片」等，触发 `/财务自由` skill。

## 结构

```
dsh-finance/
├── package.json       # 包元信息 + DSH bundle / client 声明
├── cordis.patch.yml   # Host 半边注入
├── icon.svg           # 侧栏图标
├── download-books.mjs # 开发脚本：下载书籍 PDF 到本地
├── lib/
│   ├── index.js       # Host：/finance/ 页面路由 + skill 注册
│   └── client.js      # 浏览器：侧栏入口 + 主区 iframe
├── gallery/
│   ├── index.html     # 资料库页面
│   └── data.json      # 全部资料（单一数据源）
└── skills/finance/SKILL.md
```

## 打包

```bash
pnpm pack            # 生成 dsh-finance-<version>.tgz
# 或
npm pack
```

## 开发

```bash
# 下载书籍 PDF 到 gallery/books/，并把 data.json 里的 pdf 字段改成本地路径
node download-books.mjs
```

> 注：`download-books.mjs` 是本地开发脚本，随仓库提交，但不会打进 npm tarball。

## License

代码以 [MIT](./LICENSE) 发布。资料数据整理自 [codeman008/Financial_freedom](https://github.com/codeman008/Financial_freedom)，版权归原作者所有。
