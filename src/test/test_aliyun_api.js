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
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log(`${response.data.output.text}`);
        } else {
            console.log(`request_id=${response.headers['request_id']}`);
            console.log(`code=${response.status}`);
            console.log(`message=${response.data.message}`);
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