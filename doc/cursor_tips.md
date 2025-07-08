# cursor使用
- 由于cursor对模型限制上下文长度（如Gemini2.5Pro有1M token，会被cursor限制成120k），一次写过多的代码容易出问题，一次不要做比较少的改动
- 在做功能之前，先让cursor列出TODO计划
- 如果一个功能或者bug，cursor执行5次对话都做不好，请考虑重新开始
- 做一个功能需一步步实现，减少由于cursor上下文短导致一次性完不成复杂任务的情况，步骤如下：
    - 编写需求，如ai_req.md
    - 实现命令行的关键特性测试脚本，如test_ai.ts
    - 实现测试简单的svg页面，确认后结合测试脚本做出测试页面,如test_ai_page.ts
    - 使用虚拟数据做出页面，test_ai_chat_ui
    - 根据测试页面，和虚拟数据的页面做出符合项目的页面功能

# 插件
- Markdown Preview Enhanced预览 https://blog.csdn.net/weixin_41192489/article/details/142565467