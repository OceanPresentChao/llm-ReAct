import { OpenAI } from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources'
import type { promptInputs } from './type'

interface AzureLLMParams {
  apiKey: string
  modelName: string
  model?: OpenAI
}

export class AzureLLM {
  private _model: OpenAI
  private _modelName: string
  constructor(options: AzureLLMParams) {
    const { apiKey, model, modelName } = options
    this._modelName = modelName
    this._model = model || new OpenAI({
      apiKey,
      baseURL: 'https://search.bytedance.net/gpt/openapi/online/v2/crawl/openai/deployments',
      defaultQuery: { 'api-version': '2023-03-15-preview' },
      defaultHeaders: { 'api-key': apiKey },
    })
  }

  get modelName() {
    return this._modelName
  }

  async complete(messages: ChatCompletionMessageParam[], stop?: string[]) {
    const result = await this._model.chat.completions.create({
      model: this.modelName,
      temperature: 0,
      messages,
      stop,
    })
    return result
  }

  async completeWithPrompt(prompt: string, inputs: promptInputs, stop?: string[]) {
    const _prompt = fillPromptTemplate(prompt, inputs)
    console.log('prompt', _prompt)
    return this.complete([{ role: 'user', content: _prompt }], stop)
  }
}

export function fillPromptTemplate(promptTemplate: string, inputs: promptInputs) {
  let res = promptTemplate

  for (const [key, val] of Object.entries(inputs))
    res = res.replaceAll(new RegExp(`{\\s*${key}\\s*}`, 'g'), val)

  return res
}
