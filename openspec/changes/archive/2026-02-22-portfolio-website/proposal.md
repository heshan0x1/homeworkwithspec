## Why

创建一个简单、易维护的静态网站来展示我女儿的艺术作品集。网站需要便于更新新作品，并且方便家人和朋友访问。每个作品应有自己的目录，包含所有资源文件，便于维护。

## What Changes

- 使用纯 HTML、CSS 和 JavaScript 创建静态网站
- 构建展示作品分类和近期作品的主页
- 为每个作品创建独立的目录，包含各自的资源（图片、音频、数据）
- 作品支持展示文字描述、图片和音频内容
- 确保移动端友好和可访问性设计
- 实现维护工作流：添加新作品时创建目录并从模板生成 HTML

## Capabilities

### New Capabilities
- `static-portfolio`: 展示作品集的静态网站，支持文字、图片和音频，作品组织在独立目录中便于维护

### Modified Capabilities
<!-- 没有修改现有能力 -->

## Impact

- `index.html`: 主页面，展示分类和作品网格
- `works/<work-name>/index.html`: 单个作品页面
- `works/<work-name>/images/`: 作品图片资源
- `works/<work-name>/audio/`: 作品音频资源
- `works/<work-name>/data.json`: 作品元数据
- `styles/main.css`: 整个网站的样式
- `scripts/main.js`: 增强功能的 JavaScript
- `scripts/generate-work.js`: 从模板生成作品页面的脚本