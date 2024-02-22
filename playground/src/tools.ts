import { addApple, removeApple } from './hooks'
import { StructuredTool } from '@/tool'

interface AppleToolParams {
  name: string
}

export class AddAppleTool extends StructuredTool<AppleToolParams> {
  constructor() {
    super('AddApple', 'Add an apple with name')
  }

  run(inputs: AppleToolParams): Promise<string> {
    addApple(inputs.name)
    return Promise.resolve('ok')
  }

  get declaration(): string {
    return 'name: string'
  }
}

export class RemoveAppleTool extends StructuredTool<AppleToolParams> {
  constructor() {
    super('RemoveApple', 'Remove a specific apple with name')
  }

  run(inputs: AppleToolParams): Promise<string> {
    removeApple(inputs.name)
    return Promise.resolve('ok')
  }

  get declaration(): string {
    return 'name: string'
  }
}
