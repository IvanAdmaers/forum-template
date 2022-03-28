import { useEffect } from 'react';

const useSetData = (editor, data) => {
  useEffect(() => {
    if (!editor || !data) return;

    let shouldSetData = true;

    editor.isReady.then(() => {
      // fixing an annoying warning in Chrome `addRange(): The given range isn't in document.`
      setTimeout(() => {
        if (!shouldSetData || !editor.render) return;

        editor.render(data);
      }, 100);

      return () => {
        shouldSetData = false;
      };
    });
  }, [editor, data]);
};

export default useSetData;
