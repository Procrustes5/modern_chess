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
          <span>{{`${item.posX}${item.posY}`}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
const VITE_CHATGPT_TOKEN = import.meta.env.VITE_CHATGPT_TOKEN || 'any-default-local-build_env'
const topic = ref('');
const joke = ref();
const isLoading = ref(false);

const chessboard = ref([]);
const isBlack = ref(true);

const file = ["a", "b", "c", "d", "e", "f", "g", "h"];
const rank = ["1", "2", "3", "4", "5", "6", "7", "8"];
const piece = [{code: "k", name: "King"}, {code: "q", name: "Queen"}, {code: "r", name: "Rook"}, {code: "b", name: "Bishops"}, {code: "n", name: "Knight"}, {code: "p", name: "Pawn"}]

const createChessboard = () => {
  for (let i = file.length; i > 0; i--) {
    for (let j = 0; j < rank.length; j++) {
      chessboard.value.push({posX: file[i - 1], posY: rank[j], piece: null, color: null })
    }
  }
}
const initGame = () => {
  
}

onMounted(() => {
  createChessboard();
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
      width: 100px;
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
      }
      .whiteSquare {
        background: whitesmoke;
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
