export abstract class StructuredTool<T extends Record<string, any> = Record<string, any>> {
  name: string
  description: string
  constructor(name: string, description: string) {
    this.name = name
    this.description = description
  }

  abstract run(inputs: T): Promise<string>

  call(input: string): Promise<string> {
    try {
      const inputs = JSON.parse(input)
      return this.run(inputs)
    }
    catch (e) {
      throw new Error(`${input} can not be parsed as JSON`)
    }
  }

  getSchema(): string {
    return `${this.name} | ${this.description} | ${this.declaration}`
  }

  abstract get declaration(): string
}
