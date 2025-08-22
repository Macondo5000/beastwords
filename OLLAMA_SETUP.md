# 🚀 Ollama 本地AI模型安装指南

## 🌟 什么是Ollama？

Ollama是一个强大的本地AI模型运行工具，可以：
- ✅ **完全免费**：无需支付任何费用
- ✅ **本地运行**：数据完全在本地，安全隐私
- ✅ **支持多种模型**：Llama、Mistral、Qwen、ChatGLM等
- ✅ **简单易用**：一行命令安装，一键运行模型

## 📥 安装步骤

### macOS 安装
```bash
# 使用Homebrew安装
brew install ollama

# 或者直接下载安装包
curl -fsSL https://ollama.ai/install.sh | sh
```

### Linux 安装
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows 安装
1. 访问 [https://ollama.ai/download](https://ollama.ai/download)
2. 下载Windows安装包
3. 运行安装程序

## 🚀 快速开始

### 1. 启动Ollama服务
```bash
ollama serve
```

### 2. 下载推荐的中文模型
```bash
# 下载Qwen2.5 7B模型（推荐，中文效果好）
ollama pull qwen2.5:7b

# 或者下载其他模型
ollama pull llama3.1:8b    # Meta的Llama模型
ollama pull mistral:7b     # Mistral AI的模型
ollama pull chatglm3:6b    # 清华的ChatGLM模型
```

### 3. 测试模型
```bash
# 启动对话
ollama run qwen2.5:7b

# 或者直接提问
ollama run qwen2.5:7b "你好，请介绍一下自己"
```

## 🔧 集成到我们的工具

### 1. 确保Ollama服务运行
```bash
# 检查服务状态
curl http://localhost:11434/api/tags

# 如果返回模型列表，说明服务正常
```

### 2. 在网页工具中使用
我们的工具会自动检测Ollama服务，如果可用就会使用本地AI模型进行转换。

## 📊 模型对比

| 模型名称 | 大小 | 中文支持 | 性能 | 推荐度 |
|---------|------|----------|------|--------|
| qwen2.5:7b | 7B | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| llama3.1:8b | 8B | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| mistral:7b | 7B | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| chatglm3:6b | 6B | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## 💡 使用建议

### 首次使用
1. 先下载 `qwen2.5:7b` 模型（中文效果最好）
2. 确保有足够的磁盘空间（约需要4-8GB）
3. 首次运行可能需要几分钟加载

### 性能优化
- **内存**：建议至少8GB RAM
- **存储**：SSD硬盘会更快
- **GPU**：如果有NVIDIA GPU，会自动使用加速

## 🆘 常见问题

### Q: 模型下载失败？
A: 检查网络连接，或者使用国内镜像源

### Q: 运行速度慢？
A: 这是正常的，本地模型需要时间加载和推理

### Q: 内存不足？
A: 可以尝试更小的模型，如 `qwen2.5:1.5b`

### Q: 如何停止服务？
A: 按 `Ctrl+C` 停止，或者 `pkill ollama`

## 🌐 网络配置

### 国内用户加速
```bash
# 设置环境变量使用国内镜像
export OLLAMA_HOST=0.0.0.0
export OLLAMA_ORIGINS=*

# 或者使用代理
export https_proxy=http://127.0.0.1:7890
```

## 📱 移动端支持

Ollama也支持在手机和平板上运行，可以：
- 在Android上使用Termux
- 在iOS上使用iSH
- 通过局域网访问其他设备的Ollama服务

## 🎯 下一步

1. 安装Ollama
2. 下载推荐模型
3. 启动服务
4. 刷新我们的网页工具
5. 享受免费的本地AI文案转换！

---

**提示**：Ollama是完全免费的开源项目，您可以放心使用，无需担心费用问题！
