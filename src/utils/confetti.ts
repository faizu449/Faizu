/**
 * Canvas-based particle effect system for confetti, ribbon streamers, sparkles, and floating hearts
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'heart' | 'star' | 'ribbon';
  life: number;
  maxLife: number;
  ribbonWobble?: number;
}

class ParticleSystem {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationId: number | null = null;

  private init() {
    if (this.canvas) return;
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    if (this.ctx) {
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  public burst(options?: {
    x?: number;
    y?: number;
    count?: number;
    shapes?: ('rect' | 'circle' | 'heart' | 'star' | 'ribbon')[];
    colors?: string[];
    velocityFactor?: number;
  }) {
    this.init();
    if (!this.ctx) return;

    const x = options?.x ?? window.innerWidth / 2;
    const y = options?.y ?? window.innerHeight / 2;
    const count = options?.count ?? 55;
    const shapes = options?.shapes ?? ['rect', 'circle', 'heart', 'star', 'ribbon'];
    const colors = options?.colors ?? [
      '#F47BA7',
      '#D83C79',
      '#FFE1EC',
      '#DCCBFF',
      '#F7C96B',
      '#6EE7B7',
      '#93C5FD',
      '#FFFFFF'
    ];
    const velocityFactor = options?.velocityFactor ?? 1;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (2.5 + Math.random() * 9) * velocityFactor;
      const maxLife = 70 + Math.random() * 50;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.8,
        size: 7 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        life: 0,
        maxLife,
        ribbonWobble: Math.random() * 10
      });
    }

    if (!this.animationId) {
      this.loop();
    }
  }

  // Celebratory Dual Corner Cannons (Blasts diagonally up from bottom-left & bottom-right)
  public partyCannon() {
    this.init();
    if (!this.ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    const colors = [
      '#F47BA7',
      '#D83C79',
      '#FFE1EC',
      '#F7C96B',
      '#DCCBFF',
      '#38BDF8',
      '#34D399',
      '#FFFFFF'
    ];

    // Left cannon (fires towards top-right)
    for (let i = 0; i < 45; i++) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.55;
      const speed = 9 + Math.random() * 10;
      this.particles.push({
        x: 10,
        y: h - 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 8 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
        shape: ['rect', 'star', 'ribbon', 'heart'][Math.floor(Math.random() * 4)] as any,
        life: 0,
        maxLife: 90 + Math.random() * 40
      });
    }

    // Right cannon (fires towards top-left)
    for (let i = 0; i < 45; i++) {
      const angle = (-3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.55;
      const speed = 9 + Math.random() * 10;
      this.particles.push({
        x: w - 10,
        y: h - 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 8 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
        shape: ['rect', 'star', 'ribbon', 'heart'][Math.floor(Math.random() * 4)] as any,
        life: 0,
        maxLife: 90 + Math.random() * 40
      });
    }

    if (!this.animationId) {
      this.loop();
    }
  }

  // Floating Hearts Burst
  public heartsBurst(x?: number, y?: number) {
    this.burst({
      x,
      y,
      count: 40,
      shapes: ['heart'],
      colors: ['#F47BA7', '#D83C79', '#FF85A2', '#FFC2D1', '#FFE1EC', '#FFFFFF']
    });
  }

  // Golden Sparkles & Starlight
  public sparklesBurst(x?: number, y?: number) {
    this.burst({
      x,
      y,
      count: 35,
      shapes: ['star', 'circle'],
      colors: ['#F7C96B', '#FFF0B3', '#FFFFFF', '#FFE1EC', '#F47BA7']
    });
  }

  // Confetti Shower from the top
  public showerFromTop() {
    this.init();
    if (!this.ctx) return;
    const w = window.innerWidth;
    const colors = ['#F47BA7', '#D83C79', '#F7C96B', '#DCCBFF', '#93C5FD', '#FFFFFF'];

    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 150,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 4,
        size: 7 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: ['rect', 'ribbon', 'star', 'heart'][Math.floor(Math.random() * 4)] as any,
        life: 0,
        maxLife: 120 + Math.random() * 60
      });
    }

    if (!this.animationId) {
      this.loop();
    }
  }

  private drawHeart(ctx: CanvasRenderingContext2D, size: number) {
    const s = size / 2;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.5, s * 0.3, 0, s * 1.5);
    ctx.bezierCurveTo(s * 1.5, s * 0.3, s, -s * 0.6, 0, s * 0.3);
    ctx.fill();
  }

  private drawStar(ctx: CanvasRenderingContext2D, size: number) {
    const spikes = 4;
    const outerRadius = size;
    const innerRadius = size * 0.35;
    let rot = (Math.PI / 2) * 3;
    let x = 0;
    let y = 0;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(0, -outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = Math.cos(rot) * outerRadius;
      y = Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = Math.cos(rot) * innerRadius;
      y = Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(0, -outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  private drawRibbon(ctx: CanvasRenderingContext2D, size: number, p: Particle) {
    const w = size * 0.4;
    const h = size * 1.8;
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2);
    ctx.quadraticCurveTo(w * 1.5, 0, -w / 2, h / 2);
    ctx.lineTo(w / 2, h / 2);
    ctx.quadraticCurveTo(-w * 1.5, 0, w / 2, -h / 2);
    ctx.closePath();
    ctx.fill();
  }

  private loop = () => {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.16; // gravity
      p.vx *= 0.985; // air resistance
      p.rotation += p.rotationSpeed;
      p.opacity = 1 - p.life / p.maxLife;

      if (p.life >= p.maxLife || p.opacity <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
      } else if (p.shape === 'heart') {
        this.drawHeart(this.ctx, p.size);
      } else if (p.shape === 'star') {
        this.drawStar(this.ctx, p.size);
      } else if (p.shape === 'ribbon') {
        this.drawRibbon(this.ctx, p.size, p);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(this.loop);
    } else {
      this.animationId = null;
    }
  };
}

export const particleFx = new ParticleSystem();
