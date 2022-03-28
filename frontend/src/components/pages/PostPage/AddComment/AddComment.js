import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Grid, Button } from '@mui/material';

import { useSave, useClearData } from 'components/Editor/hooks';

const Editor = dynamic(() => import('components/Editor'), { ssr: false });

const AddComment = ({ editorId, onSubmit, isLoading }) => {
  const [editor, setEditor] = useState();

  const onSave = useSave(editor);
  const onClear = useClearData(editor);

  const handleSubmit = async (e) => {
    const attr = 'data-comment-id';

    const editorData = await onSave();

    const parent = e.target.closest(`[${attr}]`)?.getAttribute(attr);

    const parentId = !parent ? null : parent;

    onSubmit(parentId, editorData);
    onClear(e);
  };

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Editor id={editorId} mode="comment" setEditorRef={setEditor} />
      </Grid>
      <Grid item>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          Send
        </Button>
      </Grid>
    </Grid>
  );
};

AddComment.defaultProps = {
  isLoading: false,
};

AddComment.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  editorId: PropTypes.string,
};

export default AddComment;
