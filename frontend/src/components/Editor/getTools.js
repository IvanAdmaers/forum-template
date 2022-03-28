import Header from '@editorjs/header';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';

import { uploadImageByUrl, uploadImage } from 'api';

const uploadImageAPI = async (fileOrUrl = '', byUrl = false) => {
  try {
    const method = byUrl ? uploadImageByUrl : uploadImage;
    
    const res = await method(fileOrUrl);

    return res;
  } catch (e) {
    console.log(e);
    return { success: 0 };
  } 
};

const getTools = (options) => {
  const { mode, allowH1 } = options;

  const headerConfigLevels = [2, 3, 4, 5, 6];

  if (allowH1) {
    headerConfigLevels.push(1);
  }

  // Get tools for mode comment
  if (mode === 'comment') {
    const commentTools = {};

    return commentTools;
  }

  const tools = {
    header: {
      class: Header,
      config: {
        placeholder: 'Title',
        levels: headerConfigLevels,
        defaultLevel: 2,
      },
    },
    embed: {
      class: Embed,
      config: {
        services: {
          youtube: true,
        },
      },
    },
    image: {
      class: ImageTool,
      config: {
        uploader: {
          async uploadByUrl(url = '') {
           return await uploadImageAPI(url, true);
          },
          async uploadByFile(file) {
            return await uploadImageAPI(file);
           },
        },
      },
    },
  };

  return tools;
};

export default getTools;
