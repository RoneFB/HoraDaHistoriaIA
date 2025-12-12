const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
    constructor() {
        // Lazy initialization
        this._openai = null;
        this._genAI = null;
        this._deepseek = null;
    }

    get openai() {
        if (!this._openai) {
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OPENAI_API_KEY is missing in environment variables');
            }
            this._openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        }
        return this._openai;
    }

    get genAI() {
        if (!this._genAI) {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error('GEMINI_API_KEY is missing in environment variables');
            }
            this._genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        }
        return this._genAI;
    }

    get deepseek() {
        if (!this._deepseek) {
            if (!process.env.DEEPSEEK_API_KEY) {
                throw new Error('DEEPSEEK_API_KEY is missing in environment variables');
            }
            this._deepseek = new OpenAI({
                apiKey: process.env.DEEPSEEK_API_KEY,
                baseURL: 'https://api.deepseek.com'
            });
        }
        return this._deepseek;
    }

    async generateStory(prompt, serviceType, params) {
        const { language = 'pt-BR' } = params;

        if (process.env.USE_MOCK_AI === 'true') {
            const langCode = language.startsWith('pt') ? 'pt' : 'en';
            const mockStories = require(`../data/mockStories.${langCode}.json`);
            const randomStory = mockStories[Math.floor(Math.random() * mockStories.length)];
            return randomStory;
        }

        const finalPrompt = this.constructPrompt(prompt, params);
        
        if (serviceType === 'openai') {
            return this.generateOpenAI(finalPrompt);
        } else if (serviceType === 'gemini') {
            return this.generateGemini(finalPrompt);
        } else if (serviceType === 'deepseek') {
            return this.generateDeepSeek(finalPrompt);
        } else {
            throw new Error('Invalid service type');
        }
    }

    constructPrompt(basePrompt, { age, theme, category, language }) {
        const langInstruction = language ? `Write the story in ${language}.` : 'Write the story in Portuguese (Brazil).';

        return `Create a children's story.
    Target Age Group: ${age}
    Category: ${category}
    Theme: ${theme}
    Language: ${language || 'pt-BR'}
    
    Instructions:
    ${basePrompt || 'Write a fun and engaging story based on the parameters.'}
    
    ${langInstruction}
    The story should be suitable for the age group, have a clear moral or lesson if applicable, and be engaging. Formatting: Use Markdown.`;
    }

    async generateOpenAI(prompt) {
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: "system", content: "You are a helpful assistant that writes children's stories." }, { role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("OpenAI Error:", error);
            throw new Error(`Failed to generate story with OpenAI: ${error.message}`);
        }
    }

    async generateDeepSeek(prompt) {
        try {
            const completion = await this.deepseek.chat.completions.create({
                messages: [{ role: "system", content: "You are a helpful assistant that writes children's stories." }, { role: "user", content: prompt }],
                model: "deepseek-chat",
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("DeepSeek Error:", error);
            throw new Error(`Failed to generate story with DeepSeek: ${error.message}`);
        }
    }

    async generateGemini(prompt) {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Error:", error);
            throw new Error(`Failed to generate story with Gemini: ${error.message}`);
        }
    }
}

module.exports = new AIService();
