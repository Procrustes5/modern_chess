<template>
  <div class="screen-wrapper">
    <div class="playground">
      <div class="nav-bar">
        <span class="title">Play Chess!</span>
        <div class="turn-notify">
          <span>Turn : Black</span>
        </div>
      </div>
      <div class="chessboard">
        <div
          v-for="(item, index) in chessboard"
          :key="index"
          class="square"
          :class="{
            whiteSquare:
              (parseInt(index / 8) % 2 === 0 && index % 2 === 0) ||
              (parseInt(index / 8) % 2 === 1 && index % 2 === 1),
            choice: presentIndex === index
          }"
        >
          <div class="piece" :class="`${item.color}`" @click="handlePiece(item, index)">
            {{ item.piece.code }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'

const VITE_CHATGPT_TOKEN = import.meta.env.VITE_CHATGPT_TOKEN || 'any-default-local-build_env'
const topic = ref('')
const joke = ref()
const isLoading = ref(false)

const chessboard = ref([])
const isBlack = ref(true)
const presentIndex = ref()
const presentSquare = ref([])
const turnCount = ref(0)
const turnColor = ref('b')
const teamColor = computed(() => {
  const myColor = isBlack.value ? 'b' : 'w'
  const oppoColor = isBlack.value ? 'w' : 'b'
  return { myColor, oppoColor }
})

const file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const rank = [1, 2, 3, 4, 5, 6, 7, 8]
const piece = [
  { code: 'k', name: 'King' },
  { code: 'q', name: 'Queen' },
  { code: 'r', name: 'Rook' },
  { code: 'b', name: 'Bishop' },
  { code: 'n', name: 'Knight' },
  { code: 'p', name: 'Pawn' },
  { code: '', name: 'none' }
]

const createChessboard = () => {
  for (let j = rank.length; j > 0; j--) {
    for (let i = 0; i < file.length; i++) {
      chessboard.value.push({
        file: i,
        rank: j - 1,
        piece: piece[6],
        color: null
      })
    }
  }
};

const initGame = () => {
  const initSquare = [
    // King
    { file: 4, rank: 7, piece: piece[0], color: teamColor.value.oppoColor },
    { file: 3, rank: 0, piece: piece[0], color: teamColor.value.myColor },
    // Queen
    { file: 3, rank: 7, piece: piece[1], color: teamColor.value.oppoColor },
    { file: 4, rank: 0, piece: piece[1], color: teamColor.value.myColor },
    // Rook
    { file: 0, rank: 7, piece: piece[2], color: teamColor.value.oppoColor },
    { file: 0, rank: 0, piece: piece[2], color: teamColor.value.myColor },
    { file: 7, rank: 7, piece: piece[2], color: teamColor.value.oppoColor },
    { file: 7, rank: 0, piece: piece[2], color: teamColor.value.myColor },
    // Bishop
    { file: 2, rank: 7, piece: piece[3], color: teamColor.value.oppoColor },
    { file: 2, rank: 0, piece: piece[3], color: teamColor.value.myColor },
    { file: 5, rank: 7, piece: piece[3], color: teamColor.value.oppoColor },
    { file: 5, rank: 0, piece: piece[3], color: teamColor.value.myColor },
    // Knight
    { file: 1, rank: 7, piece: piece[4], color: teamColor.value.oppoColor },
    { file: 1, rank: 0, piece: piece[4], color: teamColor.value.myColor },
    { file: 6, rank: 7, piece: piece[4], color: teamColor.value.oppoColor },
    { file: 6, rank: 0, piece: piece[4], color: teamColor.value.myColor },
    // Opponent Pawn 
    { file: 0, rank: 6, piece: piece[5], color: teamColor.value.oppoColor },
    { file: 1, rank: 6, piece: piece[5], color: teamColor.value.oppoColor },
    { file: 2, rank: 6, piece: piece[5], color: teamColor.value.oppoColor },
    { file: 3, rank: 6, piece: piece[5], color: teamColor.value.oppoColor },
    { file: 4, rank: 6, piece: piece[5], color: teamColor.value.oppoColor },
    { file: 5, rank: 6, piece: piece[5], color: teamColor.value.oppoColor },
    { file: 6, rank: 6, piece: piece[5], color: teamColor.value.oppoColor },
    { file: 7, rank: 6, piece: piece[5], color: teamColor.value.oppoColor },
    // My Pawn 
    { file: 0, rank: 1, piece: piece[5], color: teamColor.value.myColor },
    { file: 1, rank: 1, piece: piece[5], color: teamColor.value.myColor },
    { file: 2, rank: 1, piece: piece[5], color: teamColor.value.myColor },
    { file: 3, rank: 1, piece: piece[5], color: teamColor.value.myColor },
    { file: 4, rank: 1, piece: piece[5], color: teamColor.value.myColor },
    { file: 5, rank: 1, piece: piece[5], color: teamColor.value.myColor },
    { file: 6, rank: 1, piece: piece[5], color: teamColor.value.myColor },
    { file: 7, rank: 1, piece: piece[5], color: teamColor.value.myColor }
  ]
  initSquare.forEach((init) => {
    const index = chessboard.value.findIndex((item) => {
      return item.file === init.file && item.rank === init.rank
    });
    chessboard.value[index] = init;
  })
}

const handlePiece = (item, index) => {
  if (turnCount.value === 0) {
    presentIndex.value = index;
    presentSquare.value.push(item);
    turnCount.value ++;
  } else if (turnCount.value === 1) {
    if (item !== presentSquare.value[0]) {
      chessboard.value[index] = presentSquare.value[0];
      chessboard.value[presentIndex.value] = { file: presentIndex.value.file, rank: presentIndex.value.rank, piece: piece[6], color: null }
    }
    presentIndex.value = null;
    presentSquare.value = [];
    turnCount.value = 0;
    turnColor.value = turnColor.value === 'w' ? 'b' : 'w';
  }
}

onMounted(() => {
  createChessboard();
  initGame();
});
</script>

<style scoped lang="scss">
.screen-wrapper {
  width: 100vw;
  height: 100vh;
  .playground {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .nav-bar {
      width: 200px;
      height: 100%;
    }
    .chessboard {
      width: 600px;
      height: 600px;
      display: grid;
      grid-template: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr / 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      .square {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #cf9052;
        .piece {
          width: 80%;
          height: 80%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }
        .w, .b {
          box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
        }
        .w {
          background: white;
          color: black;
        }
        .b {
          background: black;
        }
      }
      .whiteSquare {
        background: #ffd0a1;
      }
      .choice {
        border: 2px solid blueviolet;
      }
    }
  }
}
</style>
