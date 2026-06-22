import { ref } from 'vue'

export function useLastfm<T>(fn: (...args: string[]) => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute(...args: string[]) {
    loading.value = true
    error.value = null
    data.value = null

    try {
      data.value = await fn(...args)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}