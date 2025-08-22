// 贴心服务版文案转换器
class ServiceTextConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.systemPrompt = this.getSystemPrompt();
        this.lastUsedMethod = 'rules'; // 默认使用规则转换
        
        // 统计相关
        this.stats = {
            totalVisits: 0,
            onlineUsers: 0,
            tokenUsage: 0
        };
        
        // 初始化统计
        this.initializeStats();
    }

    initializeElements() {
        this.userInput = document.getElementById('userInput');
        this.convertBtn = document.getElementById('convertBtn');
        this.resultSection = document.getElementById('resultSection');
        this.resultContent = document.getElementById('resultContent');
        this.copyBtn = document.getElementById('copyBtn');
        this.btnText = document.querySelector('.btn-text');
        this.btnLoading = document.querySelector('.btn-loading');
        
        // API密钥输入框
        this.openaiKeyInput = document.getElementById('openaiKeyInput');
        this.deepseekKeyInput = document.getElementById('deepseekKeyInput');
        
        // API密钥按钮
        this.saveOpenAIKeyBtn = document.getElementById('saveOpenAIKey');
        this.saveDeepSeekKeyBtn = document.getElementById('saveDeepSeekKey');
        this.clearAllKeysBtn = document.getElementById('clearAllKeys');
    }

    bindEvents() {
        this.convertBtn.addEventListener('click', () => this.convertText());
        this.copyBtn.addEventListener('click', () => this.copyResult());
        
        // API密钥管理
        this.saveOpenAIKeyBtn.addEventListener('click', () => this.saveOpenAIKey());
        this.saveDeepSeekKeyBtn.addEventListener('click', () => this.saveDeepSeekKey());
        this.clearAllKeysBtn.addEventListener('click', () => this.clearAllKeys());
        
        this.userInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.convertText();
            }
        });
        
        // 页面加载时检查并显示已保存的API密钥
        this.loadSavedApiKeys();
        
        // 页面可见性变化时更新在线状态
        document.addEventListener('visibilitychange', () => {
            this.updateOnlineStatus();
        });
        
        // 页面卸载时更新在线状态
        window.addEventListener('beforeunload', () => {
            this.updateOnlineStatus(false);
        });
        
        // 定期更新在线状态（每分钟）
        setInterval(() => {
            this.updateOnlineStatus(true);
        }, 60000);
    }

    getDeepSeekPrompt() {
        return `【系统提示词：终极贴心服务转化专家】

角色与使命
您是"终极贴心服务转化专家"，专注于将普通商务沟通转化为极致尊重、体贴入微、充满同理心的高级服务语言。您的核心使命是：在保持原意的前提下，让每句话都充满温暖与专业，让对方感受到被充分尊重和理解。

核心原则
极致尊重原则
- 使用最高级别敬语（您/请/劳驾/荣幸）
- 始终认可对方时间和专业的价值
- 保持谦逊态度，将自己放在服务者位置

高度共情原则
- 优先考虑对方的感受和处境
- 主动理解对方可能的困难或限制
- 用"我们"代替"你"，体现共同承担责任

主动担责原则
- 将问题转化为自己的责任
- 提供具体解决方案而非指出问题
- 提前为对方考虑好各种可能性

灵活便利原则
- 始终提供多种选择或变通方案
- 强调"以您方便为准"
- 减少对方的决策负担和时间成本

语言风格指南
词汇选择
- 必用：请、您、辛苦、感谢、荣幸、方便、理解、建议、共同
- 禁用：错误、不行、不对、失败、但是、问题、麻烦（作动词）

句式结构
- 使用缓和语气："可能...或许..."、"建议...或许可以..."
- 善用问句征求同意："不知是否方便...？"、"您看这样是否可以...？"
- 分句表达，避免长难句

情感表达
- 适当使用柔和语气词："呢"、"哦"、"～"
- 体现真诚的感谢和理解
- 保持专业而不失温暖

场景化应对策略
指出问题时
模板："我们注意到...或许可以优化" + "建议..." + "您看这样是否更方便？"

提出要求时
模板："不好意思打扰..." + "为了..." + "可能得麻烦您..." + "当然如果您...也可以..."

纠正错误时
模板："可能我这边..." + "以您为准" + "我已经...您看是否需要..."

邀请沟通时
模板："希望能有幸..." + "不知是否方便..." + "时间完全以您为准" + "我们可以先..."

高级技巧
- 预设解决方案：提前为对方想好2-3种选择
- 降低参与成本：明确所需时间、准备材料、预期结果
- 给予专业认可：肯定对方的经验和价值
- 提供退出机制：总是允许对方拒绝或推迟

输出规则
- 严格保持原意，不添加不存在的事实
- 输出长度可比原文长30-50%，但需保持简洁
- 只输出转化结果，不加任何解释
- 适应中文商务环境，保持文化敏感性

最后指令
请以最专业、最体贴的方式处理每次输入，让每次沟通都成为一次愉悦的体验。现在，请开始展示您卓越的服务艺术。`;
    }

    getSystemPrompt() {
        return this.getDeepSeekPrompt();
    }

    async convertText() {
        const inputText = this.userInput.value.trim();
        
        if (!inputText) {
            this.showError('请输入要转换的文案');
            return;
        }

        this.setLoadingState(true);
        
        try {
            // 调用AI转换
            const convertedText = await this.simulateAIConversion(inputText);
            this.showResult(convertedText);
        } catch (error) {
            console.error('转换失败:', error);
            
            // 显示错误并提供重试选项
            this.showErrorWithRetry(error.message, () => this.convertText());
        } finally {
            this.setLoadingState(false);
        }
    }

    async simulateAIConversion(inputText) {
        // 优先使用DeepSeek API
        try {
            const deepseekResult = await this.callDeepSeekAPI(inputText);
            this.lastUsedMethod = 'deepseek';
            return deepseekResult;
        } catch (error) {
            console.log('DeepSeek API调用失败，尝试Hugging Face:', error);
            
            // 如果DeepSeek失败，尝试Hugging Face作为备选
            try {
                const hfResult = await this.tryHuggingFaceAPI(inputText);
                if (hfResult) {
                    this.lastUsedMethod = 'huggingface';
                    return hfResult;
                }
            } catch (hfError) {
                console.log('Hugging Face API也失败:', hfError);
            }
            
            throw new Error('AI服务暂时不可用，请稍后重试');
        }
    }

    async tryHuggingFaceAPI(inputText) {
        // 尝试多个API端点，提高成功率
        const API_ENDPOINTS = [
            "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct",
            "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Chat",
            "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-1.5B-Instruct"
        ];
        
        for (let i = 0; i < API_ENDPOINTS.length; i++) {
            try {
                console.log(`尝试API端点 ${i + 1}: ${API_ENDPOINTS[i]}`);
                
                const response = await fetch(API_ENDPOINTS[i], {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: this.buildQwenPrompt(inputText),
                        parameters: {
                            max_new_tokens: 600,
                            temperature: 0.7,
                            top_p: 0.9,
                            do_sample: true,
                            repetition_penalty: 1.1
                        }
                    })
                });

                if (!response.ok) {
                    console.log(`端点 ${i + 1} 失败: ${response.status}`);
                    continue; // 尝试下一个端点
                }

                const result = await response.json();
                
                // 处理Qwen模型的返回格式
                if (Array.isArray(result) && result[0] && result[0].generated_text) {
                    console.log(`端点 ${i + 1} 成功`);
                    return this.extractQwenResponse(result[0].generated_text, inputText);
                } else if (result.error) {
                    console.log(`端点 ${i + 1} 模型错误: ${result.error}`);
                    continue;
                }
                
                console.log(`端点 ${i + 1} 响应格式异常`);
                continue;
                
            } catch (error) {
                console.error(`端点 ${i + 1} 调用失败:`, error);
                continue; // 尝试下一个端点
            }
        }
        
        // 所有端点都失败了
        throw new Error('所有AI服务端点都不可用，请稍后重试');
    }

    buildQwenPrompt(inputText) {
        return `<|im_start|>system
你是一位专业的文案优化与客户服务专家，擅长将各种生硬、直接或不规范的商务沟通语言，转化为温柔、体贴、周到且专业的高级服务用语。

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
4. 使用中文回复，保持专业性和礼貌性。

用户输入：${inputText}

请输出转换后的贴心服务版文案：<|im_end|>
<|im_start|>assistant
`;
    }

    extractQwenResponse(generatedText, originalInput) {
        // 专门处理Qwen2.5-7B模型的输出格式
        try {
            // 查找assistant标记后的内容
            const assistantIndex = generatedText.indexOf('<|im_start|>assistant');
            if (assistantIndex !== -1) {
                const afterAssistant = generatedText.substring(assistantIndex + '<|im_start|>assistant'.length);
                // 查找结束标记
                const endIndex = afterAssistant.indexOf('<|im_end|>');
                if (endIndex !== -1) {
                    return afterAssistant.substring(0, endIndex).trim();
                } else {
                    // 如果没有结束标记，返回assistant后的所有内容
                    return afterAssistant.trim();
                }
            }
            
            // 如果没有找到assistant标记，尝试其他方式
            const userInputIndex = generatedText.indexOf('用户输入：');
            if (userInputIndex !== -1) {
                const afterUserInput = generatedText.substring(userInputIndex);
                const assistantStart = afterUserInput.indexOf('assistant');
                if (assistantStart !== -1) {
                    return afterUserInput.substring(assistantStart + 10).trim();
                }
            }
            
            // 如果都找不到，返回清理后的文本
            return this.cleanQwenOutput(generatedText);
            
        } catch (error) {
            console.error('解析Qwen响应失败:', error);
            return this.cleanQwenOutput(generatedText);
        }
    }

    cleanQwenOutput(text) {
        // 清理Qwen模型的输出，去除多余的标记和提示词
        let cleaned = text
            .replace(/<\|im_start\|>/g, '')
            .replace(/<\|im_end\|>/g, '')
            .replace(/system.*?用户输入：/s, '')
            .replace(/assistant.*?用户输入：/s, '')
            .replace(/assistant/s, '')
            .trim();
        
        // 如果清理后为空，返回原文
        if (!cleaned) {
            return text.trim();
        }
        
        return cleaned;
    }

    buildOllamaPrompt(inputText) {
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

    async callOpenAIAPI(inputText, apiKey) {
        const API_URL = "https://api.openai.com/v1/chat/completions";
        
        const data = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": this.systemPrompt},
                {"role": "user", "content": inputText}
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`OpenAI API请求失败: ${response.status}`);
        }

        const result = await response.json();
        return result.choices[0].message.content;
    }

    async callDeepSeekAPI(inputText) {
        const API_URL = "https://api.deepseek.com/v1/chat/completions";
        const API_KEY = "sk-90cc4f72fd2c43f291843b2f46d64611";
        
        const data = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": this.getDeepSeekPrompt()},
                {"role": "user", "content": inputText}
            ],
            "temperature": 0.7,
            "max_tokens": 2000
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API请求失败: ${response.status}`);
        }

        const result = await response.json();
        
        // 统计token使用量
        if (result.usage) {
            const inputTokens = result.usage.prompt_tokens || 0;
            const outputTokens = result.usage.completion_tokens || 0;
            this.updateTokenUsage(inputTokens, outputTokens);
        }
        
        return result.choices[0].message.content;
    }

    getOpenAIKey() {
        // 从localStorage获取OpenAI API密钥
        return localStorage.getItem('openai_api_key');
    }

    getDeepSeekKey() {
        // 从localStorage获取DeepSeek API密钥
        return localStorage.getItem('deepseek_api_key');
    }

    getApiKey() {
        // 兼容性方法，返回DeepSeek密钥
        return this.getDeepSeekKey();
    }

    saveOpenAIKey() {
        const apiKey = this.openaiKeyInput.value.trim();
        if (!apiKey) {
            alert('请输入OpenAI API密钥');
            return;
        }
        
        localStorage.setItem('openai_api_key', apiKey);
        this.openaiKeyInput.value = '';
        alert('OpenAI API密钥已保存！');
        this.updateAllApiStatus();
    }

    saveDeepSeekKey() {
        const apiKey = this.deepseekKeyInput.value.trim();
        if (!apiKey) {
            alert('请输入DeepSeek API密钥');
            return;
        }
        
        localStorage.setItem('deepseek_api_key', apiKey);
        this.deepseekKeyInput.value = '';
        alert('DeepSeek API密钥已保存！');
        this.updateAllApiStatus();
    }

    clearAllKeys() {
        localStorage.removeItem('openai_api_key');
        localStorage.removeItem('deepseek_api_key');
        this.openaiKeyInput.value = '';
        this.deepseekKeyInput.value = '';
        alert('所有API密钥已清除！');
        this.updateAllApiStatus();
    }

    loadSavedApiKeys() {
        const openaiKey = localStorage.getItem('openai_api_key');
        const deepseekKey = localStorage.getItem('deepseek_api_key');
        
        if (openaiKey) {
            this.openaiKeyInput.value = '••••••••••••••••';
        }
        if (deepseekKey) {
            this.deepseekKeyInput.value = '••••••••••••••••';
        }
        
        this.updateAllApiStatus();
    }

    updateAllApiStatus() {
        const hasOpenAIKey = !!localStorage.getItem('openai_api_key');
        const hasDeepSeekKey = !!localStorage.getItem('deepseek_api_key');
        
        // 更新OpenAI状态指示器
        const openaiStatusElement = document.getElementById('openaiStatus');
        if (openaiStatusElement) {
            if (hasOpenAIKey) {
                openaiStatusElement.textContent = '✅ 已配置';
                openaiStatusElement.style.background = '#d4edda';
                openaiStatusElement.style.color = '#155724';
            } else {
                openaiStatusElement.textContent = '❌ 未配置';
                openaiStatusElement.style.background = '#f8d7da';
                openaiStatusElement.style.color = '#721c24';
            }
        }
        
        // 更新DeepSeek状态指示器
        const deepseekStatusElement = document.getElementById('deepseekStatus');
        if (deepseekStatusElement) {
            if (hasDeepSeekKey) {
                deepseekStatusElement.textContent = '✅ 已配置';
                deepseekStatusElement.style.background = '#d4edda';
                deepseekStatusElement.style.color = '#155724';
            } else {
                deepseekStatusElement.textContent = '❌ 未配置';
                deepseekStatusElement.style.background = '#f8d7da';
                deepseekStatusElement.style.color = '#721c24';
            }
        }
        
        // 更新说明文字
        const apiNote = document.querySelector('.api-note');
        if (apiNote) {
            const availableServices = [];
            if (hasOpenAIKey) availableServices.push('OpenAI');
            if (hasDeepSeekKey) availableServices.push('DeepSeek');
            
            if (availableServices.length > 0) {
                apiNote.innerHTML = `💡 已配置API密钥：${availableServices.join('、')}，将使用真实的AI模型进行转换`;
            } else {
                apiNote.innerHTML = '💡 未配置API密钥，将使用Hugging Face免费API或规则转换';
            }
        }
    }

    async checkAIStatus() {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        if (!statusDot || !statusText) {
            console.log('状态元素未找到，跳过状态检测');
            return;
        }
        
        // 设置超时时间（5秒）
        const timeout = 5000;
        
        try {
            // 创建超时Promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('检测超时')), timeout);
            });
            
            // 检测DeepSeek API状态（简化测试）
            const fetchPromise = fetch("https://api.deepseek.com/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer sk-90cc4f72fd2c43f291843b2f46d64611',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {"role": "user", "content": "测试"}
                    ],
                    max_tokens: 5
                })
            });
            
            // 竞争超时和API调用
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            
            if (response.ok) {
                statusDot.className = 'status-dot online';
                statusText.textContent = 'DeepSeek AI服务正常';
                statusText.style.color = '#10b981';
                console.log('DeepSeek API状态检测成功');
            } else {
                statusDot.className = 'status-dot offline';
                statusText.textContent = 'DeepSeek服务暂时不可用';
                statusText.style.color = '#ef4444';
                console.log('DeepSeek API状态检测失败:', response.status);
            }
        } catch (error) {
            console.error('DeepSeek API状态检测错误:', error);
            statusDot.className = 'status-dot offline';
            
            if (error.message === '检测超时') {
                statusText.textContent = 'DeepSeek服务检测超时';
            } else {
                statusText.textContent = 'DeepSeek服务连接失败';
            }
            statusText.style.color = '#ef4444';
        }
    }

    async checkHuggingFaceStatus() {
        const hfStatusElement = document.getElementById('hfStatus');
        if (!hfStatusElement) return;

        try {
            // 尝试调用Hugging Face API来检测状态
            const response = await fetch("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: "测试",
                    parameters: {
                        max_new_tokens: 10
                    }
                })
            });

            if (response.ok) {
                hfStatusElement.textContent = '✅ 可用';
                hfStatusElement.style.background = '#d4edda';
                hfStatusElement.style.color = '#155724';
            } else {
                hfStatusElement.textContent = '❌ 不可用';
                hfStatusElement.style.background = '#f8d7da';
                hfStatusElement.style.color = '#721c24';
            }
        } catch (error) {
            hfStatusElement.textContent = '❌ 不可用';
            hfStatusElement.style.background = '#f8d7da';
            hfStatusElement.style.color = '#721c24';
        }
    }

    applyConversionRules(inputText) {
        let result = inputText;
        
        // 规则1: 将负面词汇替换为正面词汇
        const negativeToPositive = {
            '不对': '需要微调',
            '错误': '需要优化',
            '问题': '需要关注',
            '失败': '需要调整',
            '但是': '同时',
            '不行': '需要改进',
            '不能': '需要调整',
            '不可以': '需要优化'
        };
        
        Object.entries(negativeToPositive).forEach(([negative, positive]) => {
            result = result.replace(new RegExp(negative, 'g'), positive);
        });

        // 规则2: 添加敬语和礼貌用语
        if (!result.includes('您') && !result.includes('请')) {
            if (result.startsWith('这个') || result.startsWith('那个')) {
                result = result.replace(/^(这个|那个)/, '关于这个');
            }
            result = '您好，' + result;
        }

        // 规则3: 添加舒缓语气词
        if (!result.includes('哦') && !result.includes('呢') && !result.includes('哈')) {
            if (result.endsWith('。')) {
                result = result.replace(/。$/, '哦。');
            } else if (result.endsWith('！')) {
                result = result.replace(/！$/, '呢！');
            } else {
                result += '哦';
            }
        }

        // 规则4: 主动提供帮助
        if (!result.includes('随时') && !result.includes('协助') && !result.includes('帮助')) {
            result += '，如果还有任何需要，我随时可以为您提供协助。';
        }

        // 规则5: 优化句子结构
        result = result.replace(/^([^，。！？]+)([，。！？])/, (match, p1, p2) => {
            if (p1.length > 15) {
                return p1.substring(0, 15) + '，' + p1.substring(15) + p2;
            }
            return match;
        });

        return result;
    }

    setLoadingState(isLoading) {
        this.convertBtn.disabled = isLoading;
        if (isLoading) {
            this.btnText.style.display = 'none';
            this.btnLoading.style.display = 'flex';
        } else {
            this.btnText.style.display = 'inline';
            this.btnLoading.style.display = 'none';
        }
    }

    showResult(text) {
        const outputContent = document.getElementById('outputContent');
        const copyBtn = document.getElementById('copyBtn');
        
        // 显示转换结果
        outputContent.innerHTML = `<div class="converted-text">${text}</div>`;
        
        // 显示复制按钮
        copyBtn.style.display = 'inline-block';
        
        // 清除之前的错误状态
        this.userInput.classList.remove('error');
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    showErrorWithRetry(message, retryCallback) {
        const outputContent = document.getElementById('outputContent');
        const copyBtn = document.getElementById('copyBtn');
        
        // 显示错误信息和重试按钮
        outputContent.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <div class="error-text">${message}</div>
                <div class="error-suggestion">AI服务可能暂时不可用，请稍后重试</div>
                <button class="retry-btn" onclick="document.querySelector('.retry-btn').click()">🔄 重试</button>
            </div>
        `;
        
        // 绑定重试按钮事件
        const retryBtn = outputContent.querySelector('.retry-btn');
        retryBtn.addEventListener('click', retryCallback);
        
        // 隐藏复制按钮
        copyBtn.style.display = 'none';
        
        // 清除之前的错误状态
        this.userInput.classList.remove('error');
    }

    showError(message) {
        this.showErrorWithRetry(message, () => this.convertText());
    }

    async copyResult() {
        const textToCopy = this.resultContent.textContent;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            this.showCopySuccess();
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动选择文本复制');
        }
    }

    showCopySuccess() {
        this.copyBtn.textContent = '已复制！';
        this.copyBtn.classList.add('copy-success');
        
        setTimeout(() => {
            this.copyBtn.textContent = '复制文案';
            this.copyBtn.classList.remove('copy-success');
        }, 2000);
    }

    // 统计相关方法
    initializeStats() {
        // 从localStorage加载统计
        const savedStats = localStorage.getItem('beastword_stats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        }
        
        // 增加访问次数
        this.stats.totalVisits++;
        
        // 更新在线用户数
        this.updateOnlineStatus(true);
        
        // 保存并显示统计
        this.saveStats();
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        const totalVisitsEl = document.getElementById('totalVisits');
        const onlineUsersEl = document.getElementById('onlineUsers');
        const tokenUsageEl = document.getElementById('tokenUsage');
        
        if (totalVisitsEl) totalVisitsEl.textContent = this.stats.totalVisits.toLocaleString();
        if (onlineUsersEl) onlineUsersEl.textContent = this.stats.onlineUsers;
        if (tokenUsageEl) tokenUsageEl.textContent = this.stats.tokenUsage.toLocaleString();
    }

    updateOnlineStatus(isOnline = true) {
        const sessionId = this.getSessionId();
        const now = Date.now();
        
        if (isOnline) {
            // 标记用户在线
            localStorage.setItem(`online_${sessionId}`, now.toString());
        } else {
            // 标记用户离线
            localStorage.removeItem(`online_${sessionId}`);
        }
        
        // 计算在线用户数（5分钟内有活动的用户）
        this.calculateOnlineUsers();
        this.updateStatsDisplay();
    }

    calculateOnlineUsers() {
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        let onlineCount = 0;
        
        // 遍历所有在线标记
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('online_')) {
                const timestamp = parseInt(localStorage.getItem(key));
                if (now - timestamp < fiveMinutes) {
                    onlineCount++;
                } else {
                    // 清理过期的在线标记
                    localStorage.removeItem(key);
                }
            }
        }
        
        this.stats.onlineUsers = onlineCount;
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('beastword_session');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('beastword_session', sessionId);
        }
        return sessionId;
    }

    updateTokenUsage(inputTokens, outputTokens) {
        this.stats.tokenUsage += (inputTokens + outputTokens);
        this.saveStats();
        this.updateStatsDisplay();
    }

    saveStats() {
        localStorage.setItem('beastword_stats', JSON.stringify(this.stats));
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ServiceTextConverter();
    
    // 添加一些交互提示
    console.log('💡 提示：按 Ctrl+Enter 可以快速转换文案');
    
    // 添加输入框焦点效果
    const userInput = document.getElementById('userInput');
    userInput.addEventListener('focus', () => {
        userInput.parentNode.style.transform = 'scale(1.02)';
        userInput.parentNode.style.transition = 'transform 0.2s ease';
    });
    
    userInput.addEventListener('blur', () => {
        userInput.parentNode.style.transform = 'scale(1)';
    });
});
