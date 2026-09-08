# 新增项目与维护约定

## 编号与排序

- 从 `001` 开始递增，目录采用 `编号-英文短名`，例如 `001-example-project`。
- 编号作为永久标识；已有项目不因状态变化重新编号，删除后的编号不复用。
- README 与展示站点都按 `id` 数值升序生成；JSON 中的物理顺序不影响展示顺序。
- 模板与占位说明不计入正式项目。

## 新增研究

1. 将 `templates/project/` 复制为 `projects/001-example-project/`，后续项目使用下一个编号。
2. 填写子项目 README，至少明确来源、研究目标和状态。图片放入该项目的 `assets/`。
3. 在根目录 `projects.json` 数组中加入下面的对象，并替换为实际信息。
4. 执行 `python scripts/build.py`，自动更新根 README 索引并生成展示站点。
5. 检查生成的索引、图片和演示后，提交项目目录、清单以及更新后的 README。

```json
{
  "id": "001",
  "slug": "example-project",
  "name": "示例项目",
  "summary": "一句话描述项目能力与研究重点。",
  "repository": "https://github.com/owner/repository",
  "status": "待研究",
  "tags": ["Web", "开发工具"],
  "cover": null,
  "demo": false
}
```

这只是字段示例，不代表已经收录的项目。

`cover` 为相对子项目目录的图片路径，例如 `assets/cover.png`；没有真实图片时保留 `null`。`demo` 为 `true` 时必须存在 `web/001-example-project/index.html`。可选 `tags` 默认为空列表。

## 研究材料

根 README 保持简短，详细调研放进子项目。截图使用相对路径并附文字说明。上游大型仓库可在本地 `upstream/` 中克隆研究，该目录默认忽略；需要纳入本库的引用代码须明确来源、版本和许可。

更新项目摘要、状态、封面或演示入口时，修改 `projects.json` 后重新运行构建脚本，不直接修改根 README 自动生成区域。
