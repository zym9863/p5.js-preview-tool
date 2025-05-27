Language: English | [中文](README.md) 

# P5.js Preview Tool

A web-based P5.js code editor and real-time preview tool with modern UI and rich features.

![P5.js Preview Tool](https://img.shields.io/badge/P5.js-Preview%20Tool-ED225D?style=for-the-badge&logo=p5.js&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🎨 Code Editor
- **Syntax Support**: Code editor optimized for P5.js
- **Line Numbers**: Clear line number identification and line count
- **Smart Indentation**: Support Tab/Shift+Tab for indentation management
- **Auto-completion**: Automatic pairing of brackets and quotes
- **Shortcuts**: Ctrl+Enter for quick code execution

### 🖼️ Real-time Preview
- **Instant Rendering**: View effects immediately after code changes
- **Fullscreen Mode**: Support fullscreen canvas preview
- **Error Handling**: Detailed error information display
- **Status Indicator**: Real-time code execution status

### 📚 Example Code Library
Built-in curated examples:
- **Basic Drawing**: Simple circle animation and color effects
- **Interactive Drawing**: Mouse-following particle effects
- **Particle System**: Advanced particle system demonstration
- **Fractal Patterns**: Recursive dynamic tree structures

### 🎯 User Experience
- **Responsive Design**: Support for various screen sizes
- **Modern UI**: Beautiful interface based on modern design language
- **Dark Theme**: Eye-friendly color scheme
- **Smooth Animations**: Rich transition animation effects

## 🚀 Quick Start

### Online Usage
Simply open the `index.html` file to use in your browser.

### Local Deployment

1. **Clone or Download Project**
   ```bash
   git clone https://github.com/zym9863/p5js-preview-tool.git
   cd p5js-preview-tool
   ```

2. **Start Local Server** (optional)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open Browser**
   Visit `http://localhost:8000` or directly open `index.html`

## 🎮 Usage Guide

### Basic Operations

1. **Write Code**: Enter P5.js code in the left editor
2. **Run Preview**: Click the run button or press `Ctrl+Enter`
3. **View Effects**: Check real-time effects in the right preview panel
4. **Fullscreen View**: Click fullscreen button or press `ESC` to exit

### Shortcuts

| Shortcut | Function |
|----------|----------|
| `Ctrl+Enter` | Run code |
| `Tab` | Increase indentation |
| `Shift+Tab` | Decrease indentation |
| `ESC` | Exit fullscreen mode |

### Example Code

Click any item in the left example list to load the corresponding example code:

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  circle(mouseX, mouseY, 50);
}
```

## 🛠️ Technology Stack

- **Frontend Framework**: Native HTML5 + CSS3 + JavaScript (ES6+)
- **Graphics Library**: P5.js (v1.7.0)
- **Fonts**: Inter + Fira Code
- **Icons**: Custom SVG icons
- **Styling**: CSS Grid + Flexbox layout

## 📁 Project Structure

```
p5js-preview-tool/
├── index.html          # Main page structure
├── styles.css          # Style file
├── script.js           # Main logic
├── README.md           # Project documentation (Chinese)
└── README_EN.md        # Project documentation (English)
```

### Core Components

- **P5PreviewTool**: Main application class
- **Editor Management**: Code editing, line numbers, syntax support
- **Preview System**: iframe rendering, error handling
- **Example Management**: Built-in example code library
- **UI Control**: Toolbar, state management

## 🎨 Design Features

### Color System
- **Primary**: Indigo (#6366f1)
- **Success**: Emerald (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Font Selection
- **UI Font**: Inter - Modern sans-serif font
- **Code Font**: Fira Code - Monospace programming font

### Responsive Adaptation
- **Desktop**: Full-featured layout
- **Tablet**: Optimized dual-column layout
- **Mobile**: Vertical stacked layout

## 🔧 Custom Configuration

### Modify Theme Colors
Modify CSS variables in the `:root` section of `styles.css`:

```css
:root {
  --primary-color: #your-color;
  --primary-hover: #your-hover-color;
  /* Other color variables... */
}
```

### Add New Examples
Add in the `initializeExamples()` method in `script.js`:

```javascript
this.examples = {
  // Existing examples...
  newExample: `your p5.js code here`
};
```

### Customize Editor
Modify editor configuration in `script.js`:

```javascript
// Modify default code
loadDefaultCode() {
  const defaultCode = `your default code`;
  // ...
}
```

## 🔍 Troubleshooting

### Common Issues

**Q: Code won't run**
- Check for syntax errors
- Ensure correct P5.js functions are used
- Check error panel for detailed information

**Q: Preview is blank**
- Confirm code includes `createCanvas()` function
- Check canvas size settings
- Try refreshing the page

**Q: Style display issues**
- Ensure all file paths are correct
- Check browser console for error messages
- Confirm network connection (font loading)

## 🚀 Extended Features

### Possible Improvement Directions
- [ ] Code syntax highlighting
- [ ] Auto-save functionality
- [ ] Project import/export
- [ ] More built-in examples
- [ ] Code snippet library
- [ ] Collaborative editing
- [ ] Version control

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Made with ❤️ and ☕** 

*Enjoy the fun of creative programming!* 🎨✨
