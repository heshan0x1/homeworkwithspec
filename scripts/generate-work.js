// 作品页面生成脚本
// 任务4.3: 创建生成作品页面的JavaScript脚本

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    worksDir: 'works',
    templateFile: 'template.html',
    dataFile: 'data.json',
    outputFile: 'index.html'
};

// 主函数
async function generateWorkPages() {
    console.log('开始生成作品页面...');

    try {
        // 获取所有作品目录
        const workDirs = await getWorkDirectories();
        console.log(`找到 ${workDirs.length} 个作品目录`);

        // 为每个作品生成页面
        for (const workDir of workDirs) {
            await generateWorkPage(workDir);
        }

        console.log('所有作品页面生成完成！');
    } catch (error) {
        console.error('生成作品页面时出错:', error);
        process.exit(1);
    }
}

// 获取作品目录列表
async function getWorkDirectories() {
    try {
        const worksPath = path.join(__dirname, '..', CONFIG.worksDir);
        const items = await fs.promises.readdir(worksPath, { withFileTypes: true });

        return items
            .filter(item => item.isDirectory())
            .map(item => path.join(worksPath, item.name));
    } catch (error) {
        console.error('读取作品目录失败:', error);
        return [];
    }
}

// 为单个作品生成页面
async function generateWorkPage(workDir) {
    const workName = path.basename(workDir);
    console.log(`处理作品: ${workName}`);

    try {
        // 读取数据文件
        const dataPath = path.join(workDir, CONFIG.dataFile);
        const data = await readDataFile(dataPath);

        // 读取模板文件
        const templatePath = path.join(workDir, CONFIG.templateFile);
        const template = await readTemplateFile(templatePath);

        // 准备模板数据
        const templateData = prepareTemplateData(data, workDir);

        // 生成HTML
        const html = renderTemplate(template, templateData);

        // 写入输出文件
        const outputPath = path.join(workDir, CONFIG.outputFile);
        await writeOutputFile(outputPath, html);

        console.log(`✓ 已生成: ${workName}/index.html`);
    } catch (error) {
        console.error(`生成作品 ${workName} 页面失败:`, error.message);
    }
}

// 读取数据文件
async function readDataFile(dataPath) {
    try {
        const content = await fs.promises.readFile(dataPath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error(`数据文件不存在: ${dataPath}`);
        }
        throw new Error(`读取数据文件失败: ${error.message}`);
    }
}

// 读取模板文件
async function readTemplateFile(templatePath) {
    try {
        return await fs.promises.readFile(templatePath, 'utf8');
    } catch (error) {
        // 如果作品目录中没有模板，使用默认模板
        console.log(`作品目录中没有模板，使用默认模板`);
        return getDefaultTemplate();
    }
}

// 获取默认模板
function getDefaultTemplate() {
    // 这里可以返回一个简单的默认模板
    // 在实际项目中，可以从共享位置读取模板
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - 作品集</title>
    <link rel="stylesheet" href="{{basePath}}styles/main.css">
</head>
<body>
    <main class="container">
        <h1>{{title}}</h1>
        <p>{{description}}</p>
        <p><a href="{{basePath}}index.html">返回首页</a></p>
    </main>
</body>
</html>
`;
}

// 准备模板数据
function prepareTemplateData(data, workDir) {
    const basePath = calculateBasePath(workDir);

    return {
        ...data,
        basePath: basePath,
        hasAudio: !!(data.audio && data.audio.src),
        mainImage: data.images && data.images.length > 0 ? data.images[0] : null
    };
}

// 计算基础路径
function calculateBasePath(workDir) {
    const relativePath = path.relative(workDir, path.join(__dirname, '..'));
    return relativePath ? relativePath + '/' : './';
}

// 渲染模板
function renderTemplate(template, data) {
    return template.replace(/\{\{(\w+)(?:\.(\w+))?\}\}/g, (match, key, subKey) => {
        if (subKey) {
            // 处理嵌套属性，如 audio.src
            return data[key] && data[key][subKey] ? data[key][subKey] : '';
        } else {
            // 处理简单属性
            return data[key] !== undefined ? data[key] : '';
        }
    })
    // 处理条件语句
    .replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
        return data[condition] ? content : '';
    })
    // 处理循环语句
    .replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, content) => {
        if (!data[arrayName] || !Array.isArray(data[arrayName])) {
            return '';
        }

        return data[arrayName].map((item, index) => {
            return content
                .replace(/\{\{this\}\}/g, item)
                .replace(/\{\{@index\}\}/g, index)
                .replace(/\{\{@first\}\}/g, index === 0)
                .replace(/\{\{@last\}\}/g, index === data[arrayName].length - 1);
        }).join('');
    });
}

// 写入输出文件
async function writeOutputFile(outputPath, content) {
    try {
        await fs.promises.writeFile(outputPath, content, 'utf8');
    } catch (error) {
        throw new Error(`写入输出文件失败: ${error.message}`);
    }
}

// 命令行接口
if (require.main === module) {
    // 处理命令行参数
    const args = process.argv.slice(2);

    if (args.length > 0) {
        // 生成特定作品页面
        const workName = args[0];
        const workDir = path.join(__dirname, '..', CONFIG.worksDir, workName);

        generateWorkPage(workDir)
            .then(() => {
                console.log(`作品 ${workName} 页面生成完成`);
                process.exit(0);
            })
            .catch(error => {
                console.error(error);
                process.exit(1);
            });
    } else {
        // 生成所有作品页面
        generateWorkPages()
            .then(() => process.exit(0))
            .catch(error => {
                console.error(error);
                process.exit(1);
            });
    }
}

// 导出函数供其他模块使用
module.exports = {
    generateWorkPages,
    generateWorkPage
};