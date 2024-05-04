export interface Piece {
  code: string
  name: string
}

export interface ChessSquare {
  file: number
  rank: number
  piece: Piece
  color: string | null
}

export type Chessboard = ChessSquare[]
