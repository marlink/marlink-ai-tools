import React, { memo } from 'react';

const Spinner = memo(() => (
  <div className="flex justify-center items-center py-20" aria-live="polite" aria-busy="true">
    <div
      className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-slate-800 border-t-transparent dark:border-slate-200 dark:border-t-transparent"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
));

export default Spinner;
