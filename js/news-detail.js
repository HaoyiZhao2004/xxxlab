// 新闻详情页面专用JavaScript

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏
    initNavigation();
    
    // 加载新闻详情
    loadNewsDetail();
    
    // 初始化滚动效果
    initScrollEffects();
});

// 初始化导航栏
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击导航链接时关闭移动端菜单
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        }
    });
}

// 加载新闻详情
function loadNewsDetail() {
    // 从URL参数获取新闻ID
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
    
    if (!newsId) {
        showError('未找到新闻ID');
        return;
    }
    
    // 首先从JSON文件获取新闻列表信息
    fetch('json/news.json')
        .then(response => response.json())
        .then(data => {
            const newsItem = data.newsList.find(news => news.id == newsId);
            if (newsItem) {
                // 然后加载对应的Markdown文件
                loadMarkdownContent(newsId, newsItem, data.newsList);
            } else {
                showError('未找到指定的新闻');
            }
        })
        .catch(error => {
            console.error('加载新闻数据失败:', error);
            showError('加载新闻数据失败');
        });
}

// 加载Markdown内容
function loadMarkdownContent(newsId, newsItem, newsList) {
    fetch(`Markdown/news/${newsId}.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Markdown文件不存在');
            }
            return response.text();
        })
        .then(markdownText => {
            displayMarkdownContent(markdownText, newsItem, newsList);
        })
        .catch(error => {
            console.error('加载Markdown文件失败:', error);
            showError('加载新闻内容失败');
        });
}

// 显示Markdown内容
function displayMarkdownContent(markdownText, newsItem, newsList) {
    // 更新页面标题
    document.title = `${newsItem.title} - XXX实验室`;
    
    // 更新面包屑导航
    const newsTitleElement = document.getElementById('newsTitle');
    if (newsTitleElement) {
        newsTitleElement.textContent = newsItem.title;
    }
    
    // 解析Markdown内容
    const parsedContent = parseMarkdownContent(markdownText);
    
    // 更新新闻标题
    const articleTitleElement = document.getElementById('articleTitle');
    if (articleTitleElement) {
        articleTitleElement.textContent = parsedContent.title || newsItem.title;
    }
    

    
    // 渲染Markdown内容
    const articleContentElement = document.getElementById('articleContent');
    if (articleContentElement) {
        articleContentElement.innerHTML = parsedContent.html;
    }
    

}

// 解析Markdown内容
function parseMarkdownContent(markdownText) {
    // 配置marked选项
    marked.setOptions({
        breaks: true,
        gfm: true
    });
    
    // 提取元数据（标题、日期、作者）
    const lines = markdownText.split('\n');
    let title = '';
    let date = '';
    let author = '';
    let contentStartIndex = 0;
    
    // 查找标题（第一个#开头的行）
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('# ')) {
            title = line.substring(2);
            contentStartIndex = i + 1;
            break;
        }
    }
    
    // 查找日期和作者信息
    for (let i = contentStartIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('**发布日期：**')) {
            date = line.replace('**发布日期：**', '').trim();
        } else if (line.includes('**作者：**')) {
            author = line.replace('**作者：**', '').trim();
        } else if (line === '') {
            contentStartIndex = i + 1;
            break;
        }
    }
    
    // 获取内容部分
    const contentLines = lines.slice(contentStartIndex);
    const contentMarkdown = contentLines.join('\n');
    
    // 转换为HTML
    const html = marked.parse(contentMarkdown);
    
    return {
        title,
        date,
        author,
        html
    };
}





// 显示错误信息
function showError(message) {
    const articleContentElement = document.getElementById('articleContent');
    if (articleContentElement) {
        articleContentElement.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>加载失败</h3>
                <p>${message}</p>
                <a href="news.html" class="nav-link back" style="display: inline-flex; margin-top: 20px;">
                    <i class="fas fa-arrow-left"></i>
                    <span>返回新闻列表</span>
                </a>
            </div>
        `;
    }
}

// 初始化滚动效果
function initScrollEffects() {
    // 平滑滚动
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.news-article, .content-text, .content-image, .content-video');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

 