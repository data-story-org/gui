import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Cookie } from '../../../lib/utils';
import { Store } from '../../../lib/store';
import { OpenModalBody } from './OpenBody';
import { OpenModalActions } from './OpenActions';
import { BaseModalHeader } from '../BaseModalHeader';
import { BaseVoidEventHandler } from '../../../lib/types';
import { ConfirmDialog } from '../../../lib/utils/Dialog';

interface Props {
  store: Store;
  closeModal: BaseVoidEventHandler;
}

export const OpenModal: FC<Props> = observer(
  ({ store, closeModal }) => {
    const [
      clearConfirmationRequired,
      setClearConfirmationRequired,
    ] = useState(false);

    const handleCancel = (_e) => {
      closeModal();
    };

    const handleClear = (_e) => {
      Cookie.clear();
      store.setStories(Cookie.keys());
    };

    const afterStoryClick = () => {
      closeModal();
    };

    return (
      <div>
        <BaseModalHeader action="open" />
        <OpenModalBody
          store={store}
          afterStoryClick={afterStoryClick}
        />
        <OpenModalActions
          handleClear={() =>
            setClearConfirmationRequired(true)
          }
          handleCancel={handleCancel}
        />

        <ConfirmDialog
          title="Clear user stories"
          description={`Are you sure want to clear all saved stories?`}
          open={clearConfirmationRequired}
          setOpen={setClearConfirmationRequired}
          onConfirm={() => handleClear}
          onClose={() =>
            setClearConfirmationRequired(false)
          }
        />
      </div>
    );
  },
);
