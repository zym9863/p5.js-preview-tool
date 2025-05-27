Language: [English](README_EN.md) | 中文 

# P5.js 预览工具

一个基于 Web 的 P5.js 代码编辑器和实时预览工具，提供现代化的用户界面和丰富的功能。

![P5.js Preview Tool](https://img.shields.io/badge/P5.js-Preview%20Tool-ED225D?style=for-the-badge&logo=p5.js&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ 功能特性

### 🎨 代码编辑器
- **语法支持**: 专为 P5.js 优化的代码编辑器
- **行号显示**: 清晰的行号标识和行数统计
- **智能缩进**: 支持 Tab/Shift+Tab 进行缩进管理
- **自动补全**: 括号和引号自动配对
- **快捷键**: Ctrl+Enter 快速运行代码

### 🖼️ 实时预览
- **即时渲染**: 代码变更后立即查看效果
- **全屏模式**: 支持全屏预览画布效果
- **错误处理**: 详细的错误信息显示
- **状态指示**: 实时显示代码运行状态

### 📚 示例代码库
内置多个精选示例：
- **基础绘图**: 简单的圆形动画和颜色效果
- **交互绘图**: 鼠标跟随的粒子效果
- **粒子系统**: 高级粒子系统演示
- **分形图案**: 递归绘制的动态树形结构

### 🎯 用户体验
- **响应式设计**: 支持各种屏幕尺寸
- **现代化 UI**: 基于现代设计语言的精美界面
- **深色主题**: 护眼的配色方案
- **流畅动画**: 丰富的过渡动画效果

## 🚀 快速开始

### 在线使用
直接打开 `index.html` 文件即可在浏览器中使用。

### 本地部署

1. **克隆或下载项目**
   ```bash
   git clone https://github.com/zym9863/p5.js-preview-tool.git
   cd p5.js-preview-tool
   ```

2. **启动本地服务器**（可选）
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 使用 Node.js
   npx serve .
   
   # 使用 PHP
   php -S localhost:8000
   ```

3. **打开浏览器**
   访问 `http://localhost:8000` 或直接打开 `index.html`

## 🎮 使用指南

### 基本操作

1. **编写代码**: 在左侧编辑器中输入 P5.js 代码
2. **运行预览**: 点击运行按钮或按 `Ctrl+Enter`
3. **查看效果**: 在右侧预览面板查看实时效果
4. **全屏查看**: 点击全屏按钮或 `ESC` 退出

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Enter` | 运行代码 |
| `Tab` | 增加缩进 |
| `Shift+Tab` | 减少缩进 |
| `ESC` | 退出全屏模式 |

### 示例代码

点击左侧示例列表中的任意项目即可加载对应的示例代码：

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  circle(mouseX, mouseY, 50);
}
```

## 🛠️ 技术栈

- **前端框架**: 原生 HTML5 + CSS3 + JavaScript (ES6+)
- **图形库**: P5.js (v1.7.0)
- **字体**: Inter + Fira Code
- **图标**: 自定义 SVG 图标
- **样式**: CSS Grid + Flexbox 布局

## 📁 项目结构

```
p5js-preview-tool/
├── index.html          # 主页面结构
├── styles.css          # 样式文件
├── script.js           # 主要逻辑
└── README.md           # 项目文档
```

### 核心组件

- **P5PreviewTool**: 主要应用类
- **编辑器管理**: 代码编辑、行号、语法支持
- **预览系统**: iframe 渲染、错误处理
- **示例管理**: 内置示例代码库
- **UI 控制**: 工具栏、状态管理

## 🎨 设计特色

### 色彩系统
- **主色调**: Indigo (#6366f1)
- **成功色**: Emerald (#10b981)
- **警告色**: Amber (#f59e0b)
- **错误色**: Red (#ef4444)

### 字体选择
- **界面字体**: Inter - 现代无衬线字体
- **代码字体**: Fira Code - 等宽编程字体

### 响应式适配
- **桌面端**: 完整功能布局
- **平板端**: 优化的双栏布局
- **移动端**: 垂直堆叠布局

## 🔧 自定义配置

### 修改主题色彩
在 `styles.css` 的 `:root` 部分修改 CSS 变量：

```css
:root {
  --primary-color: #your-color;
  --primary-hover: #your-hover-color;
  /* 其他颜色变量... */
}
```

### 添加新示例
在 `script.js` 的 `initializeExamples()` 方法中添加：

```javascript
this.examples = {
  // 现有示例...
  newExample: `your p5.js code here`
};
```

### 自定义编辑器
修改 `script.js` 中的编辑器配置：

```javascript
// 修改默认代码
loadDefaultCode() {
  const defaultCode = `your default code`;
  // ...
}
```

## 🔍 故障排除

### 常见问题

**Q: 代码无法运行**
- 检查语法错误
- 确保使用正确的 P5.js 函数
- 查看错误面板的详细信息

**Q: 预览空白**
- 确认代码中包含 `createCanvas()` 函数
- 检查画布尺寸设置
- 尝试刷新页面

**Q: 样式显示异常**
- 确保所有文件路径正确
- 检查浏览器控制台的错误信息
- 确认网络连接正常（字体加载）

## 🚀 扩展功能

### 可能的改进方向
- [ ] 代码语法高亮
- [ ] 自动保存功能
- [ ] 项目导入/导出
- [ ] 更多内置示例
- [ ] 代码片段库
- [ ] 协作编辑
- [ ] 版本控制

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

**用 ❤️ 和 ☕ 制作** 

*享受创意编程的乐趣！* 🎨✨
