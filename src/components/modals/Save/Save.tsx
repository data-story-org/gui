import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Store } from '../../../lib/store';
import {
  BaseVoidEventHandler,
  DataStory,
} from '../../../lib/types';
import { saveStory } from '../../../lib/utils';
import { BaseModalHeader } from '../BaseModalHeader';
import { BaseStoryWidgetModal } from '../BaseStoryModal';
import { SaveStoryI } from '../BaseStoryModal/SaveStoryI';

interface Props {
  store: Store;
  closeModal: BaseVoidEventHandler;
}

export const SaveModal: FC<Props> = observer(
  ({ store, closeModal }) => {
    const handleCancel = (_e) => {
      closeModal();
    };

    const handleSave = async (story: SaveStoryI) => {
      store.getModel().clearLinkLabels();

      const dataStory = new DataStory(
        story.name,
        story.description,
        Object.values(story.tags),
        store.getModel().serialize(),
      );

      closeModal();
      await saveStory(store, dataStory);
    };

    return (
      <div id="story-save">
        <BaseModalHeader action="save" />
        <BaseStoryWidgetModal
          storySaver={handleSave}
          handleCancel={handleCancel}
          withHeader={false}
          store={store}
        />
      </div>
    );
  },
);
