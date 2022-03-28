import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSave, useSetData, useClearData } from 'components/Editor/hooks';
import mock from 'components/Editor/mock.json';

import { getRandomId } from 'utills';

const Editor = dynamic(
  () => import('components/Editor'),
  { ssr: false }
);

const EditorPage = () => {
  const [id] = useState(getRandomId()); // optional
  const [editor, setEditor] = useState(null);
  const [data, setData] = useState('');

  // Save editor state
  const onSave = useSave(editor);

  const handleSaveData = async () => {
    const data = await onSave();

    setData(data);
  };

  // Set data by click
  const handleSetData = () => setData(mock);

  useSetData(editor, data);

  // Clear data
  const clearData = useClearData(editor);

  return (
    <div>
      <Editor id={id} setEditorRef={setEditor} />
      <button onClick={handleSaveData}>Save</button>
      <button onClick={handleSetData}>Set data</button>
      <button onClick={clearData}>Clear</button>
    </div>
  );
};

export default EditorPage;
