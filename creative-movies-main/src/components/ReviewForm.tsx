import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

interface ReviewFormProps {
  movieId: number;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const reviews = JSON.parse(localStorage.getItem(`reviews_${movieId}`) || '[]');
    const newReview = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      rating,
      text: reviewText,
      date: new Date().toISOString(),
    };

    reviews.push(newReview);
    localStorage.setItem(`reviews_${movieId}`, JSON.stringify(reviews));

    setRating(0);
    setReviewText('');
    onReviewSubmitted();
  };

  if (!user) {
    return (
      <div className="bg-primary-dark p-6 rounded-lg">
        <p className="text-primary-white font-secondary">Please login to write a review.</p>
      </div>
    );
  }

  return (
    <div className="bg-primary-dark p-6 rounded-lg">
      <h3 className="text-2xl font-primary font-bold text-primary-white mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-primary-white font-secondary mb-2">Your Rating</label>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
        <div>
          <label className="block text-primary-white font-secondary mb-2">Your Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 rounded bg-primary-white text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light font-secondary"
            placeholder="Share your thoughts about this movie..."
          />
        </div>
        <button
          type="submit"
          className="bg-accent-green text-primary-white px-6 py-2 rounded font-primary font-medium hover:bg-green-700 transition-colors"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
