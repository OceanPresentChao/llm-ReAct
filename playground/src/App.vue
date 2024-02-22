<script setup lang="ts">
import { OpenAI } from 'openai'
import Config from '../../config.json';
import { AzureLLM } from '@/llm';
import {LLMSingleActionAgent} from '@/agent';
import { REACT_PROMPT } from '@/prompt'
import { AgentExecutor } from '@/executor'
import {RemoveAppleTool,AddAppleTool} from './tools';
import {apples} from './hooks';
import {ref} from 'vue';

const model = new OpenAI({
  apiKey: Config["apiKey"],
  baseURL: 'https://search.bytedance.net/gpt/openapi/online/v2/crawl/openai/deployments',
  defaultQuery: { 'api-version': '2023-03-15-preview' },
  defaultHeaders: { 'api-key': Config["apiKey"], "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Authorization": `Bearer ${Config["apiKey"]}` },
  dangerouslyAllowBrowser: true,
  fetch: (url: RequestInfo, init?: RequestInit) => {
    url = url.toString()
    // 兼容openai-node包的api，将原始路径替换成/api，由vite代理发送请求避免cors
    return fetch(url.replace("https://search.bytedance.net/gpt/openapi/online/v2/crawl/openai/deployments", "/api"), init)
  }
})

const llm = new AzureLLM({
  apiKey: Config.apiKey,
  modelName: Config.model,
  model
})

const agent = new LLMSingleActionAgent({ llm })
agent.setPrompt(REACT_PROMPT)
agent.addStop(agent.observationPrefix)

const executor = new AgentExecutor(agent)
executor.addTool([new RemoveAppleTool(),new AddAppleTool()])

const logs = ref<string[]>([])

function onClick() {
  executor.call({input:'帮我添加名字为hello和word的两个苹果，再删除名字为hello的苹果'},{
    callback:{
      nextPlan(plan:string) {
        logs.value.push(plan)
      }
    }
  })
}


</script>

<template>
  <div>
    <p v-for="v in logs">
      {{ v }}
    </p>
    <div v-for="v in apples">
      <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
      <p>
        {{ v.name }}
      </p>
    </a>
    </div>
    
    <button @click="onClick">帮我添加名字为hello和word的两个苹果，再删除名字为hello的苹果</button>
  </div>
</template>

<style scoped></style>
