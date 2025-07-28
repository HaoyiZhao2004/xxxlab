// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏功能
    initNavigation();
    
    // 加载团队成员数据
    loadTeamMembers();
    
    // 滚动效果
    initScrollEffects();
    
    // 动画效果
    initAnimations();
});

// 加载团队成员数据
async function loadTeamMembers() {
    try {
        const response = await fetch('json/team-far.json');
        if (!response.ok) {
            throw new Error('无法加载团队成员数据');
        }
        
        const data = await response.json();
        renderTeamMembers(data.members);
    } catch (error) {
        console.error('加载团队成员数据失败:', error);
        showErrorMessage('加载团队成员信息失败，请刷新页面重试');
    }
}

// 渲染团队成员
function renderTeamMembers(members) {
    const container = document.getElementById('team-members-container');
    
    if (!container) {
        console.error('找不到团队成员容器');
        return;
    }
    
    // 清空加载提示
    container.innerHTML = '';
    
    // 动态获取所有职位类型
    const positionTypes = Object.keys(members);
    
    // 如果没有成员数据
    if (positionTypes.length === 0) {
        container.innerHTML = '<div class="no-members"><p>暂无团队成员信息</p></div>';
        return;
    }
    
    // 定义职位优先级（如果存在的话，优先显示）
    const priorityOrder = [
        '教授', '研究员', '博士后', '博士生', '硕士生', '本科生', '访问学者'
    ];
    
    // 对职位进行排序：优先显示预定义的类型，然后按字母顺序显示其他类型
    const sortedPositions = positionTypes.sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a);
        const bIndex = priorityOrder.indexOf(b);
        
        // 如果都在预定义列表中，按预定义顺序排序
        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        }
        // 如果只有a在预定义列表中，a优先
        if (aIndex !== -1 && bIndex === -1) {
            return -1;
        }
        // 如果只有b在预定义列表中，b优先
        if (aIndex === -1 && bIndex !== -1) {
            return 1;
        }
        // 都不在预定义列表中，按字母顺序排序
        return a.localeCompare(b, 'zh-CN');
    });
    
    // 遍历每个职位
    sortedPositions.forEach(position => {
        if (members[position] && members[position].length > 0) {
            const section = createMemberSection(position, members[position]);
            container.appendChild(section);
        }
    });
    
    // 如果没有成员数据
    if (container.children.length === 0) {
        container.innerHTML = '<div class="no-members"><p>暂无团队成员信息</p></div>';
    }
}

// 创建成员区域
function createMemberSection(position, members) {
    const section = document.createElement('div');
    section.className = 'member-section';
    
    const title = document.createElement('h3');
    title.className = 'section-title';
    title.textContent = position;
    section.appendChild(title);
    
    // 定义使用详细资料卡片的职位类型
    const detailedProfilePositions = ['教授', '研究员'];
    
    // 根据职位类型选择不同的渲染方式
    if (detailedProfilePositions.includes(position)) {
        // 详细资料卡片 - 用于高级研究人员
        members.forEach(member => {
            const profile = createDetailedProfile(member);
            section.appendChild(profile);
        });
    } else {
        // 网格卡片 - 用于学生和其他成员
        const grid = document.createElement('div');
        grid.className = 'member-grid';
        
        members.forEach(member => {
            const card = createMemberCard(member, position);
            grid.appendChild(card);
        });
        
        section.appendChild(grid);
    }
    
    return section;
}

// 创建详细资料卡片（用于教授和研究员）
function createDetailedProfile(member) {
    const profile = document.createElement('div');
    profile.className = 'member-profile';
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'member-image';
    
    const image = document.createElement('img');
    image.src = member.image || 'images/moren.png';
    image.alt = member.name || '成员头像';
    image.onerror = function() {
        this.src = 'images/moren.png';
    };
    imageContainer.appendChild(image);
    
    const details = document.createElement('div');
    details.className = 'member-details';
    
    const name = document.createElement('h2');
    name.className = 'member-name';
    name.textContent = member.name || '未知姓名';
    details.appendChild(name);
    
    // 添加链接
    if (member.links && member.links.length > 0) {
        const linksContainer = document.createElement('div');
        linksContainer.className = 'member-links';
        
        member.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.className = 'member-link';
            linkElement.textContent = link.text || '';
            linkElement.href = link.href || '#';
            if (link.href && link.href !== '#') {
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
            }
            linksContainer.appendChild(linkElement);
        });
        
        details.appendChild(linksContainer);
    }
    
    // 添加简介
    if (member.affiliation) {
        const affiliation = document.createElement('div');
        affiliation.className = 'member-affiliation';
        affiliation.textContent = member.affiliation;
        details.appendChild(affiliation);
    }
    
    profile.appendChild(imageContainer);
    profile.appendChild(details);
    
    return profile;
}

// 创建成员卡片（用于博士后、博士生、硕士生）
function createMemberCard(member, position) {
    const cardLink = document.createElement('a');
    cardLink.className = 'member-card-link';
    cardLink.href = member.href || '#';
    
    // 如果有有效链接，设置目标窗口
    if (member.href && member.href !== '#') {
        cardLink.target = '_blank';
        cardLink.rel = 'noopener noreferrer';
    }
    
    const card = document.createElement('div');
    card.className = 'member-card';
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'member-card-image';
    
    const image = document.createElement('img');
    image.src = member.image || 'images/moren.png';
    image.alt = member.name || '成员头像';
    image.onerror = function() {
        this.src = 'images/moren.png';
    };
    imageContainer.appendChild(image);
    
    const name = document.createElement('h4');
    name.className = 'member-card-name';
    name.textContent = member.name || '未知姓名';
    
    card.appendChild(imageContainer);
    card.appendChild(name);
    
    cardLink.appendChild(card);
    return cardLink;
}

// 显示错误信息
function showErrorMessage(message) {
    const container = document.getElementById('team-members-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-button">重试</button>
            </div>
        `;
    }
}

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
    const animateElements = document.querySelectorAll('.member-section, .member-profile, .member-card');
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