import React, {
  FC,
  RefObject,
  useEffect,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';

import { Store } from '../../../lib/store';
import { loadDemo, loadStory } from '../../../lib/utils';
import {
  BaseVoidEventHandler,
  GenericStory,
} from '../../../lib/types';
import { DataStoryWidget } from '../../widgets';
import { Options, useHotkeys } from 'react-hotkeys-hook';

interface Props {
  store: Store;
  stories: GenericStory[];
  isDemos?: boolean;
  visualSelection?: boolean;
  afterStoryClick?: BaseVoidEventHandler;
  currentSearchedStory?: RefObject<HTMLDivElement>;
}

const storyGridStyle =
  'px-10 py-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5';

const selectedStoryStyle = 'saturate-100';
const unselectedStoryStyle =
  'opacity-50 shadow-inner hue-rotate-60';

export const StoryGrid: FC<Props> = observer(
  ({
    store,
    stories,
    isDemos = false,
    currentSearchedStory = null,
    visualSelection = false,
    afterStoryClick = () => {},
  }) => {
    const [cursor, setCursor] = useState(0);
    if (visualSelection) {
      useEffect(() => {
        setCursor(0);
      }, [stories]);

      const goNext = () => {
        cursor < stories.length - 1
          ? setCursor(cursor + 1)
          : setCursor(0);

        currentSearchedStory &&
          currentSearchedStory.current.scrollIntoView(
            false,
          );
      };

      const goPrevious = () => {
        cursor > 0
          ? setCursor(cursor - 1)
          : setCursor(stories.length - 1);

        currentSearchedStory &&
          currentSearchedStory.current.scrollIntoView(
            false,
          );
      };

      const hotkeysOptions: Options = {
        enableOnTags: ['INPUT'],
        enabled: !store.metadata.confirmationRequired,
      };

      useHotkeys(
        'tab, down',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          goNext();
        },
        hotkeysOptions,
        [cursor],
      );

      useHotkeys(
        'shift+tab, up',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          goPrevious();
        },
        hotkeysOptions,
        [cursor],
      );
    }

    const onClick = (name: string) => {
      isDemos
        ? loadDemo(store, name)
        : loadStory(store, name);

      afterStoryClick();
      store.setPage('Workbench');
    };

    return (
      <div className={storyGridStyle}>
        {stories.map((story, i) => {
          const selectedPredicate = i == cursor;

          const selected = visualSelection
            ? selectedPredicate
            : true;

          return (
            <div
              key={`${i}-${story.name}`}
              className={`self-start shadow-2xl hover:opacity-100 hover:shadow-2xl ${
                selected
                  ? selectedStoryStyle
                  : unselectedStoryStyle
              }
              `}
            >
              <DataStoryWidget
                store={store}
                story={story}
                storyLoadHandler={onClick}
                isStoryDemo={isDemos}
                ref={selected ? currentSearchedStory : null}
              />
            </div>
          );
        })}
      </div>
    );
  },
);
