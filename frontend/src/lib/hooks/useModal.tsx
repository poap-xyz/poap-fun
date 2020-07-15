import React, { ElementType, ReactNode } from 'react';
import { useModal as useModalHook } from 'react-modal-hook';

// Components
import { Modal } from 'ui/styled/antd/Modal';
import { Button } from 'ui/styled/antd/Button';

// Types
type Props = {
  component: ElementType;
  closable?: boolean;
  footerButton?: boolean;
  title?: string;
  id?: number;
  className?: string;
  width?: number;
  okButtonWidth?: number;
  okButtonText?: string;
  onSuccess?: (data: object) => void;
};

export const useModal = ({
  component,
  closable = true,
  footerButton = true,
  title = undefined,
  id = undefined,
  className = '',
  width = 400,
  okButtonWidth = 100,
  okButtonText = 'Ok',
  onSuccess = (data: any) => {},
}: Props) => {
  const ModalWrapper = () => {
    let footer: ReactNode[] | null = [
      <Button onClick={hideModal} type="primary" width={okButtonWidth}>
        {okButtonText}
      </Button>,
    ];
    if (!footerButton) footer = null;
    return (
      <Modal
        cancelButtonProps={{ ghost: true }}
        className={className}
        closable={closable}
        footer={footer}
        onCancel={hideModal}
        onOk={hideModal}
        title={title}
        visible
        width={`${width}px`}
      >
        {React.createElement(component, { hideModal, id, onSuccess })}
      </Modal>
    );
  };

  const [showModal, hideModal] = useModalHook(ModalWrapper);

  return { showModal, hideModal };
};
