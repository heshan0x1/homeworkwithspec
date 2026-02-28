#!/usr/bin/env node

/**
 * 生成作品索引文件 artworks.json
 * 从每个作品的 data.json 提取基本信息，避免数据重复
 */

const fs = require('fs');
const path = require('path');

const worksDir = path.join(__dirname, '..', 'works');
const outputFile = path.join(__dirname, '..', 'data', 'artworks.json');

// 确保 data 目录存在
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 获取所有作品目录
const workDirs = fs.readdirSync(worksDir).filter(dir => {
    const dirPath = path.join(worksDir, dir);
    return fs.statSync(dirPath).isDirectory();
});

console.log(`找到 ${workDirs.length} 个作品目录`);

const artworks = [];

workDirs.forEach(workDir => {
    const dataPath = path.join(worksDir, workDir, 'data.json');
    if (!fs.existsSync(dataPath)) {
        console.warn(`跳过 ${workDir}，没有 data.json`);
        return;
    }

    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        // 提取基本信息（只包含索引所需字段）
        const artwork = {
            id: data.id,
            title: data.title,
            category: data.category,
            date: data.date,
            // 图片路径
            image: `works/${workDir}/images/main.jpg`,
            thumbnail: `works/${workDir}/images/thumbnail.jpg`,
            url: `works/${workDir}/index.html`,
            // 是否有音频
            hasAudio: !!(data.audio && data.audio.src)
        };

        artworks.push(artwork);
        console.log(`✓ 添加作品: ${data.title} (${workDir})`);
    } catch (error) {
        console.error(`处理 ${workDir} 时出错:`, error.message);
    }
});

// 按创建日期排序（如果存在 createdAt 字段）
try {
    // 尝试读取每个作品的 createdAt 进行排序
    const artworksWithDate = artworks.map(art => {
        const dataPath = path.join(worksDir, art.id, 'data.json');
        if (fs.existsSync(dataPath)) {
            const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            return { ...art, createdAt: data.createdAt || '1970-01-01' };
        }
        return { ...art, createdAt: '1970-01-01' };
    });

    artworksWithDate.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // 移除临时字段
    const sortedArtworks = artworksWithDate.map(({ createdAt, ...rest }) => rest);

    // 写入文件
    fs.writeFileSync(outputFile, JSON.stringify(sortedArtworks, null, 2), 'utf8');
    console.log(`\n✅ 已生成 ${sortedArtworks.length} 个作品的索引到 ${outputFile}`);
} catch (error) {
    console.error('排序或写入文件时出错:', error);
    // 直接写入未排序的数据
    fs.writeFileSync(outputFile, JSON.stringify(artworks, null, 2), 'utf8');
    console.log(`\n✅ 已生成 ${artworks.length} 个作品的索引到 ${outputFile}`);
}