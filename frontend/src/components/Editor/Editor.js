import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import EditorJS from '@editorjs/editorjs';

import getTools from './getTools';

const StyledEditorJS = styled('div')(({ theme }) => {
  const darkMode = theme.palette.mode === 'dark';

  const color = darkMode ? '#fff' : '#000';
  const textColor = darkMode ? '#000' : '#fff';

  return {
    '& .ce-inline-toolbar': {
      color: '#333',
    },
    '& .ce-block__content': {
      color,
    },
    '& .codex-editor__redactor': {
      paddingBottom: '50px !important',
      marginRight: 0,
      border: `1px solid ${theme.palette.grey[500]}`,
      padding: theme.spacing(0, 0.5),
    },
    '& .ce-toolbar__actions': {
      backgroundColor: color,
      right: 0,
    },
    '& .ce-toolbar__plus, & .ce-toolbar__settings-btn': {
      color: textColor,
      '&:hover': {
        backgroundColor: color,
        transform: 'scale(1.1)',
      },
    },
  };
});

const Editor = ({ mode, id, setEditorRef, allowH1, children }) => {
  const [editor, setEditor] = useState(null);

  const editorPlaceholder =
    mode === 'post'
      ? 'Your future post is here :)'
      : 'Your future comment is here :)';

  // Init
  useEffect(() => {
    const tools = getTools({ mode, allowH1 });

    const editor = new EditorJS({
      holder: id,
      tools,
      placeholder: editorPlaceholder,
    });

    setEditor(editor);

    // Clean up
    return () => {
      editor.isReady
        .then(() => {
          editor.destroy();
          // setEditor(null); // React warning can't perform a React state update on an unmounted component
        })
        .catch((e) => console.error('Error editor clean up', e));
    };
  }, [allowH1, editorPlaceholder, mode, id]);

  // Editor set ref
  useEffect(() => {
    if (!editor) return;

    setEditorRef(editor);
  }, [editor, setEditorRef]);

  return (
    <>
      <StyledEditorJS id={id} />
      {children}
    </>
  );
};

Editor.defaultProps = {
  allowH1: false,
  children: null,
  id: '__editorJS',
};

Editor.propTypes = {
  mode: PropTypes.oneOf(['post', 'comment']).isRequired,
  allowH1: PropTypes.bool,
  children: PropTypes.node,
  setEditorRef: PropTypes.func.isRequired,
  id: PropTypes.string,
};

export default Editor;
