// 加法函数

import { StructuredTool } from './tool'

export class AdditionTool extends StructuredTool {
  constructor() {
    super('Addition Tool', 'A tool for adding numbers')
  }

  async call(arg: string, _config?: Record<string, any>): Promise<string> {
    arg = JSON.parse(arg)
    if (Array.isArray(arg)) {
      let res = 0
      for (let i = 0; i < arg.length; i++) {
        const num = Number.parseFloat(arg[i])
        if (Number.isNaN(num))
          return Promise.reject(new Error('All arguments must be numbers'))
        res = this._call(res, num)
      }

      return Promise.resolve(res.toString())
    }
    else {
      return Promise.reject(new Error('Arguments need to be an array of numbers'))
    }
  }

  _call(a: number, b: number): number {
    return a + b
  }

  get declaration(): string {
    return '(a: number, b: number): number'
  }
}

export class SubtractionTool extends StructuredTool {
  constructor() {
    super('Subtraction Tool', 'A tool for subtracting numbers')
  }

  async call(arg: string, _config?: Record<string, any>): Promise<string> {
    arg = JSON.parse(arg)
    if (Array.isArray(arg)) {
      if (arg.length !== 2)
        return Promise.reject(new Error('Subtract function requires exactly 2 arguments'))

      const a = Number.parseFloat(arg[0])
      const b = Number.parseFloat(arg[1])

      if (Number.isNaN(a) || Number.isNaN(b))
        return Promise.reject(new Error('Arguments must be numbers'))

      return Promise.resolve(this._call(a, b).toString())
    }
    else {
      return Promise.reject(new Error('Arguments need to be an array of two numbers'))
    }
  }

  _call(a: number, b: number): number {
    return a - b
  }

  get declaration(): string {
    return '(a: number, b: number): number'
  }
}

export class MultiplicationTool extends StructuredTool {
  constructor() {
    super('Multiplication Tool', 'A tool for multiplying numbers')
  }

  async call(arg: string, _config?: Record<string, any>): Promise<string> {
    arg = JSON.parse(arg)
    if (Array.isArray(arg)) {
      let res = 1
      for (let i = 0; i < arg.length; i++) {
        const num = Number.parseFloat(arg[i])
        if (Number.isNaN(num))
          return Promise.reject(new Error('All arguments must be numbers'))
        res = this._call(res, num)
      }

      return Promise.resolve(res.toString())
    }
    else {
      return Promise.reject(new Error('Arguments need to be an array of numbers'))
    }
  }

  _call(a: number, b: number): number {
    return a * b
  }

  get declaration(): string {
    return '(a: number, b: number): number'
  }
}

export class DivisionTool extends StructuredTool {
  constructor() {
    super('Division Tool', 'A tool for dividing numbers')
  }

  async call(arg: string, _config?: Record<string, any>): Promise<string> {
    arg = JSON.parse(arg)
    if (Array.isArray(arg)) {
      if (arg.length !== 2)
        return Promise.reject(new Error('Divide function requires exactly 2 arguments'))

      const a = Number.parseFloat(arg[0])
      const b = Number.parseFloat(arg[1])

      if (Number.isNaN(a) || Number.isNaN(b))
        return Promise.reject(new Error('Arguments must be numbers'))

      if (b === 0)
        return Promise.reject(new Error('Cannot divide by zero'))

      return Promise.resolve(this._call(a, b).toString())
    }
    else {
      return Promise.reject(new Error('Arguments need to be an array of two numbers'))
    }
  }

  _call(a: number, b: number): number {
    return a / b
  }

  get declaration(): string {
    return '(a: number, b: number): number'
  }
}
