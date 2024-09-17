import React, { Dispatch, SetStateAction, FC } from 'react';
import { Story } from '../../../../lib/types';
import { SaveStoryI } from '../SaveStoryI';

interface Props {
  possibleMatches: Story[];
  setStory: Dispatch<SetStateAction<SaveStoryI>>;
  setShowMatches: Dispatch<SetStateAction<boolean>>;
}

export const PossibleMatchesList: FC<Props> = ({
  possibleMatches,
  setStory,
  setShowMatches,
}) => {
  return (
    <div className="w-full my-4 bg-white rounded-lg shadow-lg lg:w-1/3">
      <ul className="bg-white rounded-lg border border-gray-200">
        {possibleMatches.map((possibleMatch, i) => {
          const clickHandler = (e) => {
            setStory({
              name: possibleMatch.name,
              description: possibleMatch.description,
              tags: Object.assign({}, possibleMatch.tags),
            });

            setShowMatches(false);
          };

          return (
            <li
              className={`px-4 py-2 border-b border-gray-200 hover:bg-gray-100 hover:text-indigo-700 hover:text-gray-900 ${
                i === 0
                  ? 'rounded-t-lg'
                  : i === possibleMatches.length - 1
                  ? 'rounded-b-lg'
                  : 'rounded-none'
              }`}
              key={`${possibleMatch.name}-${i}`}
              onClick={clickHandler}
            >
              {possibleMatch.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
