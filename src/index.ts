import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rawConfig = readFileSync(resolve(__dirname, '../config.json'), { encoding: 'utf8', flag: 'r' })

export const Config = JSON.parse(rawConfig)
