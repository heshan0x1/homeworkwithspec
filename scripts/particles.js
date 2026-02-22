// 粉色主题粒子系统
class ParticlesSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.particleCount = 50; // 粒子数量
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.init();
    }

    init() {
        // 创建画布
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();

        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resizeCanvas());

        // 监听鼠标移动
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // 创建粒子
        this.createParticles();

        // 开始动画
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles(); // 重新创建粒子以适应新尺寸
    }

    createParticles() {
        this.particles = [];
        const colors = [
            'rgba(255, 118, 140, 0.7)',  // 粉色
            'rgba(255, 126, 179, 0.7)',  // 浅粉色
            'rgba(216, 27, 96, 0.7)',    // 深粉色
            'rgba(255, 64, 129, 0.7)',   // 亮粉色
            'rgba(255, 183, 217, 0.7)'   // 淡粉色
        ];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                originalSize: Math.random() * 4 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和绘制粒子
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // 鼠标互动
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 鼠标靠近时粒子避让
            if (distance < 100) {
                p.x -= dx * 0.02;
                p.y -= dy * 0.02;
            }

            // 正常移动
            p.x += p.speedX;
            p.y += p.speedY;

            // 边界检查
            if (p.x > this.canvas.width) p.x = 0;
            if (p.x < 0) p.x = this.canvas.width;
            if (p.y > this.canvas.height) p.y = 0;
            if (p.y < 0) p.y = this.canvas.height;

            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            // 绘制粒子间的连线
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 118, 140, ${0.2 * (1 - distance/100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }

        // 绘制鼠标周围的辉光
        if (this.mouse.x !== 0 || this.mouse.y !== 0) {
            const gradient = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, 150
            );
            gradient.addColorStop(0, 'rgba(255, 118, 140, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 118, 140, 0)');

            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, 150, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// 初始化粒子系统
let particlesSystem = null;

function initParticles() {
    // 防止重复初始化
    if (document.getElementById('particles-canvas')) {
        return;
    }

    if (particlesSystem) {
        particlesSystem.destroy();
    }
    particlesSystem = new ParticlesSystem();
}

// 当页面加载完成时初始化粒子系统
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    initParticles();
}

// 导出供其他脚本使用
window.initParticles = initParticles;