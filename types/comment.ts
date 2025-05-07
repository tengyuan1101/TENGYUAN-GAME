export interface GameComment {
  id: number
  gameId: number
  userId: number
  username: string
  content: string
  rating: number
  createdAt: string
  approved: boolean
  replies?: GameCommentReply[]
}

export interface GameCommentReply {
  id: number
  commentId: number
  userId: number
  username: string
  content: string
  createdAt: string
}
