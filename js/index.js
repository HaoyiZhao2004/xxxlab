// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏功能
    initNavigation();
    
    // 横幅轮播功能
    initHeroSlider();
    
    // 实验室介绍功能
    initLabIntro();
    
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
    // 从JSON文件加载轮播图数据
    fetch('json/index.json')
        .then(response => response.json())
        .then(data => {
            const slides = data.carousel.map(item => ({
                image: item.image,
                title: `Slide ${item.id}`
            }));
            initSlider(slides);
        })
        .catch(error => {
            console.error('加载轮播图数据失败:', error);
            // 使用默认数据作为备用
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
            initSlider(slides);
        });
}

function initSlider(slides) {

    let currentSlide = 0;
    const heroSlider = document.querySelector('.hero-slider');
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
        
        // 动态生成分页点
        const paginationContainer = document.querySelector('.hero-pagination');
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = `pagination-dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(index));
                paginationContainer.appendChild(dot);
            });
        }
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

    // 分页点点击事件已在createSlides中绑定

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

// 实验室介绍功能
function initLabIntro() {
    // 从JSON文件加载实验室介绍数据
    fetch('json/index.json')
        .then(response => response.json())
        .then(data => {
            if (data.labInfo) {
                loadLabIntroContent(data.labInfo);
            }
        })
        .catch(error => {
            console.error('加载实验室介绍数据失败:', error);
            // 使用默认内容作为备用
            const defaultLabInfo = [
                { id: 1, text: "欢迎访问 XXX实验室 的网站。" },
                { id: 2, text: "本实验室由 XXX教授/负责人 领导，隶属于 XXX学院/研究所/公司，致力于探索和解决前沿科学与工程问题。" },
                { id: 3, text: "我们实验室主要专注于以下研究领域：" },
                { id: 4, text: "XXX；" },
                { id: 5, text: "XXX；" },
                { id: 6, text: "XXX。" }
            ];
            loadLabIntroContent(defaultLabInfo);
        });
}

function loadLabIntroContent(labInfo) {
    const contentContainer = document.getElementById('labIntroContent');
    if (!contentContainer) return;
    
    contentContainer.innerHTML = '';
    
    labInfo.forEach(item => {
        const p = document.createElement('p');
        p.innerHTML = item.text; // 使用innerHTML来支持HTML标签和空格
        contentContainer.appendChild(p);
    });
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