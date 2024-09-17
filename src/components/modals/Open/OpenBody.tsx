import React, { FC, useRef, useState } from 'react';
import { Store } from '../../../lib/store';
import { observer } from 'mobx-react-lite';
import { StoryGrid } from '../../widgets/DataStory';
import { OpenBodyStorySearch } from './OpenBodyStorySearch';
import {
  BaseVoidEventHandler,
  GenericStory,
  Story,
} from '../../../lib/types';
import { useHotkeys } from 'react-hotkeys-hook';

interface Props {
  store: Store;
  afterStoryClick: BaseVoidEventHandler;
}

export const OpenModalBody: FC<Props> = observer(
  ({ store, afterStoryClick }) => {
    useHotkeys(
      'shift+enter',
      (e) => {
        e.stopPropagation();
        currentSearchedStory.current.click();
      },
      {
        enableOnTags: ['INPUT'],
        enabled: !store.metadata.confirmationRequired,
      },
    );

    const userStories = store.metadata.stories;
    const currentSearchedStory = useRef(null);

    const [userSearchedStories, setUserSearchedStories] =
      useState(userStories);

    const isStorySearched = (story: GenericStory) => {
      return userSearchedStories.includes(story as Story);
    };

    const userHaveSavedStories =
      store.metadata.stories.length !== 0;

    return (
      <div>
        <div className="w-full bg-gray-100 px-6 py-2">
          <div className="flex flex-col my-4 justify-center align-middle text-gray-500 text-xs">
            {userHaveSavedStories ? (
              <OpenBodyStorySearch
                stories={userStories}
                setSearchResult={setUserSearchedStories}
              />
            ) : (
              <span className="my-2 font-sans font-medium text-sm text-indigo-500">
                No user saved stories found
              </span>
            )}

            <StoryGrid
              stories={userStories.filter(isStorySearched)}
              store={store}
              afterStoryClick={afterStoryClick}
              currentSearchedStory={currentSearchedStory}
              visualSelection={true}
            />
          </div>
        </div>
      </div>
    );
  },
);
