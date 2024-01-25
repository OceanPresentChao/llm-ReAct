import type { AzureLLM } from './llm'
import type { StructuredTool } from './tool'
import type { AgentAction, AgentFinish, AgentStep, promptInputs } from './type'

interface LLMSingleActionAgentParams {
  llm: AzureLLM
  tools?: StructuredTool[]
  stop?: string[]
}

export class LLMSingleActionAgent {
  llm: AzureLLM
  tools: StructuredTool[]
  stop: string[]
  private _prompt: string = '{input}'
  constructor({ llm, tools = [], stop = [] }: LLMSingleActionAgentParams) {
    this.llm = llm
    this.tools = tools
    if (stop.length > 4)
      throw new Error('up to 4 stop sequences')
    this.stop = stop
  }

  get agentActionType(): string {
    return 'single'
  }

  get prompt() {
    return this._prompt
  }

  setPrompt(prompt: string) {
    this._prompt = prompt
  }

  /**
   * Prefix to append the observation with.
   */
  get observationPrefix(): string {
    return 'Observation: '
  }

  addTool(tools: StructuredTool | StructuredTool[]) {
    const _tools = Array.isArray(tools) ? tools : [tools]
    this.tools.push(..._tools)
  }

  addStop(stop: string | string[]) {
    const _stops = Array.isArray(stop) ? stop : [stop]
    this.stop.push(..._stops)
  }

  async plan(steps: AgentStep[], inputs: promptInputs): Promise<AgentAction | AgentFinish> {
    const thoughts = this.constructScratchPad(steps)
    const tools = this.constructTools()
    const toolNames = this.constructToolNames()
    const newInputs = {
      ...inputs,
      tools,
      tool_names: toolNames,
      agent_scratchpad: thoughts,
    }
    const output = await this.llm.completeWithPrompt(this._prompt, newInputs, this.stop)

    return this.transOutput2Action(output.choices[0].message.content!)
  }

  transOutput2Action(text: string): AgentAction | AgentFinish {
    const FINAL_ANSWER_ACTION = 'Final Answer:'
    const includesAnswer = text.includes(FINAL_ANSWER_ACTION)
    const regex
      = /Action\s*\d*\s*:[\s]*(.*?)[\s]*Action\s*\d*\s*Input\s*\d*\s*:[\s]*(.*)/
    const actionMatch = text.match(regex)
    if (actionMatch) {
      const action = actionMatch[1]
      const actionInput = actionMatch[2]
      const toolInput = actionInput.trim().replace(/"/g, '')

      return {
        tool: action,
        toolInput,
        log: text,
      }
    }
    if (includesAnswer) {
      const finalAnswerText = text.split(FINAL_ANSWER_ACTION)[1].trim()
      return {
        returnValues: {
          output: finalAnswerText,
        },
        log: text,
      }
    }

    throw new Error(`Could not parse LLM output: ${text}`)
  }

  /**
   * Construct a scratchpad to let the agent continue its thought process
   */
  constructScratchPad(
    steps: AgentStep[],
  ): string | string[] {
    return steps.reduce(
      (thoughts, { action, observation }) =>
        thoughts
          + [
            action.log,
            `${this.observationPrefix}${observation}`
          ].join('\n'),
      '',
    )
  }

  /**
   * Construct tools description for prompt template
   */
  constructTools(): string {
    return this.tools.reduce((pre, cur, idx) => `${pre}${idx + 1}. ${cur.getSchema()}\n`, '')
  }

  constructToolNames(): string {
    return this.tools.map(val => val.name).join(',')
  }
}
