import { ref, onMounted } from 'vue'

export function useLazyLoad(loadFn, delay = 0) {
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  const load = async () => {
    if (isLoaded.value || isLoading.value) return
    
    isLoading.value = true
    error.value = null
    
    try {
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      await loadFn()
      isLoaded.value = true
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoaded,
    isLoading,
    error,
    load
  }
}

export function useIntersectionObserver(callback, options = {}) {
  const target = ref(null)
  const isIntersecting = ref(false)

  onMounted(() => {
    if (!target.value) return

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting.value = entry.isIntersecting
      if (entry.isIntersecting) {
        callback()
      }
    }, {
      threshold: 0.1,
      ...options
    })

    observer.observe(target.value)

    return () => observer.disconnect()
  })

  return {
    target,
    isIntersecting
  }
}