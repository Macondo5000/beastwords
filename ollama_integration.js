// Ollama集成 - 本地免费AI模型
class OllamaIntegration {
    constructor() {
        this.ollamaUrl = 'http://localhost:11434'; // Ollama默认端口
        this.defaultModel = 'qwen2.5:7b'; // 推荐的中文模型
    }

    // 检查Ollama服务是否可用
    async checkOllamaStatus() {
        try {
            const response = await fetch(`${this.ollamaUrl}/api/tags`);
            return response.ok;
        } catch (error) {
            console.error('Ollama服务不可用:', error);
            return false;
        }
    }

    // 获取可用的模型列表
    async getAvailableModels() {
        try {
            const response = await fetch(`${this.ollamaUrl}/api/tags`);
            if (response.ok) {
                const data = await response.json();
                return data.models || [];
            }
            return [];
        } catch (error) {
            console.error('获取模型列表失败:', error);
            return [];
        }
    }

    // 调用Ollama模型进行文案转换
    async convertText(inputText, model = null) {
        const selectedModel = model || this.defaultModel;
        
        try {
            const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: selectedModel,
                    prompt: this.buildPrompt(inputText),
                    stream: false,
                    options: {
                        temperature: 0.7,
                        top_p: 0.9,
                        max_tokens: 1000
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama请求失败: ${response.status}`);
            }

            const result = await response.json();
            return result.response.trim();
            
        } catch (error) {
            console.error('Ollama调用失败:', error);
            throw error;
        }
    }

    // 构建提示词
    buildPrompt(inputText) {
        return `你是一位专业的文案优化与客户服务专家，擅长将各种生硬、直接或不规范的商务沟通语言，转化为温柔、体贴、周到且专业的高级服务用语。

【核心指令】
请将用户输入的任何一句话，转化为"贴心服务版"。转化时必须严格遵守以下规则：

【风格与语气规则】
1. **积极正面：** 永远使用积极正面的词汇，避免任何负面词汇（如：错误、问题、失败、但是）。如需指出差异，请使用"微调"、"优化"、"更新"等词。
2. **谦逊礼貌：** 使用敬语（如"请"、"您"、"劳驾"）、谦词（如"抱歉"、"不好意思"）和舒缓的语气词（如"哦"、"呢"、"哈"）。
3. **主动负责：** 将"你"的问题，转化为"我"的责任。例如，不说"你搞错了"，而说"我可能刚才没同步清楚"。
4. **提供价值：** 在回复中主动提供额外帮助，例如"我随时可以协助"、"有任何需要请告诉我"。
5. **结构清晰：** 转化后的句子应流畅自然，逻辑清晰，可以通过分句让长句更易读。

【输出规则】
1. 只输出转化后的最终结果，不要添加任何解释、开场白或总结。
2. 严格遵守用户输入的原意，不得编造或添加原文中不存在的事实性信息。
3. 长度适中，通常比原文稍长即可。

用户输入：${inputText}

请输出转换后的贴心服务版文案：`;
    }

    // 下载并运行模型
    async pullModel(modelName) {
        try {
            const response = await fetch(`${this.ollamaUrl}/api/pull`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: modelName
                })
            });

            if (!response.ok) {
                throw new Error(`模型下载失败: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('模型下载失败:', error);
            throw error;
        }
    }
}

// 使用示例
async function testOllama() {
    const ollama = new OllamaIntegration();
    
    // 检查服务状态
    const isAvailable = await ollama.checkOllamaStatus();
    console.log('Ollama服务状态:', isAvailable ? '可用' : '不可用');
    
    if (isAvailable) {
        // 获取可用模型
        const models = await ollama.getAvailableModels();
        console.log('可用模型:', models);
        
        // 测试文案转换
        try {
            const result = await ollama.convertText('这个不对，要看最新文档');
            console.log('转换结果:', result);
        } catch (error) {
            console.error('转换失败:', error);
        }
    }
}

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OllamaIntegration;
}
