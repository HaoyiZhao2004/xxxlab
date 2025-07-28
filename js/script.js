// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏功能
    initNavigation();
    
    // 横幅轮播功能
    initHeroSlider();
    
    // 滚动效果
    initScrollEffects();
    
    // 动画效果
    initAnimations();
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

// 横幅轮播功能
function initHeroSlider() {
    const slides = [
        {
            image: 'images/moren.png',
            title: 'FAST Lab Campus'
        },
        {
            image: 'images/moren.png',
            title: 'Research Facilities'
        },
        {
            image: 'images/moren.png',
            title: 'Laboratory Environment'
        }
    ];

    let currentSlide = 0;
    const heroSlider = document.querySelector('.hero-slider');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    const prevBtn = document.querySelector('.hero-nav-btn.prev');
    const nextBtn = document.querySelector('.hero-nav-btn.next');

    // 创建轮播内容
    function createSlides() {
        if (!heroSlider) return;
        
        heroSlider.innerHTML = '';
        slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `hero-slide ${index === 0 ? 'active' : ''}`;
            slideElement.innerHTML = `
                <img src="${slide.image}" alt="${slide.title}" class="hero-image">
                <div class="hero-overlay"></div>
            `;
            heroSlider.appendChild(slideElement);
        });
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        const slideElements = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.pagination-dot');
        
        // 移除所有活动状态
        slideElements.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 添加当前活动状态
        if (slideElements[index]) {
            slideElements[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }

    // 下一张幻灯片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }

    // 上一张幻灯片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }

    // 绑定事件
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // 分页点点击事件
    paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // 自动轮播
    let autoSlideInterval = setInterval(nextSlide, 5000);

    // 鼠标悬停时暂停自动轮播
    heroSlider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    heroSlider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });

    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // 初始化轮播
    createSlides();
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
    const animateElements = document.querySelectorAll('.project-card, .news-item');
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
    // 移除所有悬停效果，保持简洁风格

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

// 触摸手势支持（移动端）
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向左滑动 - 下一张
            const nextBtn = document.querySelector('.hero-nav-btn.next');
            if (nextBtn) nextBtn.click();
        } else {
            // 向右滑动 - 上一张
            const prevBtn = document.querySelector('.hero-nav-btn.prev');
            if (prevBtn) prevBtn.click();
        }
    }
}

// 搜索功能
function initSearch() {
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            // 这里可以添加搜索功能
            alert('搜索功能待实现');
        });
    }
}

// 初始化搜索
initSearch();

// 论文页面年份筛选功能
function initPublicationYearFilter() {
    const yearLinks = document.querySelectorAll('.year-link');
    const yearSections = document.querySelectorAll('.year-section');
    
    yearLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            yearLinks.forEach(l => l.classList.remove('active'));
            yearSections.forEach(s => s.style.display = 'none');
            
            // 添加当前活动状态
            this.classList.add('active');
            
            // 显示对应年份的论文
            const targetYear = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetYear);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });
}

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

// 页面加载完成后初始化论文年份筛选
document.addEventListener('DOMContentLoaded', function() {
    initPublicationYearFilter();
    initNewsPagination();
}); 