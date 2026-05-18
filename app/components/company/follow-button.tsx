'use client';

import { Heart } from 'lucide-react';
import { useFollowedCompaniesStore } from '@/lib/store';

type Props = {
  companyId: string;
};

export default function FollowButton({ companyId }: Props) {
  const { toggleFollowCompany, followedCompanies } =
    useFollowedCompaniesStore();

  const isFollowing = followedCompanies.includes(companyId);

  return (
    <button
      onClick={() => toggleFollowCompany(companyId)}
      className={`rounded-2xl flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all duration-300 ${
        isFollowing
          ? 'bg-cyan-500 text-black shadow-[0_0_25px_rgba(6,182,212,0.35)]'
          : 'border border-white/10 bg-white/5 hover:bg-white/10'
      }`}
    >
      <Heart size={18} />
      {isFollowing ? 'Following' : 'Follow Company'}
    </button>
  );
}