'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send } from 'lucide-react'

interface Comment {
  id: string
  author: string
  avatar?: string
  content: string
  timestamp: string
  resolved: boolean
  replies?: Comment[]
}

interface CommentsProps {
  taxonomyId: string
  itemId?: string
  onCommentAdded?: (comment: Comment) => void
}

export default function TaxonomyComments({
  taxonomyId,
  itemId,
  onCommentAdded,
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const url = itemId
          ? `/api/taxonomies/${taxonomyId}/comments?itemId=${itemId}`
          : `/api/taxonomies/${taxonomyId}/comments`
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch comments')
        const data = await response.json()
        setComments(data)
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [taxonomyId, itemId])

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setPosting(true)
    try {
      const response = await fetch(`/api/taxonomies/${taxonomyId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          itemId,
          author: 'Current User',
        }),
      })

      if (!response.ok) throw new Error('Failed to post comment')
      const comment = await response.json()
      setComments([comment, ...comments])
      setNewComment('')
      onCommentAdded?.(comment)
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setPosting(false)
    }
  }

  const handleResolveComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/taxonomies/${taxonomyId}/comments/${commentId}/resolve`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to resolve comment')
      const updatedComments = comments.map(c =>
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      )
      setComments(updatedComments)
    } catch (error) {
      console.error('Error resolving comment:', error)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading comments...</div>
  }

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Comments & Collaboration</CardTitle>
        <CardDescription>Discuss changes and leave feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New comment form */}
        <form onSubmit={handlePostComment} className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-24"
          />
          <Button
            type="submit"
            disabled={!newComment.trim() || posting}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {posting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>

        {/* Comments list */}
        <div className="space-y-4 border-t pt-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No comments yet. Start the conversation!
            </p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.author
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {comment.resolved && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Resolved
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground">{comment.content}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResolveComment(comment.id)}
                >
                  {comment.resolved ? 'Unresolve' : 'Mark as Resolved'}
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
