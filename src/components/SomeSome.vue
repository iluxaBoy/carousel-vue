<script setup lang="ts">
import type { PicsumImage } from '@/types/imgTypes'
import { ref, onMounted, type CSSProperties } from 'vue'

const props = defineProps<{
  imagesStore: PicsumImage[]
}>()

const cards = ref<PicsumImage[]>(props.imagesStore)
const innerStyles = ref<CSSProperties>({})
const selectedImg = ref<PicsumImage[]>([])
const step = ref<string>('')
const transitioning = ref<boolean>(false)
const inner = ref<HTMLDivElement>()

const setStep = () => {
  if (inner.value) {
    const innerWidth = inner.value.scrollWidth
    const totalCards = cards.value.length
    step.value = `${innerWidth / totalCards}px`
  }
}

const moveLeft = () => {
  innerStyles.value = {
    transform: `translateX(-${step.value}) translateX(-${step.value})`,
  }
}

const moveRight = () => {
  innerStyles.value = {
    transform: `translateX(${step.value}) translateX(-${step.value})`,
  }
}

const afterTransition = (callback: () => void) => {
  if (inner.value) {
    const listener = () => {
      callback()
      inner.value?.removeEventListener('transitionend', listener)
    }
    inner.value.addEventListener('transitionend', listener)
  }
}

const resetTranslate = () => {
  innerStyles.value = {
    transition: 'none',
    transform: `translateX(-${step.value})`,
  }
}

const next = () => {
  if (transitioning.value) return
  transitioning.value = true

  moveLeft()

  afterTransition(() => {
    const card = cards.value.shift()
    if (card) {
      cards.value.push(card)
    }

    resetTranslate()
    transitioning.value = false
  })
}

const prev = () => {
  if (transitioning.value) return
  transitioning.value = true

  moveRight()

  afterTransition(() => {
    const card = cards.value.pop()
    if (card) {
      cards.value.unshift(card)
    }
    resetTranslate()
    transitioning.value = false
  })
}

const getImg = (card: PicsumImage) => selectedImg.value.push(card)

onMounted(() => {
  setStep()
  resetTranslate()
})
</script>

<template>
  <div class="carousel-container">
    <div class="carousel">
      <div class="inner" ref="inner" :style="innerStyles">
        <div class="card" v-for="card in cards" :key="card.id" @click="getImg(card)">
          <img :src="card.download_url" alt="img" />
        </div>
      </div>
      <button class="btn prev" @click="prev"></button>
      <button class="btn next" @click="next"></button>
    </div>

    <div class="selected-img">
      <ul>
        <li v-for="img in selectedImg" :key="img.id">
          <img :src="img.download_url" alt="" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel {
  position: relative;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  width: 100vw;
  height: 400px;

  .inner {
    transition: transform 0.5s;
    white-space: nowrap;
    scroll-snap-type: x mandatory;

    .card {
      margin: 0 30px;
      display: inline-flex;
      color: white;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s;
      cursor: pointer;

      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

img {
  width: 640px;
  height: 370px;
}

.selected-img {
  margin: 20px;

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, 200px);
    gap: 20px;
    justify-content: center;

    li {
      list-style: none;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
  }
}

.btn {
  position: absolute;
  width: 100px;
  height: 50px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #34495e;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #2c3e50;
}

.btn.prev {
  left: 20px;
  &::after {
    content: '<';
  }
}

.btn.next {
  right: 20px;
  &::after {
    content: '>';
  }
}

@media (max-width: 1320px) {
  .carousel {
    margin-top: 100px;
    .inner{
      width: 100%;
    }
  }

  img {
    width: 400px;
    height: 240px;
  }
}

@media (max-width: 650px) {
  .carousel {
    margin-top: 80px;
    .inner {

      .card {
        margin: 0 94px;
      }
    }
  }

  img {
    width: 300px;
    height: 240px;
  }
}

@media (max-width: 420px) {
  .carousel {
    margin-top: 60px;
  }
}
</style>
