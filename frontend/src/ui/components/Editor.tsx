import React, { FC, useState } from 'react';
import { Spin } from 'antd';
import styled from '@emotion/styled';
import { Editor as BaseEditor } from '@tinymce/tinymce-react';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';
import { endpoints } from 'lib/api';

// Components
import { Item } from 'ui/styled/antd/Form';

// Types
type EditorProps = {
  title: string;
  initialValue?: string;
  onChange: (content: string, editor: any) => void;
};

const Wrapper = styled.div`
  min-height: 250px;

  .tox-tinymce {
    max-width: 622px;

    @media (max-width: ${BREAKPOINTS.sm}) {
      max-width: calc(100vw - 98px);
    }
  }
`;

const Editor: FC<EditorProps> = ({ title, onChange, initialValue = '<p>Be creative :)</p>' }) => {
  // React hooks
  const [isRenderingEditor, setIsRenderingEditor] = useState<boolean>(true);

  // Handlers
  const handleInitChange = () => setIsRenderingEditor(false);

  return (
    <Item label={title}>
      <Spin spinning={isRenderingEditor} tip="Loading editor">
        <Wrapper>
          <BaseEditor
            initialValue={initialValue}
            apiKey={process.env.REACT_APP_TINY_CLOUD_API_KEY}
            init={{
              height: 250,
              menubar: false,
              images_upload_url: endpoints.fun.raffles.images,
              plugins: [
                'advlist autolink lists link image charmap anchor',
                'searchreplace visualblocks code fullscreen',
                'media table paste help',
              ],
              toolbar: `undo redo | formatselect | bold italic forecolor backcolor | image |
            alignleft aligncenter alignright alignjustify | link |
            bullist numlist outdent indent | emoticons | removeformat | help`,
            }}
            onEditorChange={onChange}
            onInit={handleInitChange}
          />
        </Wrapper>
      </Spin>
    </Item>
  );
};

export default Editor;
