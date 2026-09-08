# GitHub 项目研究集

记录近期发现的优秀开源项目：为什么值得关注、如何运行、核心实现，以及可以借鉴的设计。

每个子项目独立保存研究笔记、截图和实验代码；本页仅保留摘要与有序索引。

## 项目索引

<!-- PROJECTS:START -->
暂无研究项目。首个项目从 **001** 开始。
<!-- PROJECTS:END -->

## 阅读入口

- [研究目录](projects/)：按固定编号组织的子项目。
- [新增项目与维护约定](CONTRIBUTING.md)：编号、图片、索引和研究流程。
- [子项目说明模板](templates/project/README.md)：复制后填写。
- [Web 演示部署说明](docs/deployment.md)：统一站点、多个演示子路径。

## 目录结构

```text
projects.json                # 项目清单，README 与站点索引的数据来源
projects/001-project-name/   # 独立研究目录，编号永久保留
  README.md                 # 摘要、来源、结论、运行方法和图片说明
  assets/                   # 封面、截图、架构图
  notes/                    # 详细研究笔记
  experiments/              # 自己的验证与实验代码
web/001-project-name/        # 可选：静态演示发布文件
templates/project/          # 子项目模板，不计入正式索引
scripts/build.py            # 校验清单、更新 README、生成展示站点
docs/                       # 维护与部署说明
```

## 本地预览

需要 Python 3.10 或更新版本，无需安装第三方依赖。

```sh
python scripts/build.py
python -m http.server 8000 --directory _site
```

打开 <http://localhost:8000>。站点构建目录 `_site/` 不提交到 Git。

## 来源与许可

研究记录需注明上游仓库、所研究的版本或 commit、原项目许可证。引用代码与图片时保留来源并遵循原许可；本仓库初始化阶段未为原创内容指定统一开源许可证。
