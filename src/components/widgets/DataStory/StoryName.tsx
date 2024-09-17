import React, { FC } from 'react';

interface Props {
  storyName: string;
}

const nameStyle = 'text-black font-bold text-xl w-8/12';

export const DataStoryWidgetName: FC<Props> = ({
  storyName,
}) => {
  return <div className={nameStyle}>{storyName}</div>;
};
