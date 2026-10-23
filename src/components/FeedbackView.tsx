import React, { useState } from 'react';
import { MessageSquarePlus, Star, Send, CheckCircle2, Sparkles } from 'lucide-react';

export const FeedbackView: React.FC = () => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('Feature Request');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = ['Feature Request', 'UI & Experience', 'Voice Assistant', 'Shopping Lists', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitted(true);
    setFeedbackText('');
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>Community Feedback</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Send Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Share your ideas, bug reports, and suggestions directly with the development team.
        </p>
      </section>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your feedback helps us continuously refine the CymbalMart AI Party Planner experience.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                How would you rate your overall experience?
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {rating === 5 ? '5 - Exceptional' : `${rating} Stars`}
                </span>
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Feedback Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      category === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Thoughts or Suggestions
              </label>
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What did you love? What could be improved for future celebrations?"
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <span>Submit Feedback</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
