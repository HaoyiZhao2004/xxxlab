// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏功能
    initNavigation();
    
    // 加载新闻列表
    loadNewsList();
    
    // 滚动效果
    initScrollEffects();
    
    // 动画效果
    initAnimations();
    
    // 新闻分页功能
    initNewsPagination();
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
    const animateElements = document.querySelectorAll('.news-item');
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

// 动画效果
function initAnimations() {
    // 页面加载动画
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
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

// 新闻分页功能
function initNewsPagination() {
    const pageLinks = document.querySelectorAll('.news-pagination .page-link');
    const newsItems = document.querySelectorAll('.news-item');

    // 默认显示第一页
    showPage(1);

    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            pageLinks.forEach(l => l.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            
            // 显示对应页面
            const targetPage = this.getAttribute('data-page');
            showPage(parseInt(targetPage));
        });
    });

    function showPage(pageNumber) {
        newsItems.forEach(item => {
            const itemPage = parseInt(item.getAttribute('data-page'));
            if (itemPage === pageNumber) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// 加载新闻列表
function loadNewsList() {
    fetch('json/news.json')
        .then(response => response.json())
        .then(data => {
            displayNewsList(data.newsList);
        })
        .catch(error => {
            console.error('加载新闻列表失败:', error);
        });
}

// 显示新闻列表
function displayNewsList(newsList) {
    const newsContainer = document.getElementById('newsList');
    if (!newsContainer) return;
    
    newsContainer.innerHTML = '';
    
    newsList.forEach((news, index) => {
        const newsItem = document.createElement('a');
        newsItem.className = 'news-item';
        newsItem.href = `news-detail.html?id=${news.id}`;
        newsItem.setAttribute('data-page', Math.floor(index / 6) + 1);
        
        newsItem.innerHTML = `
            <div class="news-date">
                <span class="year">${news.date}</span>
            </div>
            <div class="news-content">
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.summary}</p>
            </div>
        `;
        
        newsContainer.appendChild(newsItem);
    });
    
    // 生成分页
    generatePagination(newsList.length);
    
    // 重新初始化分页
    initNewsPagination();
}

// 生成分页
function generatePagination(totalItems) {
    const itemsPerPage = 6;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById('newsPagination');
    
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.className = `page-link ${i === 1 ? 'active' : ''}`;
        pageLink.setAttribute('data-page', i);
        pageLink.textContent = i;
        paginationContainer.appendChild(pageLink);
    }
} 