# Web 演示发布目录

每个演示放在与研究目录同名的子目录中，例如 `web/001-project-name/index.html`。

这里只保存静态发布文件。演示源码可放入对应研究项目的 `experiments/`；需要构建的应用先生成静态文件，再复制到这里。

构建脚本只发布 `projects.json` 中声明了 `demo` 的目录。详细配置见 [部署说明](../docs/deployment.md)。
