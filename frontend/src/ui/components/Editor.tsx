import React, { FC } from 'react';
import { Editor as BaseEditor } from '@tinymce/tinymce-react';

// Constants
import { endpoints } from 'lib/api';

// Components
import { Item } from 'ui/styled/antd/Form';

type EditorProps = {
  title: string;
  onChange: (content: string, editor: any) => void;
};

const Editor: FC<EditorProps> = ({ title, onChange }) => (
  <Item label={title}>
    <BaseEditor
      initialValue="<p>Be creative :)</p>"
      apiKey={process.env.REACT_APP_TINY_CLOUD_API_KEY}
      init={{
        height: 500,
        menubar: false,
        images_upload_url: endpoints.fun.raffles.images,
        plugins: [
          'advlist autolink lists link image charmap anchor',
          'searchreplace visualblocks code fullscreen',
          'media table paste help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic forecolor backcolor | image | \
          alignleft aligncenter alignright alignjustify | link | \
          bullist numlist outdent indent | emoticons | removeformat | help',
      }}
      onEditorChange={onChange}
    />
  </Item>
);

export default Editor;
