import type { Piece, ChessSquare } from './utils/type'

// 座標
export const file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
export const rank = [1, 2, 3, 4, 5, 6, 7, 8]

// 駒情報
export const piece: Piece[] = [
  { code: 'k', name: 'King' },
  { code: 'q', name: 'Queen' },
  { code: 'r', name: 'Rook' },
  { code: 'b', name: 'Bishop' },
  { code: 'n', name: 'Knight' },
  { code: 'p', name: 'Pawn' },
  { code: '', name: 'none' }
]

// 初期位置設定
export const initSquare = (
  piece: Piece,
  teamColor: computed<{ myColor: string; oppoColor: string }>
) => [
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

// ルール説明
export const ja_rule_explanation: { code: string; content: string }[] = [
  { code: 'k', content: 'キングは1歩だけ八方に動きます。\n＜将棋の王将＞', name: 'キング' },
  {
    code: 'q',
    content: 'クイーンは八方に動く最強の駒です。\n＜将棋の飛車＋角行＞',
    name: 'クイーン'
  },
  { code: 'r', content: 'ルークはたて横に動きます。\n＜将棋の飛車＞', name: 'ルック' },
  { code: 'b', content: 'ビショップは斜めに動きます。\n＜将棋の角行＞', name: 'ビショップ' },
  {
    code: 'n',
    content: 'L字ジャンプします。ナイトだけが他の駒を飛びこえます。\n＜八方桂馬＞',
    name: 'ナイト'
  },
  {
    code: 'p',
    content:
      '前に1歩進みます。＜将棋の歩兵に相当＞\n最初の位置から2歩動いてもよい。\n駒を取る時だけななめ前！＜将棋と違う！＞',
    name: 'ポーン'
  },
  { code: '', content: '' }
]

export const ja_flow_explanation: string[] = [
  '1. 相手の駒をマスからどけて',
  '2. 盤の外に置き',
  '3. 自分の駒を同じマスに置く',
  '＜取った駒は使えない！＞'
]