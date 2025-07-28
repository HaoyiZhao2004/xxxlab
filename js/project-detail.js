// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏功能
    initNavigation();
    
    // 滚动效果
    initScrollEffects();
    
    // 加载项目详情
    loadProjectDetail();
});

// 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 汉堡菜单切换
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 点击导航链接时关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 导航栏滚动效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // 向下滚动时隐藏导航栏
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // 向上滚动时显示导航栏
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// 滚动效果
function initScrollEffects() {
    // 添加滚动动画效果
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
    const animateElements = document.querySelectorAll('.project-content > *');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 添加滚动进度条
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #333, #666);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    createScrollProgress();
}

// 加载项目详情
function loadProjectDetail() {
    // 从URL获取项目ID
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (!projectId) {
        showError('项目ID不存在');
        return;
    }

    // 首先加载项目列表数据
    fetch('json/projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载项目数据');
            }
            return response.json();
        })
        .then(data => {
            const projectItem = data.projectsList.find(project => project.id == projectId);
            if (!projectItem) {
                throw new Error('项目不存在');
            }
            loadMarkdownContent(projectId, projectItem, data.projectsList);
        })
        .catch(error => {
            console.error('加载项目数据失败:', error);
            showError('加载项目数据失败');
        });
}

// 加载Markdown内容
function loadMarkdownContent(projectId, projectItem, projectsList) {
    fetch(`Markdown/projects/${projectId}.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Markdown文件不存在');
            }
            return response.text();
        })
        .then(markdownText => {
            displayMarkdownContent(markdownText, projectItem, projectsList);
        })
        .catch(error => {
            console.error('加载Markdown文件失败:', error);
            showError('加载项目内容失败');
        });
}

// 显示Markdown内容
function displayMarkdownContent(markdownText, projectItem, projectsList) {
    // 更新页面标题
    document.title = `${projectItem.title} - XXX实验室`;

    // 更新面包屑导航
    const projectTitleElement = document.getElementById('projectTitle');
    if (projectTitleElement) {
        projectTitleElement.textContent = projectItem.title;
    }

    // 解析Markdown内容
    const parsedContent = parseMarkdownContent(markdownText);

    // 更新项目标题
    const articleTitleElement = document.getElementById('articleTitle');
    if (articleTitleElement) {
        articleTitleElement.textContent = parsedContent.title || projectItem.title;
    }

    // 渲染Markdown内容
    const articleContentElement = document.getElementById('articleContent');
    if (articleContentElement) {
        articleContentElement.innerHTML = parsedContent.html;
    }

    // 重新初始化滚动效果
    setTimeout(() => {
        initScrollEffects();
    }, 100);
}

// 解析Markdown内容
function parseMarkdownContent(markdownText) {
    // 配置marked选项
    marked.setOptions({
        breaks: true,
        gfm: true
    });

    // 提取元数据（标题、时间、负责人）
    const lines = markdownText.split('\n');
    let title = '';
    let date = '';
    let leader = '';
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

    // 查找时间和负责人信息
    for (let i = contentStartIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('**项目时间：**')) {
            date = line.replace('**项目时间：**', '').trim();
        } else if (line.includes('**项目负责人：**')) {
            leader = line.replace('**项目负责人：**', '').trim();
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
        leader,
        html
    };
}

// 显示错误信息
function showError(message) {
    const projectContainer = document.getElementById('articleContent');
    if (projectContainer) {
        projectContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
}); 