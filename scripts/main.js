// 主JavaScript文件 - 作品集网站功能
// 任务1.4: 创建JavaScript目录和main.js文件

// 全局配置
const CONFIG = {
    worksDirectory: 'works',
    defaultCategory: '所有作品'
};

// 全局变量
let loadedArtworks = [];

// 占位图片（1x1像素透明GIF的base64编码）
const PLACEHOLDER_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// 初始化函数
async function init() {
    console.log('作品集网站初始化...');

    // 先加载作品数据
    await loadArtworks();

    // 然后加载分类（现在作品数据已加载）
    await loadCategories();

    // 设置事件监听器
    setupEventListeners();

    // 初始化可访问性功能
    initAccessibility();
}

// 加载作品数据
async function loadArtworks() {
    try {
        // 检查是否为文件协议，如果是，直接使用后备数据
        if (window.location.protocol === 'file:') {
            console.log('检测到文件协议(file://)，直接使用后备数据以避免CORS限制');
            console.log('建议使用HTTP服务器运行以获得完整功能');
            await loadFallbackArtworks();
            return;
        }

        // 尝试多个可能的路径
        const possiblePaths = [
            'data/artworks.json',
            './data/artworks.json',
            '/data/artworks.json'
        ];

        let artworks = null;
        let lastError = null;

        // 按顺序尝试不同路径
        for (const path of possiblePaths) {
            try {
                console.log(`尝试加载作品数据从: ${path}`);
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}, path: ${path}`);
                }
                artworks = await response.json();
                console.log(`成功从 ${path} 加载 ${artworks.length} 个作品`);
                break; // 成功则退出循环
            } catch (err) {
                lastError = err;
                console.warn(`从 ${path} 加载失败:`, err.message);
                // 继续尝试下一个路径
            }
        }

        if (artworks) {
            displayArtworks(artworks);
        } else {
            // 所有路径都失败，使用后备数据
            console.warn('所有路径加载失败，使用后备数据');
            await loadFallbackArtworks();
        }
    } catch (error) {
        console.error('加载作品数据失败:', error);
        displayError(`无法加载作品数据。请检查 data/artworks.json 文件是否存在且格式正确。错误详情: ${error.message}`);
    }
}

// 加载后备作品数据
async function loadFallbackArtworks() {
    try {
        // 尝试从本地存储加载
        const savedArtworks = localStorage.getItem('portfolio_artworks');
        if (savedArtworks) {
            const artworks = JSON.parse(savedArtworks);
            displayArtworks(artworks);
            console.log('从本地存储加载作品数据');
            return;
        }
    } catch (err) {
        console.warn('从本地存储加载失败:', err);
    }

    // 使用实际的示例作品数据（来自 data/artworks.json）
    const fallbackArtworks = [
        {
            "id": "sunset-painting",
            "title": "日落山水",
            "category": "绘画",
            "date": "2024年3月",
            "description": "一幅描绘日落时分山水景色的水彩画作品",
            "image": "works/sunset-painting/images/main.jpg",
            "thumbnail": "works/sunset-painting/images/thumbnail.jpg",
            "url": "works/sunset-painting/index.html",
            "medium": "水彩画",
            "size": "30cm × 40cm",
            "hasAudio": true,
            "audioFile": "works/sunset-painting/audio/description.mp3"
        },
        {
            "id": "flower-drawing",
            "title": "春日花朵",
            "category": "素描",
            "date": "2024年2月",
            "description": "铅笔素描作品，描绘春天盛开的花朵",
            "image": "works/flower-drawing/images/main.jpg",
            "thumbnail": "works/flower-drawing/images/thumbnail.jpg",
            "url": "works/flower-drawing/index.html",
            "medium": "铅笔素描",
            "size": "21cm × 29.7cm",
            "hasAudio": false
        },
        {
            "id": "family-portrait",
            "title": "家庭肖像",
            "category": "绘画",
            "date": "2024年1月",
            "description": "丙烯画作品，温馨的家庭肖像",
            "image": "works/family-portrait/images/main.jpg",
            "thumbnail": "works/family-portrait/images/thumbnail.jpg",
            "url": "works/family-portrait/index.html",
            "medium": "丙烯画",
            "size": "40cm × 50cm",
            "hasAudio": true,
            "audioFile": "works/family-portrait/audio/description.mp3"
        },
        {
            "id": "clay-sculpture",
            "title": "黏土小动物",
            "category": "雕塑",
            "date": "2023年12月",
            "description": "手工制作的黏土小动物雕塑",
            "image": "works/clay-sculpture/images/main.jpg",
            "thumbnail": "works/clay-sculpture/images/thumbnail.jpg",
            "url": "works/clay-sculpture/index.html",
            "medium": "黏土雕塑",
            "size": "约15cm高",
            "hasAudio": false
        },
        {
            "id": "winter-scene",
            "title": "冬日雪景",
            "category": "绘画",
            "date": "2023年11月",
            "description": "描绘冬日雪景的油画作品",
            "image": "works/winter-scene/images/main.jpg",
            "thumbnail": "works/winter-scene/images/thumbnail.jpg",
            "url": "works/winter-scene/index.html",
            "medium": "油画",
            "size": "35cm × 45cm",
            "hasAudio": true,
            "audioFile": "works/winter-scene/audio/description.mp3"
        },
        {
            "id": "butterfly-sketch",
            "title": "蝴蝶速写",
            "category": "素描",
            "date": "2023年10月",
            "description": "彩色铅笔绘制的蝴蝶速写",
            "image": "works/butterfly-sketch/images/main.jpg",
            "thumbnail": "works/butterfly-sketch/images/thumbnail.jpg",
            "url": "works/butterfly-sketch/index.html",
            "medium": "彩色铅笔",
            "size": "15cm × 20cm",
            "hasAudio": false
        }
    ];

    displayArtworks(fallbackArtworks);
    console.log('使用硬编码的示例作品数据（6个作品）');

    // 保存到本地存储以备下次使用
    try {
        localStorage.setItem('portfolio_artworks', JSON.stringify(fallbackArtworks));
    } catch (err) {
        console.warn('无法保存到本地存储:', err);
    }
}

// 显示作品网格
function displayArtworks(artworks) {
    const container = document.querySelector('.artworks-container');
    if (!container) return;

    // 保存作品数据到全局变量
    loadedArtworks = artworks || [];

    if (!artworks || artworks.length === 0) {
        container.innerHTML = '<p class="no-artworks">暂无作品展示。</p>';
        return;
    }

    const artworksHTML = artworks.map(artwork => createArtworkCard(artwork)).join('');
    container.innerHTML = artworksHTML;

    // 更新分类计数
    updateCategoriesFromArtworks();
}

// 创建作品卡片HTML
function createArtworkCard(artwork) {
    const imageUrl = artwork.image || PLACEHOLDER_IMAGE;
    // 将分类名称转换为ID，与分类卡片保持一致
    const categoryId = artwork.category ?
        artwork.category.toLowerCase().replace(/\s+/g, '-') : '未分类';

    return `
        <div class="artwork-card" data-category="${categoryId}">
            <a href="${artwork.url || '#'}" class="artwork-link">
                <div class="artwork-image">
                    <img src="${imageUrl}"
                         alt="${artwork.title || '作品图片'}"
                         loading="lazy"
                         onerror="this.src='${PLACEHOLDER_IMAGE}'; this.onerror=null;">
                </div>
                <div class="artwork-info">
                    <h3>${artwork.title || '未命名作品'}</h3>
                    <p class="artwork-category">${artwork.category || '未分类'}</p>
                    <p class="artwork-date">${artwork.date || '日期未知'}</p>
                </div>
            </a>
        </div>
    `;
}

// 从已加载的作品数据更新分类
function updateCategoriesFromArtworks() {
    if (!loadedArtworks || loadedArtworks.length === 0) {
        console.warn('没有已加载的作品数据，无法更新分类');
        return;
    }

    console.log('从作品数据更新分类，作品总数:', loadedArtworks.length);
    console.log('作品数据:', loadedArtworks.map(a => ({ title: a.title, category: a.category })));

    const categories = [...new Set(loadedArtworks.map(artwork => artwork.category).filter(Boolean))];
    console.log('提取的分类:', categories);

    const categoriesData = [
        { id: 'all', name: '所有作品', count: loadedArtworks.length },
        ...categories.map(category => {
            const count = loadedArtworks.filter(a => a.category === category).length;
            const id = category.toLowerCase().replace(/\s+/g, '-');
            console.log(`分类: ${category}, ID: ${id}, 数量: ${count}`);
            return { id, name: category, count };
        })
    ];

    console.log('分类数据:', categoriesData);
    displayCategories(categoriesData);
}

// 加载分类
async function loadCategories() {
    try {
        // 尝试多个可能的路径
        const possiblePaths = [
            'data/categories.json',
            './data/categories.json',
            '/data/categories.json'
        ];

        let categories = null;
        let lastError = null;

        // 按顺序尝试不同路径
        for (const path of possiblePaths) {
            try {
                console.log(`尝试加载分类数据从: ${path}`);
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}, path: ${path}`);
                }
                categories = await response.json();
                console.log(`成功从 ${path} 加载 ${categories.length} 个分类`);
                break; // 成功则退出循环
            } catch (err) {
                lastError = err;
                console.warn(`从 ${path} 加载失败:`, err.message);
                // 继续尝试下一个路径
            }
        }

        if (categories) {
            displayCategories(categories);
        } else {
            // 所有路径都失败，尝试从作品数据提取分类
            console.warn('所有分类路径加载失败，尝试从作品数据提取分类');
            await extractCategoriesFromArtworks();
        }
    } catch (error) {
        console.error('加载分类数据失败:', error);
        // 尝试从作品数据提取分类
        await extractCategoriesFromArtworks();
    }
}

// 从作品数据中提取分类
async function extractCategoriesFromArtworks() {
    try {
        // 首先检查是否有已加载的作品数据
        if (loadedArtworks && loadedArtworks.length > 0) {
            console.log('使用已加载的作品数据提取分类');
            updateCategoriesFromArtworks();
            return;
        }

        // 尝试多个可能的路径
        const possiblePaths = [
            'data/artworks.json',
            './data/artworks.json',
            '/data/artworks.json'
        ];

        let artworks = null;

        // 按顺序尝试不同路径
        for (const path of possiblePaths) {
            try {
                const response = await fetch(path);
                if (!response.ok) continue;
                artworks = await response.json();
                break; // 成功则退出循环
            } catch (err) {
                // 继续尝试下一个路径
                continue;
            }
        }

        // 如果所有路径都失败，使用全局变量中的作品数据
        if (!artworks && window.portfolioArtworks) {
            artworks = window.portfolioArtworks;
        }

        if (!artworks || artworks.length === 0) {
            console.warn('无法获取作品数据来提取分类，使用默认分类');
            // 使用默认分类（与作品数据中的分类名称保持一致）
            const defaultCategories = [
                { id: 'all', name: '所有作品', count: 0 },
                { id: '绘画', name: '绘画', count: 0 },
                { id: '素描', name: '素描', count: 0 },
                { id: '雕塑', name: '雕塑', count: 0 }
            ];
            displayCategories(defaultCategories);
            return;
        }

        // 更新全局作品数据
        loadedArtworks = artworks;

        const categories = [...new Set(artworks.map(artwork => artwork.category).filter(Boolean))];

        const categoriesData = [
            { id: 'all', name: '所有作品', count: artworks.length },
            ...categories.map(category => ({
                id: category.toLowerCase().replace(/\s+/g, '-'),
                name: category,
                count: artworks.filter(a => a.category === category).length
            }))
        ];

        displayCategories(categoriesData);
    } catch (error) {
        console.error('提取分类失败:', error);
        // 使用默认分类作为后备（与作品数据中的分类名称保持一致）
        const defaultCategories = [
            { id: 'all', name: '所有作品', count: 0 },
            { id: '绘画', name: '绘画', count: 0 },
            { id: '素描', name: '素描', count: 0 },
            { id: '雕塑', name: '雕塑', count: 0 }
        ];
        displayCategories(defaultCategories);
    }
}

// 显示分类
function displayCategories(categories) {
    const container = document.querySelector('.categories-container');
    if (!container) {
        console.warn('找不到分类容器 (.categories-container)');
        return;
    }

    if (!categories || categories.length === 0) {
        console.warn('没有分类数据可显示');
        container.innerHTML = '<p class="no-categories">暂无分类。</p>';
        return;
    }

    console.log('显示分类:', categories);
    const categoriesHTML = categories.map(category => createCategoryCard(category)).join('');
    container.innerHTML = categoriesHTML;
    console.log('分类HTML已更新');
}

// 创建分类卡片HTML
function createCategoryCard(category) {
    return `
        <div class="category-card">
            <a href="#" class="category-link" data-category="${category.id}">
                <h3>${category.name}</h3>
                <p class="category-count">${category.count || 0} 个作品</p>
            </a>
        </div>
    `;
}

// 显示错误信息
function displayError(message) {
    const container = document.querySelector('.artworks-container');
    if (container) {
        // 检查是否为文件协议
        const isFileProtocol = window.location.protocol === 'file:';
        const helpText = isFileProtocol
            ? '<p><strong>提示：</strong>如果您直接从文件系统打开此页面，请使用HTTP服务器运行。可以尝试以下方法：<br>1. 使用VSCode的Live Server扩展<br>2. 在终端中运行: <code>python -m http.server</code><br>3. 使用其他本地HTTP服务器工具</p>'
            : '';

        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                ${helpText}
                <div style="margin-top: 1rem;">
                    <button onclick="location.reload()" class="button">重新加载</button>
                    <button onclick="loadFallbackArtworks()" class="button" style="margin-left: 1rem;">使用示例数据继续</button>
                </div>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                    如果问题持续存在，请检查控制台(按F12)查看详细错误信息。
                </p>
            </div>
        `;
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 分类点击事件
    document.addEventListener('click', function(event) {
        if (event.target.closest('.category-link')) {
            event.preventDefault();
            const category = event.target.closest('.category-link').dataset.category;
            filterArtworksByCategory(category);
        }
    });

    // 图片懒加载
    initLazyLoading();

    // 音频播放器控制
    initAudioPlayers();
}

// 按分类过滤作品
function filterArtworksByCategory(category) {
    const allCards = document.querySelectorAll('.artwork-card');
    const categoryLinks = document.querySelectorAll('.category-link');

    // 更新活跃的分类链接
    categoryLinks.forEach(link => {
        if (link.dataset.category === category) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 显示/隐藏作品卡片
    allCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 初始化图片懒加载
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// 初始化音频播放器
function initAudioPlayers() {
    // 将在作品详情页面实现
}

// 初始化可访问性功能
function initAccessibility() {
    // 键盘导航支持
    document.addEventListener('keydown', function(event) {
        // Tab键导航时显示焦点
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    // 鼠标点击时移除键盘导航样式
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // // 跳转链接
    // const skipLink = document.createElement('a');
    // skipLink.href = '#main-content';
    // skipLink.className = 'skip-link';
    // skipLink.textContent = '跳转到主要内容';
    // document.body.insertBefore(skipLink, document.body.firstChild);
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', init);