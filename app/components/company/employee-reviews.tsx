'use client';

import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Star, X, ThumbsUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Review } from '@/lib/dummy-data';
import Button from '@/app/components/ui/Button';

type Props = {
  companyId: string;
  reviews: Review[];
};

const PAGE_SIZE = 5;

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      size={16}
      className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}
    />
  ));
};

const breakdownKeys = [
  { label: 'Work-Life Balance', key: 'workLifeBalance' },
  { label: 'Culture', key: 'culture' },
  { label: 'Compensation', key: 'compensation' },
  { label: 'Management', key: 'management' },
] as const;

const EmployeeReviewsSection = ({ companyId, reviews }: Props) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ role: '', rating: 0, text: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const companyReviews = useMemo(
    () => reviews.filter((review) => review.companyId === companyId),
    [companyId, reviews]
  );

  const filteredReviews = useMemo(() => {
    return companyReviews.filter((review) => {
      const ratingMatch =
        ratingFilter === 'all'
          ? true
          : ratingFilter === '5'
          ? review.rating === 5
          : review.rating >= 4;

      const roleMatch = roleFilter === 'all' ? true : review.role === roleFilter;

      return ratingMatch && roleMatch;
    });
  }, [companyReviews, ratingFilter, roleFilter]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const averageRating =
    companyReviews.length > 0
      ? companyReviews.reduce((sum, r) => sum + r.rating, 0) / companyReviews.length
      : 0;

  const breakdown = breakdownKeys.map(({ label, key }) => {
    const avg =
      companyReviews.length > 0
        ? companyReviews.reduce((sum, r) => sum + r.breakdown[key], 0) /
          companyReviews.length
        : 0;

    return { label, value: Number(avg.toFixed(1)) };
  });

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.role) nextErrors.role = 'Role is required';
    if (!form.rating) nextErrors.rating = 'Rating is required';
    if (form.text.trim().length < 20)
      nextErrors.text = 'Review must be at least 20 characters';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setOpen(false);
    setForm({ role: '', rating: 0, text: '' });
  };

   const roles = Array.from(new Set(companyReviews.map((r) => r.role)));

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 
    bg-[linear-gradient(135deg,rgba(6,182,212,0.10),rgba(168,85,247,0.08),rgba(10,10,15,0.95))] 
    p-8 backdrop-blur-2xl shadow-[0_0_10px_rgba(6,182,212,0.08)] space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold neon-cyan tracking-tight">
            Employee Reviews
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-5xl font-bold text-cyan-400">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex gap-1">
              {renderStars(averageRating)}
            </div>
            <span className="text-white/60">
              ({companyReviews.length} reviews)
            </span>
          </div>
        </div>

        <Dialog.Root open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setErrors({});
            setForm({ role: '', rating: 0, text: '' });
          }
        }}>
          <Dialog.Trigger asChild>
            <Button>Write a Review</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/70 overflow-y-auto" />

            <Dialog.Content className="fixed left-1/2 top-1/2 w-[95%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-cyan-500/20 bg-black/40 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(6,182,212,0.12)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-cyan-400">
                    Write a Review
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button><X size={18} /></button>
                  </Dialog.Close>
                </div>

                <Dialog.Description className="mb-6 text-xs text-cyan-200/70 mt-[-15px]">
                  Share your experience working at this company.
                </Dialog.Description>

                <div className="space-y-4">
                  <input
                    placeholder="Your role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full rounded-2xl border border-cyan-500/20 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 backdrop-blur-xl outline-none transition focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                  />
                  {errors.role && 
                    <p className="text-xs text-red-400 mt-[-15px]">
                      {errors.role}
                    </p>
                  }

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setForm({ ...form, rating: i + 1 })}
                          className="focus:outline-none"
                        >
                          <Star
                            size={24}
                            className={i < form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  {errors.rating && 
                    <p className="text-xs text-red-400 mt-[-15px]">
                      {errors.rating}
                    </p>
                  }

                  <textarea
                    placeholder="Your review"
                    rows={5}
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    className="w-full rounded-2xl border border-cyan-500/20 resize-none bg-black/30 px-4 py-3 text-white placeholder:text-white/40 backdrop-blur-xl outline-none transition focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                  />
                  {errors.text && 
                    <p className="text-xs text-red-400 mt-[-15px]">
                      {errors.text}
                    </p>
                  }

                  <Button onClick={handleSubmit}>
                    Submit Review
                  </Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] items-start"
      >
        <div className="space-y-4">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-2">
                <span>{item.label}</span>
                <span>{item.value}/5</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / 5) * 100}%` }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full rounded-2xl border border-cyan-500/20 bg-black/30 px-4 py-3 text-sm text-cyan-200 backdrop-blur-xl focus:outline-none focus:border-cyan-400"
          >
            <option value="all" className="bg-[#0A0A0F]">
              All Ratings
            </option>
            <option value="5" className="bg-[#0A0A0F]">
              5 Stars
            </option>
            <option value="4-5" className="bg-[#0A0A0F]">
              4-5 Stars
            </option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-2xl border border-cyan-500/20 bg-black/30 px-4 py-3 text-sm text-cyan-200 backdrop-blur-xl focus:outline-none focus:border-cyan-400"
          >
            <option value="all" className="bg-[#0A0A0F]">
              All Roles
            </option>
            {roles.map((role) => (
              <option key={role} value={role} className="bg-[#0A0A0F]">   
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <div 
            key={review.id} 
            className="rounded-3xl border border-cyan-500/15 bg-black/20 p-5 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.04)] hover:border-cyan-400/30 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">
                  Anonymous {review.role}
                </p>
                <div className="flex gap-1 mt-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <span className="text-sm text-white/50">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>

            <p className="text-white/80">{review.text}</p>

            <div className="flex items-center gap-2 mt-4 text-sm text-cyan-300/70">
              <ThumbsUp size={14} /> {review.helpfulVotes} helpful votes
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredReviews.length && (
        <Button onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}>
          Load More <ChevronDown size={16} />
        </Button>
      )}
    </section>
  )
}

export default EmployeeReviewsSection