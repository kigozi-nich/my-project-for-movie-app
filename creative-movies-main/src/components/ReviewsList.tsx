import React from 'react';
import StarRating from './StarRating';

interface Review {
  id: string;
  username: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-primary-dark p-6 rounded-lg">
        <p className="text-primary-white font-secondary">No reviews yet. Be the first to review this movie!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-primary-dark p-6 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-lg font-primary font-semibold text-primary-white">{review.username}</h4>
              <p className="text-sm text-gray-400 font-secondary">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
            <StarRating rating={review.rating} readonly size="sm" />
          </div>
          <p className="text-primary-white font-secondary leading-relaxed">{review.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
