import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { Store } from '../../../lib/store';
import { GenericStory } from '../../../lib/types';
import { modalStyle } from '../../../lib/utils';
import { StoryWidgetModal } from '../../modals/StoryWidget';
import { DataStoryWidgetActions } from './StoryActions';
import { DataStoryWidgetDescription } from './StoryDescription';
import { DataStoryWidgetName } from './StoryName';
import { DataStoryWidgetTags } from './StoryTags';

interface Props {
  store: Store;
  story: GenericStory;
  storyLoadHandler: (storyName: string) => void;
  isStoryDemo?: boolean;
}

const storyWidgetStyle =
  'cursor-pointer rounded bg-gray-400 hover:shadow-xl overflow-hidden shadow-lg';

export const DataStoryWidget = observer<
  Props,
  HTMLDivElement
>(
  (
    { store, story, storyLoadHandler, isStoryDemo = false },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [doDiagramSaving, setDoDiagramSaving] =
      useState(false);

    const openModal = () => {
      store.setDiagramLocked(true);
      setIsOpen(true);
    };

    const closeModal = () => {
      store.setDiagramLocked(false);
      setIsOpen(false);
    };

    const handleModalSave = () => {
      setDoDiagramSaving(true);
      openModal();
    };

    return (
      <div
        key={story.name}
        id="data-story"
        ref={ref}
        className={storyWidgetStyle}
        onClick={
          isOpen
            ? () => {}
            : () => storyLoadHandler(story.name)
        }
      >
        <div className="px-6 py-4 relative">
          {!isStoryDemo && (
            <DataStoryWidgetActions
              onEdit={openModal}
              onSave={handleModalSave}
              store={store}
              story={story}
            />
          )}

          <DataStoryWidgetName storyName={story.name} />
          <DataStoryWidgetDescription
            storyDesc={story.description}
          />
        </div>

        <div className="px-6 pt-4 pb-2">
          <DataStoryWidgetTags storyTags={story.tags} />
        </div>

        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={modalStyle}
        >
          <StoryWidgetModal
            store={store}
            defaultStory={story}
            handleCancel={closeModal}
            saveDiagram={doDiagramSaving}
          />
        </Modal>
      </div>
    );
  },
  { forwardRef: true },
);
