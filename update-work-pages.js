#!/usr/bin/env node

/**
 * 批量更新作品页面，添加动态数据加载支持
 */

const fs = require('fs');
const path = require('path');

const worksDir = path.join(__dirname, 'works');
const scriptLine = '    <script src="../../scripts/work-loader.js"></script>';

// 要添加 data-field 属性的元素映射
const fieldMappings = [
    { tag: 'h1', attr: 'data-field="title"' },
    // 其他字段通过span包装，这里不直接处理
];

// 遍历作品目录
const workDirs = fs.readdirSync(worksDir).filter(dir => {
    const dirPath = path.join(worksDir, dir);
    return fs.statSync(dirPath).isDirectory();
});

console.log(`找到 ${workDirs.length} 个作品目录`);

workDirs.forEach(workDir => {
    const indexPath = path.join(worksDir, workDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.log(`跳过 ${workDir}，没有 index.html`);
        return;
    }

    console.log(`处理 ${workDir}...`);
    let content = fs.readFileSync(indexPath, 'utf8');

    // 1. 添加 work-loader.js 脚本引用（在 particles.js 之后）
    if (!content.includes('work-loader.js')) {
        content = content.replace(
            /<script src="\.\.\/\.\.\/scripts\/particles\.js"><\/script>/,
            `<script src="../../scripts/particles.js"></script>\n    <script src="../../scripts/work-loader.js"></script>`
        );
    }

    // 2. 为标题添加 data-field 属性
    content = content.replace(/<h1>([^<]+)<\/h1>/, '<h1 data-field="title">$1</h1>');

    // 3. 为分类、日期、媒介、尺寸添加 span 包装
    const labelMappings = [
        { label: '分类', field: 'category' },
        { label: '创作时间', field: 'date' },
        { label: '媒介', field: 'medium' },
        { label: '尺寸', field: 'size' },
        { label: 'ID', field: 'id' },
        { label: '创作日期', field: 'createdAt' },
        { label: '使用材料', field: 'materials' }
    ];

    labelMappings.forEach(({ label, field }) => {
        const regex = new RegExp(`<p><strong>${label}：</strong>([^<]+)</p>`);
        content = content.replace(regex, `<p><strong>${label}：</strong><span data-field="${field}">$1</span></p>`);
    });

    // 4. 为描述段落添加 data-field
    content = content.replace(/<div class="work-description">\s*<h3>作品描述<\/h3>\s*<p>([^<]+)<\/p>/,
        `<div class="work-description">
                    <h3>作品描述</h3>
                    <p data-field="description">$1</p>`);

    // 5. 为主图片添加 data-field
    content = content.replace(/<img[^>]+id="main-work-image"[^>]*>/,
        match => {
            if (match.includes('data-field="mainImage"')) return match;
            return match.replace('id="main-work-image"', 'id="main-work-image" data-field="mainImage"');
        });

    // 6. 更新页脚中的最后更新信息
    const footerRegex = /<p>作品ID：([^|]+) \| 最后更新：([^<]+)<\/p>/;
    content = content.replace(footerRegex,
        '<p>作品ID：<span data-field="id">$1</span> | 最后更新：<span data-field="updatedAt">$2</span></p>');

    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`✓ 更新 ${workDir}/index.html`);
});

console.log('批量更新完成！');