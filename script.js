// P5.js 预览工具主要功能
class P5PreviewTool {
  constructor() {
    this.codeEditor = document.getElementById('codeEditor');
    this.previewFrame = document.getElementById('previewFrame');
    this.previewOverlay = document.getElementById('previewOverlay');
    this.lineNumbers = document.getElementById('lineNumbers');
    this.lineCount = document.getElementById('lineCount');
    this.statusIndicator = document.getElementById('statusIndicator');
    this.errorPanel = document.getElementById('errorPanel');
    this.errorContent = document.getElementById('errorContent');
    
    this.runBtn = document.getElementById('runBtn');
    this.clearBtn = document.getElementById('clearBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    this.closeErrorBtn = document.getElementById('closeErrorBtn');
    
    this.isFullscreen = false;
    this.currentExample = null;
    
    this.initializeEventListeners();
    this.initializeExamples();
    this.updateLineNumbers();
    this.loadDefaultCode();
  }

  // 初始化事件监听器
  initializeEventListeners() {
    // 代码编辑器事件
    this.codeEditor.addEventListener('input', () => {
      this.updateLineNumbers();
      this.hideError();
    });
    
    this.codeEditor.addEventListener('scroll', () => {
      this.lineNumbers.scrollTop = this.codeEditor.scrollTop;
    });
    
    this.codeEditor.addEventListener('keydown', (e) => {
      this.handleEditorKeydown(e);
    });

    // 工具栏按钮事件
    this.runBtn.addEventListener('click', () => this.runCode());
    this.clearBtn.addEventListener('click', () => this.clearCode());
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    this.closeErrorBtn.addEventListener('click', () => this.hideError());

    // 示例代码点击事件
    document.querySelectorAll('.example-item').forEach(item => {
      item.addEventListener('click', () => {
        const example = item.dataset.example;
        this.loadExample(example);
        this.setActiveExample(item);
      });
    });

    // 窗口大小变化事件
    window.addEventListener('resize', () => {
      this.updateLineNumbers();
    });

    // 全屏模式按键事件
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isFullscreen) {
        this.toggleFullscreen();
      }
    });
  }

  // 处理编辑器按键事件
  handleEditorKeydown(e) {
    // Ctrl+Enter 运行代码
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      this.runCode();
      return;
    }

    // Tab 键处理
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.codeEditor.selectionStart;
      const end = this.codeEditor.selectionEnd;
      
      if (e.shiftKey) {
        // Shift+Tab 减少缩进
        this.handleUnindent(start, end);
      } else {
        // Tab 增加缩进
        this.handleIndent(start, end);
      }
      return;
    }

    // 自动括号匹配
    if (['(', '[', '{', '"', "'"].includes(e.key)) {
      this.handleAutoComplete(e);
    }
  }

  // 处理缩进
  handleIndent(start, end) {
    const value = this.codeEditor.value;
    const beforeCursor = value.substring(0, start);
    const selection = value.substring(start, end);
    const afterCursor = value.substring(end);

    if (start === end) {
      // 没有选择文本，插入两个空格
      this.codeEditor.value = beforeCursor + '  ' + afterCursor;
      this.codeEditor.selectionStart = this.codeEditor.selectionEnd = start + 2;
    } else {
      // 有选择文本，为每行添加缩进
      const lines = selection.split('\n');
      const indentedLines = lines.map(line => '  ' + line);
      this.codeEditor.value = beforeCursor + indentedLines.join('\n') + afterCursor;
      this.codeEditor.selectionStart = start;
      this.codeEditor.selectionEnd = start + indentedLines.join('\n').length;
    }
    this.updateLineNumbers();
  }

  // 处理减少缩进
  handleUnindent(start, end) {
    const value = this.codeEditor.value;
    const beforeCursor = value.substring(0, start);
    const selection = value.substring(start, end);
    const afterCursor = value.substring(end);

    if (start === end) {
      // 没有选择文本，删除光标前的空格
      const lineStart = beforeCursor.lastIndexOf('\n') + 1;
      const lineBeforeCursor = beforeCursor.substring(lineStart);
      
      if (lineBeforeCursor.startsWith('  ')) {
        const newBefore = beforeCursor.substring(0, lineStart) + lineBeforeCursor.substring(2);
        this.codeEditor.value = newBefore + afterCursor;
        this.codeEditor.selectionStart = this.codeEditor.selectionEnd = start - 2;
      }
    } else {
      // 有选择文本，为每行删除缩进
      const lines = selection.split('\n');
      const unindentedLines = lines.map(line => line.startsWith('  ') ? line.substring(2) : line);
      this.codeEditor.value = beforeCursor + unindentedLines.join('\n') + afterCursor;
      this.codeEditor.selectionStart = start;
      this.codeEditor.selectionEnd = start + unindentedLines.join('\n').length;
    }
    this.updateLineNumbers();
  }

  // 处理自动补全
  handleAutoComplete(e) {
    const pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
    };

    const start = this.codeEditor.selectionStart;
    const end = this.codeEditor.selectionEnd;
    
    if (start === end) {
      // 没有选择文本
      const char = e.key;
      const closingChar = pairs[char];
      
      if (closingChar) {
        e.preventDefault();
        const value = this.codeEditor.value;
        const beforeCursor = value.substring(0, start);
        const afterCursor = value.substring(end);
        
        this.codeEditor.value = beforeCursor + char + closingChar + afterCursor;
        this.codeEditor.selectionStart = this.codeEditor.selectionEnd = start + 1;
      }
    }
  }

  // 更新行号
  updateLineNumbers() {
    const lines = this.codeEditor.value.split('\n');
    const lineCount = lines.length;
    
    // 更新行号显示
    const lineNumbersHtml = Array.from({length: lineCount}, (_, i) => 
      `<div class="line-number">${i + 1}</div>`
    ).join('');
    
    this.lineNumbers.innerHTML = lineNumbersHtml;
    
    // 更新行数统计
    this.lineCount.textContent = `${lineCount} 行`;
  }

  // 更新状态指示器
  updateStatus(status, text) {
    const statusDot = this.statusIndicator.querySelector('.status-dot');
    const statusText = this.statusIndicator.childNodes[2];
    
    statusDot.className = `status-dot status-${status}`;
    statusText.textContent = text;
  }

  // 运行代码
  async runCode() {
    const code = this.codeEditor.value.trim();
    
    if (!code) {
      this.showError('请输入代码后再运行');
      return;
    }

    this.updateStatus('running', '运行中...');
    this.hideError();

    try {
      // 创建 iframe 内容
      const iframeContent = this.createIframeContent(code);
      
      // 设置 iframe 内容
      const blob = new Blob([iframeContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      this.previewFrame.src = url;
      this.previewOverlay.classList.add('hidden');
      
      // 监听 iframe 加载完成
      this.previewFrame.onload = () => {
        this.updateStatus('ready', '运行成功');
        URL.revokeObjectURL(url);
        
        // 监听 iframe 中的错误
        this.previewFrame.contentWindow.addEventListener('error', (e) => {
          this.showError(`运行时错误: ${e.message}\n位置: 第 ${e.lineno} 行`);
          this.updateStatus('error', '运行错误');
        });
      };
      
    } catch (error) {
      this.showError(`代码执行错误: ${error.message}`);
      this.updateStatus('error', '运行错误');
    }
  }

  // 创建 iframe 内容
  createIframeContent(userCode) {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>P5.js Preview</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        
        main {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
            padding: 0;
        }
        
        canvas {
            display: block;
        }
        
        .error-message {
            background: #fee2e2;
            color: #dc2626;
            padding: 20px;
            margin: 20px;
            border-radius: 8px;
            border: 1px solid #fecaca;
            font-family: monospace;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <main id="canvas-container"></main>
    
    <script>
        // 错误处理
        window.addEventListener('error', function(e) {
            const container = document.getElementById('canvas-container');
            container.innerHTML = '<div class="error-message">错误: ' + e.message + '\\n位置: 第 ' + e.lineno + ' 行</div>';
            
            // 通知父窗口
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'error',
                    message: e.message,
                    line: e.lineno
                }, '*');
            }
        });
        
        // 覆盖 createCanvas 函数以确保画布在正确的容器中
        const originalCreateCanvas = window.createCanvas;
        window.createCanvas = function(w, h, renderer) {
            const canvas = originalCreateCanvas(w, h, renderer);
            const container = document.getElementById('canvas-container');
            
            // 移除可能存在的其他元素
            container.innerHTML = '';
            
            // 将画布添加到容器中
            if (canvas && canvas.canvas) {
                container.appendChild(canvas.canvas);
            } else if (canvas) {
                container.appendChild(canvas);
            }
            
            return canvas;
        };

        // 用户代码
        try {
            ${userCode}
        } catch (error) {
            const container = document.getElementById('canvas-container');
            container.innerHTML = '<div class="error-message">代码执行错误: ' + error.message + '</div>';
            
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'error',
                    message: error.message
                }, '*');
            }
        }
    </script>
</body>
</html>`;
  }

  // 清空代码
  clearCode() {
    if (confirm('确定要清空所有代码吗？')) {
      this.codeEditor.value = '';
      this.updateLineNumbers();
      this.previewFrame.src = 'about:blank';
      this.previewOverlay.classList.remove('hidden');
      this.updateStatus('ready', '就绪');
      this.hideError();
      this.clearActiveExample();
    }
  }

  // 切换全屏模式
  toggleFullscreen() {
    const previewPanel = document.querySelector('.preview-panel');
    
    if (this.isFullscreen) {
      previewPanel.classList.remove('fullscreen');
      this.fullscreenBtn.title = '全屏预览';
      this.isFullscreen = false;
    } else {
      previewPanel.classList.add('fullscreen');
      this.fullscreenBtn.title = '退出全屏 (ESC)';
      this.isFullscreen = true;
    }
  }

  // 显示错误信息
  showError(message) {
    this.errorContent.textContent = message;
    this.errorPanel.classList.add('show');
  }

  // 隐藏错误信息
  hideError() {
    this.errorPanel.classList.remove('show');
  }

  // 初始化示例代码
  initializeExamples() {
    this.examples = {
      basic: `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220, 230, 255);
  
  // 彩虹色的圆形跟随鼠标
  for (let i = 0; i < 6; i++) {
    let hue = (frameCount + i * 60) % 360;
    fill(hue, 80, 100);
    noStroke();
    
    let x = mouseX + cos(frameCount * 0.05 + i) * 30;
    let y = mouseY + sin(frameCount * 0.05 + i) * 30;
    
    circle(x, y, 40 - i * 5);
  }
}`,

      interactive: `let particles = [];

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(0, 0, 10, 0.1);
  
  // 添加新粒子
  if (mouseIsPressed) {
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  }
  
  // 更新和绘制粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // 显示说明文字
  fill(0, 0, 100);
  text('点击并拖拽鼠标创建粒子', 10, 20);
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(2, 8));
    this.life = 255;
    this.hue = random(200, 320);
  }
  
  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.98);
    this.life -= 2;
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(this.hue, 80, 100, this.life / 255);
    noStroke();
    circle(0, 0, map(this.life, 0, 255, 0, 20));
    pop();
  }
  
  isDead() {
    return this.life <= 0;
  }
}`,

      particles: `let system;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100);
  system = new ParticleSystem(createVector(width / 2, 50));
}

function draw() {
  background(240, 20, 20);
  
  system.addParticle();
  system.run();
  
  // 鼠标交互
  if (mouseIsPressed) {
    system.origin.set(mouseX, mouseY);
  }
  
  // 显示说明
  fill(0, 0, 100);
  text('点击拖拽改变粒子发射点', 10, height - 20);
}

class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
  }
  
  addParticle() {
    this.particles.push(new Particle2(this.origin));
  }
  
  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}

class Particle2 {
  constructor(position) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-2, 2), random(-5, -2));
    this.position = position.copy();
    this.lifespan = 255.0;
    this.hue = random(180, 280);
  }
  
  run() {
    this.update();
    this.display();
  }
  
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  }
  
  display() {
    stroke(this.hue, 100, 100, this.lifespan / 255);
    strokeWeight(2);
    fill(this.hue, 60, 100, this.lifespan / 255);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading() + PI / 2);
    triangle(0, -8, -4, 8, 4, 8);
    pop();
  }
  
  isDead() {
    return this.lifespan <= 0;
  }
}`,

      fractal: `let angle = 0;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(220, 30, 10);
  
  translate(width / 2, height);
  stroke(120, 100, 100);
  strokeWeight(2);
  
  angle = map(sin(frameCount * 0.01), -1, 1, 0, PI / 3);
  
  branch(150);
}

function branch(len) {
  line(0, 0, 0, -len);
  translate(0, -len);
  
  if (len > 10) {
    push();
    rotate(angle);
    branch(len * 0.67);
    pop();
    
    push();
    rotate(-angle);
    branch(len * 0.67);
    pop();
  }
}`
    };
  }

  // 加载示例代码
  loadExample(exampleName) {
    if (this.examples[exampleName]) {
      this.codeEditor.value = this.examples[exampleName];
      this.updateLineNumbers();
      this.hideError();
      this.currentExample = exampleName;
    }
  }

  // 设置活动示例
  setActiveExample(element) {
    document.querySelectorAll('.example-item').forEach(item => {
      item.classList.remove('active');
    });
    element.classList.add('active');
  }

  // 清除活动示例
  clearActiveExample() {
    document.querySelectorAll('.example-item').forEach(item => {
      item.classList.remove('active');
    });
    this.currentExample = null;
  }

  // 加载默认代码
  loadDefaultCode() {
    const defaultCode = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  
  // 绘制一个跟随鼠标的圆
  fill(100, 150, 255);
  noStroke();
  circle(mouseX, mouseY, 50);
  
  // 绘制网格
  stroke(200);
  strokeWeight(1);
  
  for (let x = 0; x <= width; x += 20) {
    line(x, 0, x, height);
  }
  
  for (let y = 0; y <= height; y += 20) {
    line(0, y, width, y);
  }
}`;

    this.codeEditor.value = defaultCode;
    this.updateLineNumbers();
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new P5PreviewTool();
});
