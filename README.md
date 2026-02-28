# 作品集网站

一个简单的静态作品集网站，用于展示艺术作品。使用纯HTML、CSS和JavaScript构建，无需构建工具或服务器端代码。

## 功能特性

- 响应式设计，支持移动端和桌面端
- 作品分类浏览和筛选
- 每个作品独立页面，支持图片和音频内容
- 音频自动播放功能，延迟1秒启动以提升用户体验
- 可访问性优化（键盘导航、屏幕阅读器支持）
- 易于维护的作品目录结构

## 项目结构

```
├── index.html              # 主页
├── 404.html               # 404错误页面
├── styles/
│   └── main.css           # 主要样式文件
├── scripts/
│   ├── main.js            # 主JavaScript文件
│   └── generate-work.js   # 作品页面生成脚本（Node.js）
├── data/
│   └── artworks.json      # 作品数据索引
└── works/
    ├── sunset-painting/   # 示例作品：日落山水
    │   ├── index.html     # 作品页面
    │   ├── data.json      # 作品元数据
    │   ├── images/        # 作品图片
    │   └── audio/         # 音频文件（可选）
    ├── flower-drawing/    # 示例作品：春日花朵
    └── ...                # 其他作品
```

## 添加新作品

### 方法一：手动创建

1. 在 `works/` 目录下创建新作品目录，例如 `works/my-new-artwork/`
2. 创建作品元数据文件 `data.json`，参考现有示例
3. 将图片文件放入 `images/` 子目录
4. 如有音频文件，放入 `audio/` 子目录
5. 创建 `index.html` 作品页面，可复制现有模板修改

### 方法二：使用生成脚本

1. 在 `works/` 目录下创建新作品目录
2. 创建 `data.json` 文件
3. 运行生成脚本：
   ```bash
   node scripts/generate-work.js my-new-artwork
   ```
   或生成所有作品页面：
   ```bash
   node scripts/generate-work.js
   ```

### data.json 结构

```json
{
    "id": "unique-id",
    "title": "作品标题",
    "category": "作品分类",
    "date": "创作时间",
    "description": "作品描述",
    "medium": "创作媒介",
    "size": "作品尺寸",
    "materials": ["材料1", "材料2"],
    "images": [
        {
            "src": "images/main.jpg",
            "alt": "图片描述",
            "description": "图片说明"
        }
    ],
    "audio": {
        "src": "audio/description.mp3",
        "duration": "音频时长（秒）",
        "transcript": "音频文字转录"
    },
    "createdAt": "创建日期",
    "updatedAt": "更新日期"
}
```

## 本地开发

1. 克隆或下载项目
2. 在浏览器中打开 `index.html` 即可查看
3. 无需安装任何依赖

## 部署

这个静态网站可以部署到任何静态网站托管服务：

- **GitHub Pages**: 将项目推送到GitHub仓库，启用GitHub Pages
- **Netlify**: 拖拽项目文件夹到Netlify Drop
- **Vercel**: 连接Git仓库自动部署
- **传统虚拟主机**: 通过FTP上传所有文件

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 可访问性

- 符合WCAG 2.1 AA标准
- 完整的键盘导航支持
- 图片alt文本
- 音频文字转录
- 高对比度模式支持

## 维护说明

### 更新主页作品列表

编辑 `data/artworks.json` 文件，添加或修改作品信息。

### 更新分类

分类信息自动从作品数据中提取。修改 `data/artworks.json` 文件中每个作品的 `category` 字段，网站将自动生成相应的分类和作品数量统计。

### 自定义样式

编辑 `styles/main.css` 文件，修改颜色、字体、布局等。

### 添加新功能

编辑 `scripts/main.js` 文件，添加JavaScript功能。

## 文件规格

*注意：示例作品中的图片和音频文件为占位文件，实际使用时请替换为您自己的作品文件。*

### 图片文件

作品集网站使用以下图片文件规格：

#### 主图片 (main.jpg)
- **尺寸**: 建议 800×600 像素
- **格式**: JPEG (推荐), PNG, WebP
- **文件大小**: 建议不超过 500KB
- **命名**: `images/main.jpg`
- **说明**: 作品的主要展示图片，应清晰展示作品全貌

#### 缩略图 (thumbnail.jpg)
- **尺寸**: 建议 200×150 像素
- **格式**: JPEG (推荐)
- **文件大小**: 建议不超过 100KB
- **命名**: `images/thumbnail.jpg`
- **说明**: 用于主页作品网格的小尺寸预览图

#### 细节图片 (可选)
- **尺寸**: 建议 400×300 像素
- **格式**: JPEG, PNG
- **文件大小**: 建议不超过 300KB
- **命名**: `images/detail-1.jpg`, `images/detail-2.jpg` 等
- **说明**: 展示作品细节的附加图片

### 音频文件

#### 作品说明音频 (description.mp3)
- **格式**: MP3 (推荐), OGG, WAV
- **时长**: 建议不超过 5分钟
- **文件大小**: 建议不超过 5MB
- **命名**: `audio/description.mp3`
- **内容**: 作品创作背景、技巧说明或艺术家解读
- **文字转录**: 应为音频内容提供文字转录，以支持可访问性

### 文件组织

每个作品的文件应组织如下：
```
works/<work-name>/
├── images/
│   ├── main.jpg          # 主图片 (必须)
│   ├── thumbnail.jpg     # 缩略图 (必须)
│   └── detail-1.jpg      # 细节图片 (可选)
└── audio/
    └── description.mp3   # 音频文件 (可选)
```

## 示例作品

项目包含6个示例作品：
1. **日落山水** - 水彩画作品，带音频说明
2. **春日花朵** - 铅笔素描作品
3. **家庭肖像** - 丙烯画作品，带音频说明
4. **黏土小动物** - 黏土雕塑作品
5. **冬日雪景** - 油画作品，带音频说明
6. **蝴蝶速写** - 彩色铅笔作品

## 打包发布

网站开发完成后，可以使用打包脚本将实际网站相关的内容打包成zip文件，用于发布到服务器。

### 使用打包脚本

```bash
# 运行打包脚本
python pack_site.py

# 脚本会生成一个带有时间戳的zip文件，例如：
# portfolio_site_20260222_172218.zip
```

### 打包内容

脚本会自动包含网站运行所需的所有文件：
- HTML文件（主页、404页面、作品页面）
- CSS样式文件
- JavaScript文件（主脚本和粒子效果）
- JSON数据文件（作品和分类数据）
- 图片文件（所有作品图片）
- 音频文件（作品说明音频）

### 排除内容

脚本会排除开发相关的文件：
- 开发脚本和工具（generate_audio.py, generate-work.js）
- 临时文件和备份文件
- 测试文档和README文件
- Claude技能配置文件
- 版本控制文件

### 发布到服务器

1. 运行打包脚本生成zip文件
2. 将zip文件上传到服务器
3. 解压zip文件到网站根目录
4. 配置Web服务器（如Nginx、Apache）指向解压后的目录

## 许可证

本项目仅供学习和参考使用。