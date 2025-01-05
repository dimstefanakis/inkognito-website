'use client';

import Script from 'next/script';

const branchKey = 'key_live_gypXDlYHiBAQqz2WwSZZPbjnAEebvJZk'

export function HydrateBranch() {
  return (
    <>
      <Script id="branch-init" strategy="afterInteractive">
        {`
          (function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments])}},{_q:[],_v:1},"addListener banner closeBanner closeJourney data deepview deepviewCta first init link logout removeListener setBranchViewData setIdentity track trackCommerceEvent logEvent disableTracking getBrowserFingerprintId crossPlatformIds lastAttributedTouchData setAPIResponseCallback qrCode setRequestMetaData setAPIUrl getAPIUrl setDMAParamsForEEA".split(" "), 0);
          
          if (typeof window !== "undefined") {
            window.branch?.init("${branchKey}");
          }
        `}
      </Script>
    </>
  );
}