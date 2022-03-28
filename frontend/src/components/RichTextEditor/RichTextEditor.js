import PropTypes from 'prop-types';
import { useState, useRef, forwardRef } from 'react';
import { Box } from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';
import {
  convertFromRaw,
  convertFromHTML,
  ContentState,
  convertToRaw,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import MUIRichTextEditor from 'mui-rte';

import UploadImagePopover from './components/UploadImagePopover';

import { uploadImage as uploadImageApi } from 'api';

// Upload image to server
const uploadImageToServer = async (file) => {
  try {
    const { url } = await uploadImageApi(file);

    return url;
  } catch (e) {
    console.log(e);
  }
};

// Process image after upload to server
const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const url = await uploadImageToServer(file);

      if (!url) {
        return reject(new Error('Url is undefined'));
      }

      return resolve({
        data: {
          url,
          src: url,
          width: '300px',
          // width: "301px",
          // height: "200px",
          alignment: 'left', // or 'center', 'right'
          type: 'image', // or 'video'
        },
      });
    })();
  });
};

// Solution from https://www.davedrinks.coffee/how-do-i-use-two-react-refs/
const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

const getEditorValue = (initialValue = '') => {
  const contentHTML = convertFromHTML(initialValue);
  const state = ContentState.createFromBlockArray(
    contentHTML.contentBlocks,
    contentHTML.entityMap
  );
  const content = JSON.stringify(convertToRaw(state));

  return content;
};

// Editor
const RichTextEditor = forwardRef(({ onGetHTML, value }, forwardedRef) => {
  const handleSave = (data) => {
    const contentState = convertFromRaw(JSON.parse(data));
    onGetHTML(stateToHTML(contentState));
  };

  const ref = useRef(null);
  const [anchor, setAnchor] = useState(null);

  const handleFileUpload = (file) => {
    if (!ref || !ref.current) return;
    ref.current.insertAtomicBlockAsync(
      'IMAGE',
      uploadImage(file),
      'Image is loading...'
    );
  };

  const editorValue = value ? getEditorValue(value) : '';

  return (
    <>
      <UploadImagePopover
        anchor={anchor}
        onSubmit={(data, insert) => {
          if (insert && data.file) {
            handleFileUpload(data.file);
          }
          setAnchor(null);
        }}
      />
      <Box
        sx={{
          minHeight: 100,
          border: (theme) => `1px solid ${theme.palette.grey[300]}`,
          borderRadius: 5,
        }}
      >
        <MUIRichTextEditor
          onSave={handleSave}
          defaultValue={editorValue}
          label="Post text"
          ref={mergeRefs(ref, forwardedRef)}
          controls={['title', 'bold', 'underline', 'link', 'upload-image']}
          customControls={[
            {
              name: 'upload-image',
              icon: <ImageIcon />,
              type: 'callback',
              onClick: (_editorState, _name, anchor) => {
                setAnchor(anchor);
              },
            },
          ]}
          draftEditorProps={{
            handleDroppedFiles: (_selectionState, files) => {
              if (files.length && files[0].name !== undefined) {
                handleFileUpload(files[0]);
                return 'handled';
              }

              return 'not-handled';
            },
          }}
        />
      </Box>
    </>
  );
});

RichTextEditor.defaultProps = {
  onGetHTML: () => {},
  value: '',
};

RichTextEditor.propTypes = {
  onGetHTML: PropTypes.func,
  value: PropTypes.string,
};

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
