import { ref } from 'vue'

interface Apple {
  name: string
}

export const apples = ref<Apple[]>([])

export function addApple(name: string) {
  apples.value.push({ name })
}

export function removeApple(name: string) {
  const idx = apples.value.findIndex(v => v.name === name)
  apples.value.splice(idx, 1)
}
