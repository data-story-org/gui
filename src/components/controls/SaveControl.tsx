import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import Modal from 'react-modal';
import { modalStyle } from '../../lib/utils';

import { BaseControl } from './BaseControl';
import { SaveModal } from '../modals/Save';
import { Store } from '../../lib/store';

interface Props {
  store: Store;
}

export const SaveControl: FC<Props> = observer(
  ({ store }) => {
    const [title, icon] = ['Save story', 'fas fa-save'];
    const [isOpen, setIsOpen] = useState(false);

    useHotkeys('shift+s', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });

    const onClick = () => {
      store.setDiagramLocked(true);
      setIsOpen(true);
    };

    const closeModal = () => {
      store.setDiagramLocked(false);
      setIsOpen(false);
    };

    return (
      <span>
        <BaseControl
          title={title}
          icon={icon}
          onClick={onClick}
        />
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={modalStyle}
          closeTimeoutMS={250}
        >
          <SaveModal
            store={store}
            closeModal={closeModal}
          />
        </Modal>
      </span>
    );
  },
);
