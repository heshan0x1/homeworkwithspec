// 作品数据动态加载脚本
// 从当前作品目录的 data.json 加载数据并填充页面内容

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        dataFile: 'data.json',  // 数据文件路径（相对于当前页面）
        selectors: {
            title: 'title, h1',
            category: '[data-field="category"]',
            date: '[data-field="date"]',
            medium: '[data-field="medium"]',
            size: '[data-field="size"]',
            description: '[data-field="description"]',
            materials: '[data-field="materials"]',
            id: '[data-field="id"]',
            createdAt: '[data-field="createdAt"]',
            updatedAt: '[data-field="updatedAt"]',
            mainImage: '#main-work-image',
            // 备用选择器：用于查找传统硬编码元素
            fallback: {
                title: 'h1',
                category: 'p:has(strong:contains("分类"))',
                date: 'p:has(strong:contains("创作时间"))',
                medium: 'p:has(strong:contains("媒介"))',
                size: 'p:has(strong:contains("尺寸"))',
                description: '.work-description p',
                materials: 'p:has(strong:contains("使用材料"))',
                id: 'p:has(strong:contains("ID"))',
                createdAt: 'p:has(strong:contains("创作日期"))',
                updatedAt: 'footer p:contains("最后更新")'
            }
        }
    };

    // 工具函数：等待DOM加载完成
    function domReady() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    // 工具函数：获取元素文本内容或设置文本
    function getText(element) {
        return element ? element.textContent.trim() : '';
    }

    function setText(element, text) {
        if (element) {
            element.textContent = text;
        }
    }

    // 工具函数：设置图片属性
    function setImage(imgElement, src, alt) {
        if (imgElement && src) {
            imgElement.src = src;
            if (alt) {
                imgElement.alt = alt;
            }
        }
    }

    // 工具函数：更新元素内容
    function updateElement(selector, value, isAttribute = false, attrName = 'textContent', updateAll = false) {
        const elements = updateAll ? document.querySelectorAll(selector) : [document.querySelector(selector)];
        if (!elements || (updateAll && elements.length === 0) || (!updateAll && !elements[0])) {
            return false;
        }

        let success = false;
        elements.forEach(element => {
            if (element) {
                if (isAttribute) {
                    element[attrName] = value;
                } else {
                    setText(element, value);
                }
                success = true;
            }
        });
        return success;
    }

    // 工具函数：更新带标签的元素（如 <strong>分类：</strong>文本）
    function updateLabeledElement(labelText, newValue) {
        // 查找包含指定标签文本的元素
        const elements = document.querySelectorAll('p, span, div');
        for (const element of elements) {
            if (element.innerHTML.includes(`<strong>${labelText}</strong>`)) {
                // 替换标签后面的文本
                const html = element.innerHTML;
                const newHtml = html.replace(
                    new RegExp(`(<strong>${labelText}</strong>)[^<]*`),
                    `$1${newValue}`
                );
                if (newHtml !== html) {
                    element.innerHTML = newHtml;
                    return true;
                }
            }
        }
        return false;
    }

    // 加载作品数据
    async function loadWorkData() {
        try {
            const response = await fetch(CONFIG.dataFile);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('加载作品数据失败:', error);
            throw error;
        }
    }

    // 使用数据字段属性更新页面
    function updatePageWithDataFields(data) {
        const updates = [];

        // 更新标题（页面标题和h1）
        if (data.title) {
            const titleUpdated = updateElement('title', `${data.title} - 作品集`, false, 'textContent', true);
            const h1Updated = updateElement('h1', data.title, false, 'textContent', true);
            updates.push({ field: 'title', success: titleUpdated || h1Updated });
        }

        // 更新其他字段
        const fieldMappings = [
            { field: 'category', selector: CONFIG.selectors.category },
            { field: 'date', selector: CONFIG.selectors.date },
            { field: 'medium', selector: CONFIG.selectors.medium },
            { field: 'size', selector: CONFIG.selectors.size },
            { field: 'description', selector: CONFIG.selectors.description },
            { field: 'id', selector: CONFIG.selectors.id },
            { field: 'createdAt', selector: CONFIG.selectors.createdAt },
            { field: 'updatedAt', selector: CONFIG.selectors.updatedAt }
        ];

        for (const mapping of fieldMappings) {
            if (data[mapping.field]) {
                const success = updateElement(mapping.selector, data[mapping.field], false, 'textContent', true);
                updates.push({ field: mapping.field, success });
            }
        }

        // 更新材料列表
        if (data.materials && Array.isArray(data.materials)) {
            const materialsText = data.materials.join('、');
            const success = updateElement(CONFIG.selectors.materials, materialsText, false, 'textContent', true);
            updates.push({ field: 'materials', success });
        }

        // 更新主图片
        if (data.images && data.images.length > 0) {
            const mainImage = data.images[0];
            const imgElement = document.querySelector(CONFIG.selectors.mainImage);
            setImage(imgElement, mainImage.src, mainImage.alt);
            updates.push({ field: 'mainImage', success: !!imgElement });
        }

        return updates;
    }

    // 回退更新：使用传统硬编码元素选择器
    function fallbackUpdate(data) {
        const updates = [];

        // 更新标题
        if (data.title) {
            const titleElement = document.querySelector('title');
            if (titleElement) {
                titleElement.textContent = `${data.title} - 作品集`;
            }
            const h1Element = document.querySelector('h1');
            if (h1Element && !h1Element.hasAttribute('data-field')) {
                setText(h1Element, data.title);
            }
        }

        // 使用标签文本更新元素
        const labeledMappings = [
            { label: '分类', field: 'category' },
            { label: '创作时间', field: 'date' },
            { label: '媒介', field: 'medium' },
            { label: '尺寸', field: 'size' },
            { label: '使用材料', field: 'materials', transform: (val) => Array.isArray(val) ? val.join('、') : val },
            { label: 'ID', field: 'id' },
            { label: '创作日期', field: 'createdAt' }
        ];

        for (const mapping of labeledMappings) {
            if (data[mapping.field]) {
                let value = data[mapping.field];
                if (mapping.transform) {
                    value = mapping.transform(value);
                }
                const success = updateLabeledElement(mapping.label, value);
                updates.push({ field: mapping.field, success });
            }
        }

        // 更新描述
        if (data.description) {
            const descElement = document.querySelector('.work-description p');
            if (descElement && !descElement.hasAttribute('data-field')) {
                setText(descElement, data.description);
                updates.push({ field: 'description', success: true });
            }
        }

        // 更新最后更新信息
        if (data.updatedAt) {
            const footerParagraphs = document.querySelectorAll('footer p');
            for (const p of footerParagraphs) {
                if (p.textContent.includes('最后更新')) {
                    const newText = p.textContent.replace(/最后更新：[\d-]+/, `最后更新：${data.updatedAt}`);
                    setText(p, newText);
                    updates.push({ field: 'updatedAt', success: true });
                    break;
                }
            }
        }

        // 更新主图片
        if (data.images && data.images.length > 0) {
            const mainImage = data.images[0];
            const imgElement = document.querySelector('#main-work-image');
            if (imgElement) {
                setImage(imgElement, mainImage.src, mainImage.alt);
                updates.push({ field: 'mainImage', success: true });
            }
        }

        return updates;
    }

    // 主初始化函数
    async function init() {
        console.log('作品数据加载器初始化...');

        try {
            // 等待DOM加载完成
            await domReady();

            // 加载作品数据
            const data = await loadWorkData();
            console.log('作品数据加载成功:', data);

            // 首先尝试使用 data-field 属性更新
            let updates = updatePageWithDataFields(data);
            console.log('data-field 属性更新结果:', updates);

            // 如果某些字段未更新，尝试回退方法
            const failedFields = updates.filter(u => !u.success).map(u => u.field);
            if (failedFields.length > 0) {
                console.log('部分字段未通过data-field更新，尝试回退方法:', failedFields);
                const fallbackUpdates = fallbackUpdate(data);
                console.log('回退更新结果:', fallbackUpdates);
            }

            // 显示页面内容（如果之前隐藏了）
            document.body.style.visibility = 'visible';
            console.log('页面内容更新完成');

        } catch (error) {
            console.error('作品数据加载器初始化失败:', error);
            // 确保页面仍然可见
            document.body.style.visibility = 'visible';
        }
    }

    // 启动初始化
    init();

})();