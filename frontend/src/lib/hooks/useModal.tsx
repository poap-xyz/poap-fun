import React, { ElementType, useRef } from 'react';
import { useModal as useModalHook } from 'react-modal-hook';

// Components
import { Modal } from 'ui/styled/antd/Modal';
import { Button } from 'ui/styled/antd/Button';

// Types
type Props = {
  component: ElementType;
  closable?: boolean;
  title?: string;
  id?: number;
  className?: string;
  width?: number;
  okButtonWidth?: number;
  okButtonText?: string;
};

export const useModal = ({
  component,
  closable = true,
  title = undefined,
  id = undefined,
  className = '',
  width = 400,
  okButtonWidth = 100,
  okButtonText = 'Ok',
}: Props) => {
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const ModalWrapper = () => (
    <Modal
      cancelButtonProps={{ ghost: true }}
      className={className}
      closable={closable}
      footer={[
        <Button onClick={hideModal} type="primary" width={okButtonWidth}>
          {okButtonText}
        </Button>,
      ]}
      onCancel={hideModal}
      onOk={hideModal}
      title={title}
      visible
      width={`${width}px`}
    >
      {React.createElement(component, { hideModal, id, submitButtonRef })}
    </Modal>
  );

  const [showModal, hideModal] = useModalHook(ModalWrapper);

  return { showModal, hideModal };
};
