'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatDate';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

interface VideoCommentsProps {
  videoId: string;
}

export default function VideoComments({ videoId }: VideoCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement comment submission
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Current User', // TODO: Replace with actual user
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div id={`comments-${videoId}`} className="mt-8 bg-gray-800 rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-6">Comments</h3>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full bg-gray-700 rounded-lg p-4 text-white"
          placeholder="Add a comment..."
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Comment
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-gray-700 pb-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">{comment.author}</h4>
                <p className="text-sm text-gray-400">
                  {formatDate(comment.date)}
                </p>
              </div>
              <button className="text-gray-400 hover:text-yellow-400">
                <span>{comment.likes}</span> ❤️
              </button>
            </div>
            <p className="text-gray-300">{comment.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}