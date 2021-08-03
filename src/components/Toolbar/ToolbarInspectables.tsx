import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Store } from '../../store';
import NodeModel from '../../diagram/models/NodeModel';

interface Props {
  store: Store;
  onClickInspectable: (node: NodeModel) => void;
  inspectableLinkStyle: (node: NodeModel) => string;
}

const ToolbarInspectables: FC<Props> = ({
  store,
  onClickInspectable,
  inspectableLinkStyle,
}) => {

  return (
    store.diagram.engine && (
      <span className="border-l ml-8 pl-8">
        {store.nodesWithInspectables().map((node) => {
          return (
            <span
              key={node.getDisplayName() + node.options.id}
              onClick={
                (e) => onClickInspectable(node)
                /* .bind(node) */
              }
              className={inspectableLinkStyle(node)}
            >
              {node.getDisplayName()}
            </span>
          );
        })}
      </span>
    )
  );
};

export default observer(ToolbarInspectables);
