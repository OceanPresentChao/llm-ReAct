import { StructuredTool } from './tool'

interface MathToolParams {
  a: number
  b: number
}

export class AdditionTool extends StructuredTool<MathToolParams> {
  constructor() {
    super('Addition', 'A tool for adding numbers')
  }

  run(inputs: MathToolParams): Promise<string> {
    return Promise.resolve(String(inputs.a + inputs.b))
  }

  get declaration(): string {
    return 'a: number, b: number'
  }
}

export class SubtractionTool extends StructuredTool<MathToolParams> {
  constructor() {
    super('Subtraction', 'A tool for subtracting numbers')
  }

  run(inputs: MathToolParams): Promise<string> {
    return Promise.resolve(String(inputs.a - inputs.b))
  }

  get declaration(): string {
    return 'a: number, b: number'
  }
}

export class MultiplicationTool extends StructuredTool<MathToolParams> {
  constructor() {
    super('Multiplication', 'A tool for multiplying numbers')
  }

  run(inputs: MathToolParams): Promise<string> {
    return Promise.resolve(String(inputs.a * inputs.b))
  }

  get declaration(): string {
    return 'a: number, b: number'
  }
}

export class DivisionTool extends StructuredTool<MathToolParams> {
  constructor() {
    super('Division', 'A tool for dividing numbers')
  }

  run(inputs: MathToolParams): Promise<string> {
    return Promise.resolve(String(inputs.a / inputs.b))
  }

  get declaration(): string {
    return 'a: number, b: number'
  }
}
