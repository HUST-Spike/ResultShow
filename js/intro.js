// 添加页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    // 页面加载完成后添加已加载类
    document.body.classList.add('loaded');
    
    // 卡片动画
    const cards = document.querySelectorAll('.card');
    
    // 为每个卡片添加入场动画
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, 200 * index);
    });
    
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // 获取"开始体验"按钮
    const getStartedBtn = document.querySelector('.get-started-btn');
    
    // 添加点击动画
    getStartedBtn.addEventListener('click', function(e) {
        // 不立即导航，先添加动画
        e.preventDefault();
        
        // 添加点击效果类
        this.classList.add('clicked');
        
        // 设置延迟后再导航到主页面
        setTimeout(() => {
            window.location.href = this.getAttribute('href');
        }, 500);
    });
});

// 添加视差滚动效果
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // 对卡片应用视差效果
    document.querySelectorAll('.card-image').forEach(image => {
        image.style.transform = `translateY(${scrollPosition * 0.05}px)`;
    });
});
