import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { Store } from '../../../lib/store';
import { BaseVoidEventHandler } from '../../../lib/types';
import { deleteStory } from '../../../lib/utils';
import { ConfirmDialog } from '../../../lib/utils/Dialog';

interface Story {
  name: string;
}

interface Props {
  store: Store;
  story: Story;
  onEdit: BaseVoidEventHandler;
  onSave: BaseVoidEventHandler;
}

export const DataStoryWidgetActions: FC<Props> = observer(
  ({ store, story, onEdit, onSave }) => {
    const [
      deleteConfirmationRequired,
      setDeleteConfirmationRequired,
    ] = useState(false);

    return (
      <div className="absolute top-0 right-0 m-4">
        <div className="flex space-x-2">
          <span
            title="edit story with diagram saving"
            className="text-gray-200 hover:text-malibu-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onSave();
            }}
          >
            <i className="fas fa-save"></i>
          </span>

          <span
            title="edit story"
            className="text-gray-200 hover:text-malibu-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onEdit();
            }}
          >
            <i className="fas fa-pen-square"></i>
          </span>

          <span
            title="delete story"
            className=" text-gray-200 hover:text-malibu-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setDeleteConfirmationRequired(true);
            }}
          >
            <i className="fas fa-minus"></i>
          </span>
        </div>

        <ConfirmDialog
          title="Pernamently delete story"
          description={`Are ypu sure want to delete «‎${story.name}»‎ story?`}
          open={deleteConfirmationRequired}
          setOpen={setDeleteConfirmationRequired}
          onConfirm={() => deleteStory(store, story.name)}
        />
      </div>
    );
  },
);
