<template>
  <!-- <div class="dad-joke-container">
    <h2 class="title">🤣 Get a Dad Joke 🤣</h2>
    <div class="input-container">
      <input v-model="topic" placeholder="Enter a topic" class="input" />
      <button @click="getDadJoke" class="button" :disabled="isLoading">
        <span v-if="isLoading">Loading...</span>
        <span v-else>Get Joke</span>
      </button>
    </div>
    <div v-if="joke" class="dad-joke-result">
      <p class="joke-text">{{ joke }}</p>
    </div>
  </div> -->
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
          :class="{whiteSquare: (parseInt(index / 8) % 2 === 0 && index % 2 === 0) || (parseInt(index / 8) % 2 === 1 && index % 2 === 1)}"
        >
          <div class="piece" :class="`${item.color}`">{{ item.piece.code }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
const VITE_CHATGPT_TOKEN = import.meta.env.VITE_CHATGPT_TOKEN || 'any-default-local-build_env'
const topic = ref('');
const joke = ref();
const isLoading = ref(false);

const chessboard = ref([]);
const isBlack = ref(true);
const teamColor = computed(() => {
  const myColor = isBlack.value ? 'b' : 'w';
  const oppoColor = isBlack.value ? 'w' : 'b';
  return {myColor, oppoColor};
})

const file = ["a", "b", "c", "d", "e", "f", "g", "h"];
const rank = ["1", "2", "3", "4", "5", "6", "7", "8"];
const piece = [{code: "k", name: "King"}, {code: "q", name: "Queen"}, {code: "r", name: "Rook"}, {code: "b", name: "Bishop"}, {code: "n", name: "Knight"}, {code: "p", name: "Pawn"}]

const createChessboard = () => {
  for (let j = rank.length; j > 0; j--) {
    for (let i = 0; i < file.length; i++) {
      chessboard.value.push({file: file[i], rank: rank[j - 1], piece: {code: '', name: 'none'}, color: null })
    }
  }
}
const initGame = () => {
  const initSquare = [
    // King
    {file: "e", rank: "8", piece: piece[0], color: teamColor.value.oppoColor}, 
    {file: "d", rank: "1", piece: piece[0], color: teamColor.value.myColor},
    // Queen
    {file: "d", rank: "8", piece: piece[1], color: teamColor.value.oppoColor}, 
    {file: "e", rank: "1", piece: piece[1], color: teamColor.value.myColor},
    // Rook
    {file: "a", rank: "8", piece: piece[2], color: teamColor.value.oppoColor}, 
    {file: "a", rank: "1", piece: piece[2], color: teamColor.value.myColor},
    {file: "h", rank: "8", piece: piece[2], color: teamColor.value.oppoColor}, 
    {file: "h", rank: "1", piece: piece[2], color: teamColor.value.myColor},
    // Bishop
    {file: "c", rank: "8", piece: piece[3], color: teamColor.value.oppoColor}, 
    {file: "c", rank: "1", piece: piece[3], color: teamColor.value.myColor},
    {file: "f", rank: "8", piece: piece[3], color: teamColor.value.oppoColor}, 
    {file: "f", rank: "1", piece: piece[3], color: teamColor.value.myColor},
    // Knight
    {file: "b", rank: "8", piece: piece[4], color: teamColor.value.oppoColor}, 
    {file: "b", rank: "1", piece: piece[4], color: teamColor.value.myColor},
    {file: "g", rank: "8", piece: piece[4], color: teamColor.value.oppoColor}, 
    {file: "g", rank: "1", piece: piece[4], color: teamColor.value.myColor},
    // Pawn Opponent
    {file: "a", rank: "7", piece: piece[5], color: teamColor.value.oppoColor}, 
    {file: "b", rank: "7", piece: piece[5], color: teamColor.value.oppoColor},
    {file: "c", rank: "7", piece: piece[5], color: teamColor.value.oppoColor}, 
    {file: "d", rank: "7", piece: piece[5], color: teamColor.value.oppoColor},
    {file: "e", rank: "7", piece: piece[5], color: teamColor.value.oppoColor}, 
    {file: "f", rank: "7", piece: piece[5], color: teamColor.value.oppoColor},
    {file: "g", rank: "7", piece: piece[5], color: teamColor.value.oppoColor}, 
    {file: "h", rank: "7", piece: piece[5], color: teamColor.value.oppoColor},
    // Pawn My
    {file: "a", rank: "2", piece: piece[5], color: teamColor.value.myColor}, 
    {file: "b", rank: "2", piece: piece[5], color: teamColor.value.myColor},
    {file: "c", rank: "2", piece: piece[5], color: teamColor.value.myColor}, 
    {file: "d", rank: "2", piece: piece[5], color: teamColor.value.myColor},
    {file: "e", rank: "2", piece: piece[5], color: teamColor.value.myColor}, 
    {file: "f", rank: "2", piece: piece[5], color: teamColor.value.myColor},
    {file: "g", rank: "2", piece: piece[5], color: teamColor.value.myColor}, 
    {file: "h", rank: "2", piece: piece[5], color: teamColor.value.myColor},
  ];
  initSquare.forEach((init) => {
    const index = chessboard.value.findIndex((item) => {
      return item.file === init.file && item.rank === init.rank;
    });
    chessboard.value[index] = init;
  });
}

onMounted(() => {
  createChessboard();
  initGame();
  console.log(chessboard.value)
})

const getDadJoke = async () => {
  isLoading.value = true;
  joke.value = null;
  const prompt = `Think about you as the funniest person ever!!! I will give you a topic and you will generate me a dad joke about this topic. the topic is: ${topic.value}`;
  let retryCount = 0;
  let success = false;

  while (!success && retryCount < 5) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo-16k',
          messages: [{ role: 'user', content: prompt }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + VITE_CHATGPT_TOKEN
          }
        }
      );
      joke.value = response.data.choices[0].message.content;
      success = true; // Stop retrying if successful
    } catch (error) {
      console.error('Retry attempt:', retryCount, error);
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // Wait 2, 4, 6, etc. seconds
    }
  }

  if (!success) {
    joke.value = 'Failed to fetch joke after several attempts.';
  }

  isLoading.value = false;
}
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
    }
  }
}
.dad-joke-container {
  text-align: center;
  margin: 20px;
  padding: 20px;
  border: 2px solid #ff6f61;
  border-radius: 10px;
  background-color: #ffecb3;
}

.title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #ff6f61;
}

.input-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.input {
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #ff6f61;
  margin-right: 10px;
}

.button {
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #ff6f61;
  color: #fff;
  border: none;
  cursor: pointer;
}

.dad-joke-result {
  margin-top: 20px;
  font-size: 1.5em;
  color: #ff6f61;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #ff6f61;
}

.joke-text {
  margin: 0;
}

.button {
  position: relative;
}

.button span {
  visibility: visible;
}

.button span.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  visibility: hidden;
}
</style>
