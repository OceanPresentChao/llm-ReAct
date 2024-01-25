import type { LLMSingleActionAgent } from './agent'
import type { StructuredTool } from './tool'
import type { AgentAction, AgentFinish, AgentStep, promptInputs } from './type'

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

  private shouldContinue(iterations: number): boolean {
    return iterations < this.maxIterations
  }

  async call(input: promptInputs): Promise<AgentFinish> {
    const toolsByName = Object.fromEntries(
      this.tools.map(t => [t.name, t]),
    )

    const steps: AgentStep[] = []
    let iterations = 0

    while (this.shouldContinue(iterations)) {
      const output = await this.agent.plan(steps, input)

      // Check if the agent has finished
      if ('returnValues' in output)
        return output

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

      iterations++
    }
    return {
      returnValues: { output: 'Agent stopped due to max iterations.' },
      log: '',
    }
  }
}
