'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const branchKey = 'key_live_gypXDlYHiBAQqz2WwSZZPbjnAEebvJZk'

export function HydrateBranch() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.branch = window.branch || {};
    }
  }, []);

  return (
    <Script
      src="/branch-sdk.js"
      strategy="beforeInteractive"
      onLoad={() => {
        if (window.branch) {
          window.branch.init(branchKey);
        }
      }}
    />
  )
}