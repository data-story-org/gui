import React, { FC, useEffect, useState } from 'react';
import { SaveStoryI } from './SaveStoryI';
import { StoryWidgetBody } from './BaseStoryModalBody';
import { StoryWidgetActions } from './BaseStoryModalActions';
import { StoryWidgetModalHeader } from './BaseStoryModalHeader';
import { useHotkeys } from 'react-hotkeys-hook';
import { BaseEventHandler } from '../../../lib/types';
import { Store } from '../../../lib/store';
import { observer } from 'mobx-react-lite';
import { ConfirmDialog } from '../../../lib/utils/Dialog';

export type StoryWidgetSaver = (story: SaveStoryI) => void;

type Props = {
  defaultStory?: SaveStoryI;
  storySaver: StoryWidgetSaver;
  handleCancel: BaseEventHandler;
  store: Store;
  withHeader?: boolean;
};

export const BaseStoryWidgetModal: FC<Props> = observer(
  ({
    defaultStory,
    storySaver,
    handleCancel,
    store,
    withHeader = true,
  }) => {
    useHotkeys(
      'enter',
      (e) => {
        e.stopPropagation();
        handleSave(e);
      },
      {
        enableOnTags: ['INPUT'],
      },
    );

    const [story, setStory] = useState<SaveStoryI>({
      name: '',
      description: '',
      tags: {},
    });

    useEffect(() => {
      if (defaultStory) {
        setStory({
          name: defaultStory.name,
          description: defaultStory.description,
          tags: Object.assign({}, defaultStory.tags),
        });
      }
    }, [defaultStory]);

    const [
      saveConfirmationRequired,
      setSaveConfirmationRequired,
    ] = useState(false);

    const handleSave = (e) => {
      const isStoryBeingEdited =
        store.metadata.stories.some(
          (exstStory) => exstStory.name === story.name,
        );

      isStoryBeingEdited
        ? setSaveConfirmationRequired(true)
        : storySaver(story);
    };

    const handleChange =
      (field: string, tagKey: number = 0) =>
      (e) => {
        field === 'tags'
          ? setStory({
              ...story,
              [field]: {
                ...story.tags,
                [tagKey]: e.target.value,
              },
            })
          : setStory({
              ...story,
              [field]: e.target.value,
            });
      };

    const addTag = (e) => {
      setStory({
        ...story,
        tags: {
          ...story.tags,
          [Object.keys(story.tags).length]: '',
        },
      });
    };

    return (
      <div id="story-modal">
        {withHeader && (
          <StoryWidgetModalHeader
            story={story}
            handleCancel={handleCancel}
          />
        )}
        <StoryWidgetBody
          story={story}
          handleChange={handleChange}
          addTag={addTag}
          setStory={setStory}
          store={store}
        />
        <StoryWidgetActions
          handleSave={handleSave}
          handleCancel={handleCancel}
        />

        <ConfirmDialog
          title="Overwrite existing story"
          description={`Are you sure want to overwrite existing «‎${story.name}»‎ story?`}
          open={saveConfirmationRequired}
          setOpen={setSaveConfirmationRequired}
          onConfirm={() => storySaver(story)}
          onClose={() => setSaveConfirmationRequired(false)}
        />
      </div>
    );
  },
);
