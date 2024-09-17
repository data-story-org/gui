import React, { FC } from 'react';

interface Props {
  storyTags: string[];
}

const tagStyle =
  'inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2';

export const DataStoryWidgetTags: FC<Props> = ({
  storyTags,
}) => {
  return (
    <>
      {storyTags.map((tag: string, i) => {
        return tag ? (
          <span key={`${tag}-${i}`} className={tagStyle}>
            {tag}
          </span>
        ) : null;
      })}
    </>
  );
};
