# 🐮🐎 服务型沟通转换器

一个专业的网页小工具，能够将生硬的商务语言转化为温柔体贴的服务用语，让您的沟通更加优雅得体。

> **核心理念**：极度尊重对方时间和专业、具有高度同理心、主动承担责任、并体贴地为对方提供灵活性。消除任何可能的指责意味，并时刻充分为对方着想。将语气放到最柔和、最体贴的模式。

## 🌟 功能特点

- **🐮🐎高情商转换**：直接接入Qwen2.5-7B大语言模型，提供智能服务型沟通转换
- **实时预览**：输入文案后立即看到转换结果
- **一键复制**：转换后的文案可以一键复制到剪贴板
- **响应式设计**：支持各种设备尺寸，移动端友好
- **极简界面**：黑白极简风格，类似Vercel/V0的设计美学

## 🎯 高情商沟通核心规则

转换遵循以下高情商沟通核心规则：

1. **🐮极度尊重**：尊重对方时间和专业，避免浪费对方资源
2. **🐎高度同理心**：站在对方角度思考，理解对方需求和感受
3. **主动承担责任**：将"你"的问题转化为"我"的责任，消除指责意味
4. **体贴提供灵活性**：主动为对方提供选择和便利
5. **最柔和语气**：使用最体贴、最柔和的表达方式
6. **充分为对方着想**：时刻考虑对方的利益和感受

## 🚀 使用方法

### 基本使用
1. 在输入框中输入要转换的文案
2. 点击"转换"按钮
3. 等待AI转换完成，查看高情商版本
4. 点击"复制"按钮复制结果

**快捷键**：按 `Ctrl + Enter` 可以快速转换文案

### AI模型配置
工具优先使用DeepSeek API，备选Hugging Face免费服务：

1. **🌐 DeepSeek API**：专业的商业级AI服务，响应速度快
2. **🤗 Hugging Face备选**：免费API作为备用方案
3. **终极贴心服务**：使用"终极贴心服务转化专家"系统提示词

### 使用说明
1. 直接输入要转换的文案
2. 点击转换按钮即可
3. 优先使用DeepSeek API，自动备选Hugging Face
4. 使用"终极贴心服务转化专家"系统提示词

## 📱 部署方式

### 方式1：Vercel部署（推荐）
1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 自动部署，获得在线访问链接

### 方式2：Netlify部署
1. 将代码推送到GitHub仓库
2. 在Netlify中导入项目
3. 自动部署，获得在线访问链接

### 方式3：本地使用
```bash
# 使用Python启动本地服务器
python -m http.server 8000

# 或使用Node.js
npx serve .

# 然后在浏览器中访问 http://localhost:8000
```

### 方式4：其他静态托管
将文件上传到任何支持静态文件的Web服务器即可

## 🔧 技术架构

- **前端**：纯HTML + CSS + JavaScript
- **样式**：Tailwind CSS风格 + 响应式设计
- **交互**：原生JavaScript ES6+
- **兼容性**：支持现代浏览器（Chrome、Firefox、Safari、Edge）
- **AI集成**：DeepSeek API + Hugging Face备选服务
- **部署**：支持Vercel、Netlify等静态托管平台

## 📁 文件结构

```
├── index.html          # 主页面文件
├── styles.css          # 样式文件
├── script.js           # 核心逻辑文件
└── README.md           # 说明文档
```

## 🎨 自定义配置

### 修改转换规则
在 `script.js` 文件中的 `applyConversionRules` 方法里，可以修改或添加转换规则：

```javascript
// 添加新的负面词汇替换规则
const negativeToPositive = {
    '不对': '需要微调',
    '错误': '需要优化',
    // 在这里添加更多规则...
};
```

### 修改系统提示词
在 `getSystemPrompt` 方法中可以修改AI的系统提示词，以调整转换风格和行为。

## 🚀 Vercel部署步骤

### 1. 准备代码
确保您的项目包含以下文件：
- `index.html` - 主页面
- `styles.css` - 样式文件
- `script.js` - 核心逻辑
- `vercel.json` - Vercel配置

### 2. 推送到GitHub
```bash
git init
git add .
git commit -m "Initial commit: 贴心服务版文案转换器"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### 3. 在Vercel中部署
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击"New Project"
4. 选择您的仓库
5. 点击"Deploy"

### 4. 自动部署
- Vercel会自动检测项目类型
- 使用`vercel.json`配置进行部署
- 每次推送代码都会自动重新部署

## 🔮 未来扩展

- [x] 集成多种AI API（OpenAI、DeepSeek、Hugging Face）
- [x] 智能降级策略
- [x] Vercel部署支持
- [ ] 添加历史记录功能
- [ ] 支持批量转换
- [ ] 添加更多转换风格选项
- [ ] 支持导出为不同格式

## 📄 许可证

MIT License - 可自由使用、修改和分发

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个工具！

---

**注意**：当前版本使用基于规则的转换逻辑。如需更智能的转换效果，建议集成真实的AI API服务。
