<script setup lang="ts">
import CarouselComponent from '@/components/CarouselComponent.vue'

import { useImagesStore } from '@/store/images'
import { onMounted } from 'vue'

const imagesStore = useImagesStore()

onMounted(async () => {
  await imagesStore.fetchImages()
})
</script>

<template>
  <div v-if="!imagesStore.loading">
    <CarouselComponent :imagesStore="imagesStore.images" />
  </div>
</template>
