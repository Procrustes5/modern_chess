<script setup lang="ts">
import { ref, computed } from 'vue'

const getClass = (row: Number, col: Number) => {
  return (row + col) % 2 === 0 ? 'white' : 'black'
}
</script>
<template>
  <div class="chess-board">
    <div v-for="row in 8" :key="`row-${row}`" class="chess-row">
      <div v-for="col in 8" :key="`col-${col}`" :class="['chess-cell', getClass(row, col)]"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chess-board {
  display: grid;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
}

.chess-row {
  display: contents;
}

.chess-cell {
  width: 50px;
  height: 50px;
}

.white {
  background-color: #fff;
}

.black {
  background-color: #000;
}
</style>
