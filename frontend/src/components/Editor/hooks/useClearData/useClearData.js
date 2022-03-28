import { useCallback } from 'react';

const useClearData = (editor) => {
  return useCallback(
    (e) => {
      e.preventDefault();

      if (!editor) return;

      let shouldClearData = true;

      editor.isReady.then(() => {
        // fixing an annoying warning in Chrome `addRange(): The given range isn't in document.`
        setTimeout(() => {
          if (!shouldClearData || !editor.clear) return;

          editor.clear();
        }, 100);

        return () => {
          shouldClearData = false;
        };
      });
    },
    [editor]
  );
};

export default useClearData;
