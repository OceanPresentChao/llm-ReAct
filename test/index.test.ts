import { describe, expect, it } from 'vitest'
import { AzureLLM, fillPromptTemplate } from '@/llm'
import { LLMSingleActionAgent } from '@/agent'
import { AgentExecutor } from '@/executor'
import { AdditionTool, DivisionTool, MultiplicationTool, SubtractionTool } from '@/toolkit'
import { REACT_PROMPT } from '@/prompt'
import { Config } from '@/index'

describe('llm', () => {
  const llm = new AzureLLM({
    apiKey: Config.apiKey,
    modelName: Config.model,
  })
  const agent = new LLMSingleActionAgent({ llm })
  agent.setPrompt(REACT_PROMPT)

  it('prompt gen', () => {
    expect(agent.constructScratchPad([{
      action: {
        tool: 'get_word_length',
        toolInput: 'educa',
        log: 'How many letters in the word educa',
      },
      observation: '4',
    }])).toMatchInlineSnapshot(`
      "
      How many letters in the word educaObservation: 4
      "
    `)
  })

  it('trans Action', async () => {
    expect(agent.transOutput2Action('Action: Multi Tools Action Input: educa 123')).toMatchInlineSnapshot(`
      {
        "log": "Action: Multi Tools Action Input: educa 123",
        "tool": "Multi Tools",
        "toolInput": "educa 123",
      }
    `)
    expect(agent.transOutput2Action('Final Answer: The word "educa" has 5 letters.')).toMatchInlineSnapshot(`
      {
        "log": "Final Answer: The word "educa" has 5 letters.",
        "returnValues": {
          "output": "The word "educa" has 5 letters.",
        },
      }
    `)
  })
})

describe('utils', () => {
  it('prompt template', () => {
    expect(fillPromptTemplate('wqeqwe{llm}qweqwe', { llm: '123', qwe: '456', input: 'test' })).toMatchInlineSnapshot(`"wqeqwe123qweqwe"`)
  })
})

describe('agent', () => {
  const llm = new AzureLLM({
    apiKey: Config.apiKey,
    modelName: Config.model,
  })
  const agent = new LLMSingleActionAgent({ llm })
  agent.setPrompt(REACT_PROMPT)
  agent.addStop(agent.observationPrefix)

  const executor = new AgentExecutor(agent)
  executor.addTool([new AdditionTool(), new SubtractionTool(), new DivisionTool(), new MultiplicationTool()])

  it('executor prompt', () => {
    expect(executor.constructTools()).toMatchInlineSnapshot(`
    "1. Addition | A tool for adding numbers | a: number, b: number
    2. Subtraction | A tool for subtracting numbers | a: number, b: number
    3. Division | A tool for dividing numbers | a: number, b: number
    4. Multiplication | A tool for multiplying numbers | a: number, b: number
    "
  `)

    expect(executor.constructToolNames()).toMatchInlineSnapshot(`"Addition,Subtraction,Division,Multiplication"`)
  })

  it('demo', async () => {
    const res = await executor.call({ input: '一种减速机的价格是750元，一家企业需要购买12台减速机。每台减速机运行一小时的电费是0.5元，企业每天运行这些减速机8小时。请计算企业购买及一周运行这些减速机的总花费。' })
    expect(res).toMatchInlineSnapshot()
  }, { timeout: 500000 })
})
