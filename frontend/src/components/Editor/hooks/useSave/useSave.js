import { useCallback } from 'react';

const useSave = (editor) => {
  return useCallback(async () => {
    if (!editor) return null;

    try {
      const out = await editor.save();
      return out;
    } catch (e) {
      console.error('Failed to save editor state', e);
    }
  }, [editor]);
};

export default useSave;
