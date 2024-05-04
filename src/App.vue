<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { file, rank, piece, initSquare, ja_rule_explanation, ja_flow_explanation } from './utils/convert'
import type { Piece, ChessSquare, Chessboard } from './utils/type'

// ChatGPTの準備
const VITE_CHATGPT_TOKEN = import.meta.env.VITE_CHATGPT_TOKEN || 'any-default-local-build_env'

const chessboard = ref<Chessboard>([])
const chessboardHistory = ref<Chessboard[]>([])
const isBlack = ref<Boolean>(true)
const presentIndex = ref<number>(-1)
const presentSquare = ref<ChessSquare[]>([])
const phaseCount = ref<number>(0)
const turnColor = ref<string>('b')

const teamColor = computed<{ myColor: string; oppoColor: string }>(() => {
  const myColor = isBlack.value ? 'b' : 'w'
  const oppoColor = isBlack.value ? 'w' : 'b'
  return { myColor, oppoColor }
})

// ボードの見た目
const createChessboard = (): void => {
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
}

// 駒の配置
const initGame = (): void => {
  initSquare(piece, teamColor).forEach((init) => {
    const index = chessboard.value.findIndex((item) => {
      return item.file === init.file && item.rank === init.rank
    })
    chessboard.value[index] = init
  })
}

// 駒の移動
const handlePiece = (item: ChessSquare, index: number): void => {
  if (phaseCount.value === 0 && item.color === turnColor.value) {
    // 駒を選択（自分のターンの駒のみ選択可能）
    presentIndex.value = index;
    presentSquare.value.push(item);
    phaseCount.value++;
  } else if (phaseCount.value === 1 && presentSquare.value[0].color === turnColor.value) {
    // 移動位置を決定し、駒を移動
    if (item !== presentSquare.value[0] && (item.color !== turnColor.value || item.color === null)) {
      const oldIndex = presentIndex.value;
      const oldPiece = chessboard.value[oldIndex];

      chessboard.value[index] = presentSquare.value[0];
      chessboard.value[oldIndex] = {
        file: oldPiece.file,
        rank: oldPiece.rank,
        piece: piece[6],
        color: null
      };

      // 移動後の処理と履歴の更新
      if (!isBoardUnchanged(oldIndex, index)) {
        handleChessboardHistory();
        turnColor.value = turnColor.value === 'w' ? 'b' : 'w';
      }
    }
    // 変数をリセット
    resetMove();
  }
};

const isBoardUnchanged = (oldIndex: number, newIndex: number): boolean => {
  // 移動前後でボードが変わったか確認
  return chessboard.value[oldIndex].piece === piece[6] && chessboard.value[newIndex] === presentSquare.value[0];
};

const resetMove = (): void => {
  presentIndex.value = -1;
  presentSquare.value = [];
  phaseCount.value = 0;
};

const handleChessboardHistory = (): void => {
  chessboardHistory.value.push([...chessboard.value]);

  // 履歴はひとまず三つまで持っておく
  if (chessboardHistory.value.length > 3) {
    chessboardHistory.value.shift();
  }
}

// アンドゥ機能
const undoMove = (): void => {
  if (chessboardHistory.value.length > 1) {
    chessboardHistory.value.pop();
    chessboard.value = [...chessboardHistory.value[chessboardHistory.value.length - 1]];
    turnColor.value = turnColor.value === 'w' ? 'b' : 'w';

    if (chessboardHistory.value.length > 3) {
      chessboardHistory.value.shift();
    }
  }
};

onMounted(() => {
  createChessboard()
  initGame()
})
</script>
<template>
  <div class="screen-wrapper">
    <div class="playground">
      <div class="nav-bar">
        <span class="title">ハローチェス</span>
        <div class="turn-notify">
          <span class="turn-notify-text">
            {{ `TURN : ${turnColor === 'w' ? 'WHITE' : 'BLACK'}` }}
          </span>
          <div class="turn-color" :class="turnColor"></div>
        </div>
        <div class="rule-explanation">
          <div class="rule-content">
            <span class="rule-book">Rule</span>
            <span class="piece-name" v-if="chessboard[presentIndex]?.color">
              {{
                `名前：${ja_rule_explanation.filter((item) => item.code === chessboard[presentIndex]?.piece.code)[0]?.name}`
              }}
            </span>
            <span class="piece-explanation" v-if="chessboard[presentIndex]?.color">
              {{
                `${ja_rule_explanation.filter((item) => item.code === chessboard[presentIndex]?.piece.code)[0]?.content}`
              }}
            </span>
            <div class="piece-explanation flow" v-else>
              <span v-for="(item, index) in ja_flow_explanation">{{ item }}</span>
            </div>
          </div>
          <div class="source">
            <span>出典：日本チェス連盟</span>
          </div>   
        </div>
        <div class="btns">
          <div class="btn restart">リスタート</div>
          <div class="btn undo">戻す</div>
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
                (Math.floor(index / 8) % 2 === 0 && index % 2 === 0) ||
                (Math.floor(index / 8) % 2 === 1 && index % 2 === 1),
              choice: presentIndex === index
            }"
          >
            <div
              class="piece"
              :class="[item.color, item.piece.name]"
              @click="handlePiece(item, index)"
            >
              <div v-if="item.piece.code === 'k'" class="piece-detail">
                <span class="piece-text">{{ `&#x265a;` }}</span>
              </div>
              <div v-else-if="item.piece.code === 'q'" class="piece-detail">
                <span class="piece-text">{{ `&#x265b;` }}</span>
              </div>
              <div v-else-if="item.piece.code === 'r'" class="piece-detail">
                <span class="piece-text">{{ `&#x265c;` }}</span>
              </div>
              <div v-else-if="item.piece.code === 'b'" class="piece-detail">
                <span class="piece-text">{{ `&#x265d;` }}</span>
              </div>
              <div v-else-if="item.piece.code === 'n'" class="piece-detail">
                <span class="piece-text">{{ `&#x265e;` }}</span>
              </div>
              <div v-else-if="item.piece.code === 'p'" class="piece-detail">
                <span class="piece-text">{{ `&#x265f;` }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import './assets/stylesheets/app.scss';
</style>
