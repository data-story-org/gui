import Fuse from 'fuse.js';
import { observer } from 'mobx-react-lite';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Store } from '../../../lib/store';
import {
  baseFieldStyle,
  baseFieldTitleStyle,
} from '../../../lib/styles';
import {
  BaseEventHandler,
  Story,
} from '../../../lib/types';
import { Button } from '../../fields/Button';
import { PossibleMatchesList } from './PossibleMatchesList';
import { SaveStoryI } from './SaveStoryI';

type StoryModalFieldChangeHandler = (
  field: string,
  tagKey?: number,
) => BaseEventHandler;

interface Props {
  story: SaveStoryI;
  handleChange: StoryModalFieldChangeHandler;
  addTag: BaseEventHandler;
  setStory: Dispatch<SetStateAction<SaveStoryI>>;
  store: Store;
}

const fieldStyle = `${baseFieldStyle} w-full`;
const tagFieldStyle = `${baseFieldStyle} w-1/5 rounded-full text-center`;

type StoryMatches = {
  byName: Story[];
  byDescription: Story[];
};

export const StoryWidgetBody: FC<Props> = observer(
  ({ story, handleChange, addTag, setStory, store }) => {
    const [possibleMatches, setPossibleMatches] =
      useState<StoryMatches>({
        byName: [],
        byDescription: [],
      });
    const [showMatches, setShowMatches] = useState(false);

    const nameFuse = new Fuse<Story>(
      store.metadata.stories,
      {
        keys: ['name'],
        threshold: 0.3,
      },
    );

    const nameInput = useRef(null);
    useEffect(() => {
      nameInput.current.focus();
    }, []);

    useEffect(() => {
      setPossibleMatches({
        ...possibleMatches,
        byName: nameFuse
          .search(story.name)
          .map((result) => result.item),
      });

      if (possibleMatches.byName.length > 0) {
        const matchedStorySelected =
          possibleMatches.byName.some(
            (matchedStory) =>
              matchedStory.name === story.name,
          );

        if (!matchedStorySelected) setShowMatches(true);
      }
    }, [story]);

    return (
      <div>
        <div className="bg-gray-100 px-6 py-2">
          <div className="flex flex-col my-4 justify-center align-middle text-gray-500 text-xs">
            <span className={baseFieldTitleStyle}>
              Name
            </span>
            <input
              onChange={handleChange('name')}
              className={fieldStyle}
              placeholder="descriptive story name"
              value={story.name}
              ref={nameInput}
            />
            {showMatches &&
              possibleMatches.byName.length > 0 && (
                <PossibleMatchesList
                  possibleMatches={possibleMatches.byName}
                  setStory={setStory}
                  setShowMatches={setShowMatches}
                />
              )}

            <span className={baseFieldTitleStyle}>
              Description
            </span>
            <input
              onChange={handleChange('description')}
              type="textarea"
              className={fieldStyle}
              placeholder="story description"
              value={story.description}
            />

            <span className={baseFieldTitleStyle}>
              Tags
            </span>
            <div>
              {Object.values(story.tags).map((tag, i) => {
                return (
                  <input
                    key={i}
                    onChange={handleChange('tags', i)}
                    className={tagFieldStyle}
                    placeholder="story tag"
                    value={tag}
                  />
                );
              })}
              <Button symbol="+" clickHandler={addTag} />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
