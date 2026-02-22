## Context

创建一个静态作品集网站来展示孩子的艺术作品。网站需要简单易维护，每个作品都有自己的目录包含所有资源。不需要构建过程或服务器端代码。

## Goals / Non-Goals

**Goals:**
- 使用纯 HTML、CSS 和 JavaScript 创建静态网站
- 每个作品组织在独立目录中，便于维护
- 支持图片和音频
- 确保移动端响应式和可访问性
- 提供添加新作品的简单工作流

**Non-Goals:**
- 仅作为云托管静态界面，无服务器端逻辑

## Decisions

### Decision 1: Directory Structure

每个作品有自己的目录，包含所有资源：

```
works/<work-name>/
├── index.html          # 作品页面（生成）
├── data.json           # 作品元数据
├── images/             # 作品图片
│   └── main.jpg        # 主图片
└── audio/              # 音频文件（可选）
    └── description.mp3 # 音频内容
```

**Rationale:** 这种组织方式使作品作为自包含单元易于管理。添加新作品只需创建包含资源的新目录。

### Decision 2: Artwork Page Generation

作品页面（`index.html`）将从模板文件生成。一个简单的 JavaScript 脚本将读取 `data.json` 并生成 HTML。

**Rationale:** 这避免了为每个作品手动编辑 HTML，同时保持系统简单，无需构建工具。模板确保作品页面之间的一致性。

### Decision 3: Homepage Artwork Listing

主页将通过扫描 `works/` 目录并读取每个 `data.json` 文件来列出作品。JavaScript 脚本将动态生成作品网格。

**Rationale:** 这允许添加新作品而无需手动编辑主页 HTML。主页自动反映 `works/` 目录中的所有作品。

### Decision 4: CSS Architecture

使用单个 CSS 文件，采用移动优先的响应式设计：

- 基础样式：排版、颜色和布局
- 作品列表的网格系统
- 移动端/平板/桌面的响应式断点
- 注重可访问性的样式（焦点状态、对比度）

**Rationale:** 单个 CSS 文件便于维护。移动优先方法确保在所有设备上都有良好性能。

### Decision 5: JavaScript Approach

使用原生 JavaScript 实现：
- 主页作品网格的动态生成
- 从模板生成作品页面
- 基本交互性（图片灯箱、音频播放器控制）
- 可访问性增强

**Rationale:** 无框架依赖使网站轻量且易于维护。

### Decision 6: Maintenance Workflow

1. 创建新目录：`works/<new-artwork>/`
2. 添加图片到 `images/` 子目录
3. 添加音频到 `audio/` 子目录（可选）
4. 创建包含作品元数据的 `data.json`
5. 运行生成脚本创建 `index.html`
6. 主页自动包含新作品

**Rationale:** 这个工作流简单，可以用基本脚本自动化，也可以使用 Claude Code 辅助手动完成。

## Implementation Notes

- 使用语义化 HTML5 元素提高可访问性
- 优化图片以适应网页（合适的大小、格式）
- 为所有图片和音频提供文本替代
- 在移动设备和屏幕阅读器上测试
- 包含维护说明的 README