import type { LLMSingleActionAgent } from './agent'
import type { StructuredTool } from './tool'
import type { AgentAction, AgentFinish, AgentStep, promptInputs } from './type'

interface AgentExecutorOptions {
  callback?: {
    nextPlan?: (plan: string, iteration: number) => void
  }
}
export class AgentExecutor {
  agent: LLMSingleActionAgent
  tools: StructuredTool[] = []
  maxIterations: number = 15

  constructor(agent: LLMSingleActionAgent) {
    this.agent = agent
  }

  addTool(tools: StructuredTool | StructuredTool[]) {
    const _tools = Array.isArray(tools) ? tools : [tools]
    this.tools.push(..._tools)
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

  private shouldContinue(iterations: number): boolean {
    return iterations < this.maxIterations
  }

  async call(inputs: promptInputs, options?: AgentExecutorOptions): Promise<AgentFinish> {
    return new Promise((resolve) => {
      const { callback } = options || {}
      const toolsByName = Object.fromEntries(
        this.tools.map(t => [t.name, t]),
      )

      const steps: AgentStep[] = []
      let iterations = 0

      const oneStep = async () => {
        if (this.shouldContinue(iterations)) {
          iterations++

          const tools = this.constructTools()
          const toolNames = this.constructToolNames()
          const output = await this.agent.plan(steps, {
            tools,
            tool_names: toolNames,
            ...inputs,
          })

          callback?.nextPlan && callback.nextPlan(output.log, iterations)

          // Check if the agent has finished
          if ('returnValues' in output) {
            resolve(output)
            return
          }

          const actions = Array.isArray(output)
            ? output as AgentAction[]
            : [output as AgentAction]

          const newSteps = await Promise.all(
            actions.map(async (action) => {
              const tool = toolsByName[action.tool]

              if (!tool)
                throw new Error(`${action.tool} is not a valid tool, try another one.`)

              const observation = await tool.call(action.toolInput)

              return { action, observation: observation ?? '' }
            }),
          )

          steps.push(...newSteps)

          setTimeout(oneStep, 3000)
        }
        else {
          resolve({
            returnValues: { output: 'Agent stopped due to max iterations.' },
            log: '',
          })
        }
      }

      setTimeout(oneStep, 0)
    })
  }
}
