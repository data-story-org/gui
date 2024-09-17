import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Store } from '../../../lib/store';
import {
  GenericStory,
  BaseEventHandler,
  DataStory,
} from '../../../lib/types';
import { BaseStoryWidgetModal } from '../BaseStoryModal';
import { SaveStoryI } from '../BaseStoryModal/SaveStoryI';
import { editStory, saveStory } from '../../../lib/utils';

interface Props {
  store: Store;
  defaultStory: GenericStory;
  handleCancel: BaseEventHandler;
  saveDiagram?: boolean;
}

export const StoryWidgetModal: FC<Props> = observer(
  ({
    store,
    defaultStory,
    handleCancel,
    saveDiagram = false,
  }) => {
    const handleStoryEdit = async (story: SaveStoryI) => {
      const dataStory = new DataStory(
        story.name,
        story.description,
        Object.values(story.tags),
        store.getModel().serialize(),
      );

      const storyBeingEdited =
        defaultStory.name === story.name;

      storyBeingEdited
        ? await editStory(store, dataStory, {
            noDiagramSaving: !saveDiagram,
          })
        : await saveStory(store, {
            ...dataStory,
            diagram: store.metadata.stories.find(
              (story) => story.name === defaultStory.name,
            ).diagram,
          });

      handleCancel(1);
    };

    return (
      <div>
        <BaseStoryWidgetModal
          defaultStory={defaultStory}
          storySaver={handleStoryEdit}
          handleCancel={handleCancel}
          store={store}
        />
      </div>
    );
  },
);
