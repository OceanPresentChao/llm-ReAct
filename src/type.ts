export interface AgentAction {
  tool: string
  toolInput: string
  log: string
}

export interface AgentFinish {
  returnValues: Record<string, any>
  log: string
}

export interface AgentStep {
  action: AgentAction
  observation: string
}

export type promptInputs = Record<string, any> & {
  input: string
}
