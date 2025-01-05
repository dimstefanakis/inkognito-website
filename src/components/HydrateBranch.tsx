'use client';

import { useEffect } from 'react';

import branch from 'branch-sdk';

const branchKey = 'key_live_gypXDlYHiBAQqz2WwSZZPbjnAEebvJZk'

export function HydrateBranch() {
  useEffect(() => {
    branch.init(branchKey);
  }, []);

  return null;
}