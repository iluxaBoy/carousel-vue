import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PicsumImage } from '@/types/imgTypes'

export const useImagesStore = defineStore('images', () => {
  const images = ref<PicsumImage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchImages = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`https://picsum.photos/v2/list`) 

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PicsumImage[] = await response.json()
      images.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch images'
      console.error('Error fetching images:', err)
    } finally {
      loading.value = false
    }
  }

  const getImageById = (id: string) => {
    return images.value.find((image) => image.id === id)
  }

  return {
    images,
    loading,
    error,
    fetchImages,
    getImageById,
  }
})
