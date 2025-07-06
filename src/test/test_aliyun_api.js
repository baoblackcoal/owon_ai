const axios = require('axios');
const path = require('path');

// 从 src/.env.development.local 获取配置
require('dotenv').config({ path: path.resolve(__dirname, '../.env.development.local') });

const apiKey = process.env.DASHSCOPE_API_KEY;
const appId = process.env.DASHSCOPE_APP_ID;

if (!apiKey || !appId) {
    console.error('请确保已在 src/.env.development.local 中设置环境变量 DASHSCOPE_API_KEY 和 DASHSCOPE_APPP_ID');
    process.exit(1);
}

const pipeline_ids1 = 'he9rcpebc3'
const pipeline_ids2 = 'utmhvnxgey'


async function callDashScope() {
    const url = `https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`;

    const data = {
        input: {
            prompt: "ADS800A的带宽是多少？"
        },
        parameters: {
            'incremental_output' : 'true',
            'has_thoughts':'true',//工作流应用和智能体编排应用实现流式输出需要设置此参数
            rag_options:{
                pipeline_ids:[pipeline_ids1,pipeline_ids2]  // 替换为指定的知识库ID，多个请用逗号隔开
            }
        },
        debug: {}
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'X-DashScope-SSE': 'enable'
            },
            responseType: 'stream' // 用于处理流式响应

        });

        if (response.status === 200) {
            console.log("Request successful:");

            // 处理流式响应
            response.data.on('data', (chunk) => {
                console.log(`Received chunk: ${chunk.toString()}`);
            });

            response.data.on('end', () => {
                console.log("Stream ended.");
            });

            response.data.on('error', (error) => {
                console.error(`Stream error: ${error.message}`);
            });
        } else {
            console.log("Request failed:");
            if (response.data.request_id) {
                console.log(`request_id=${response.data.request_id}`);
            }
            console.log(`code=${response.status}`);
            if (response.data.message) {
                console.log(`message=${response.data.message}`);
            } else {
                console.log('message=Unknown error');
            }
        }
    } catch (error) {
        console.error(`Error calling DashScope: ${error.message}`);
        if (error.response) {
            console.error(`Response status: ${error.response.status}`);
            console.error(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
        }
    }

}

callDashScope();