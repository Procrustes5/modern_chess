<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { initSquare, ja_rule_explanation } from './utils/convert';

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

  initSquare(piece, teamColor).forEach((init) => {
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
  console.log(chessboard.value)
});
</script>
<template>
  <div class="screen-wrapper">
    <div class="playground">
      <div class="nav-bar">
        <span class="title">ハローチェス</span>
        <div class="turn-notify">
          <span>
            {{ `TURN : ${turnColor === 'w' ? 'WHITE': 'BLACK'}` }}
          </span>
        </div>
        <div class="rule-explanation" v-if="chessboard[presentIndex]?.piece.color">
          <span class="rule-book">Rule Book</span>
          <span class="piece-name">
            {{ `名前：${ja_rule_explanation.filter((item) => item.code === chessboard[presentIndex]?.piece.code)[0]?.name}` }}
          </span>
          <span class="piece-explanation">
            {{ `${ja_rule_explanation.filter((item) => item.code === chessboard[presentIndex]?.piece.code)[0]?.content}` }}
          </span>
        </div>
      </div>
      <div class="chessboard-wrapper">
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
          <div class="piece" :class="`${item.color}`, `${item.piece.name}`" @click="handlePiece(item, index)">
            <div v-if="item.piece.code === 'k'" class="piece-detail">
              <span>{{ `&#x265a;`}}</span>
            </div>
            <div v-else-if="item.piece.code === 'q'" class="piece-detail">
              <span>{{ `&#x265b;`}}</span>
            </div>
            <div v-else-if="item.piece.code === 'r'" class="piece-detail">
              <span>{{ `&#x265c;` }}</span>
            </div>
            <div v-else-if="item.piece.code === 'b'" class="piece-detail">
              <span>{{ `&#x265d;`}}</span>
            </div>
            <div v-else-if="item.piece.code === 'n'" class="piece-detail">
              <span>{{ `&#x265e;`}}</span>
            </div>
            <div v-else-if="item.piece.code === 'p'" class="piece-detail">
              <span>{{ `&#x265f;`}}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.screen-wrapper {
  width: 100vw;
  height: 100vh;
  padding-left: 50px;
  .playground {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .nav-bar {
      width: 500px;
      height: 600px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        font-size: 40px;
        font-weight: 600;
        color: whitesmoke;
      }
      .turn-notify {
        font-size: 32px;
      }
      .rule-explanation {
        width: 100%;
        height: 300px;
        display: flex;
        flex-direction: column;
        padding: 12px 24px;
        background: white;
        border-radius: 6px;
        opacity: 0.5;
        margin-top: 12px;
        .rule-book, .piece-name, .piece-explanation {
          color: black;
        }
        .rule-book {
          font-size: 30px;
          font-weight: 600;
        }
        .piece-name {
          font-size: 20px;
          margin-bottom: 12px;
        }
      }
    }
    .chessboard-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
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
        cursor: pointer;
        .piece {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          position: relative;
          .piece-detail {
            width: 60px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 95px;
            position: absolute;
            box-sizing: border-box;
            top: 1px;
            span {
              line-height: 60px;
            }
          }
        }
        .w {
          color: white;
        }
        .b {
          color: black;
        }
      }
      .whiteSquare {
        background: #ffd0a1;
      }
      .choice {
        border: 2px solid #4b362c;
        box-sizing: border-box;
      }
    }
  }
}
</style>
