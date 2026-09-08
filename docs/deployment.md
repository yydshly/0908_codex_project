# Web 展示与 GitHub Pages

一个仓库对应一个 Pages 站点。本库把多个演示组织为站点内的不同目录：

```text
https://yydshly.github.io/0908_codex_project/
https://yydshly.github.io/0908_codex_project/demos/001-example-project/
https://yydshly.github.io/0908_codex_project/demos/002-another-project/
```

以上是预期地址示例，初始化并不代表这些地址已上线。

## 启用发布

2026-09-08 已为本仓库启用 GitHub Actions 类型的 Pages，并完成首次发布：

- [站点总首页](https://yydshly.github.io/0908_codex_project/)
- [005 AI 工程学习地图](https://yydshly.github.io/0908_codex_project/demos/005-ai-engineering-from-scratch/)
- [首次成功部署记录](https://github.com/yydshly/0908_codex_project/actions/runs/34235192483)

下面保留配置与维护步骤。站点只发布已提交到所选分支的项目，不包含工作区中其他尚未提交的研究。

1. 将仓库推送至 GitHub 的 `main` 分支。
2. 打开仓库 **Settings → Pages → Build and deployment**，将 **Source** 设置为 **GitHub Actions**。
3. 在 **Actions → Deploy research site → Run workflow** 选择 `main` 手动发布。后续更新也通过此入口发布；普通推送和 PR 只校验构建。

工作流先校验项目清单和 README 是否同步，再构建 `_site/` 并上传 Pages。首次初始化只提供部署配置，站点是否可访问以工作流成功和 Pages 设置为准。

## 添加演示

将静态入口与资源放在 `web/编号-短名/`，在清单中设置 `demo: true`，运行构建。脚本会复制到 `_site/demos/编号-短名/` 并自动生成入口。

使用相对资源链接，例如 `./assets/app.js`，避免 `/assets/app.js` 指向域名根目录。需要打包的前端应用应将构建 base 配成 `./` 或实际演示子路径。单页应用优先使用 hash 路由，以避免直接刷新子路由时返回 404。

GitHub Pages 仅托管静态内容。需要数据库、私密 API 密钥或服务端进程的项目应另行部署后端；前端构建产物不能包含密钥。

官方参考：[GitHub Pages 概述](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[自定义工作流发布](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
