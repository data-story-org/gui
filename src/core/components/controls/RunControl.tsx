import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import BaseControl from './BaseControl';
import { showNotification } from '../../utils/Notifications';
import { useHotkeys } from 'react-hotkeys-hook';

const RunControl = ({ store }) => {
  useHotkeys('shift+r', () => {
    onClick();
  });

  const [id, title, icon] = [
    'run',
    'Run story',
    'fas fa-play',
  ];

  const onClick = () => {
    store.setRunning();

    store.metadata.client
      .run(store.diagram.engine.model)
      .then((response) => {
        // TRANSFER FEATURE AT NODES (INSPECTABLES)
        console.info('Diagram ran', response.data.diagram);

        response.data.diagram.nodes
          .filter((phpNode) => {
            return phpNode.features;
          })
          .forEach((phpNode) => {
            let reactNode =
              store.diagram.engine.model.getNode(
                phpNode.id,
              );
            reactNode.features = phpNode.features;
          });

        // SET FEATURE COUNT ON LINKS
        store.clearLinkLabels(); // Clear old labels
        response.data.diagram.nodes
          .map((node) => {
            return node.ports;
          })
          .flat()
          .filter((port) => {
            return port.features;
          })
          .forEach((port) => {
            let allLinks = Object.values(
              store.diagram.engine.model.layers[0].models,
            );

            allLinks
              .filter((link) => {
                return (
                  // @ts-ignore
                  link.sourcePort.options.id == port.id
                );
              })
              .forEach((link) => {
                store.diagram.engine.model
                  // @ts-ignore
                  .getLink(link.options.id)
                  .addLabel(port.features.length);
              });
          });
        showNotification({
          message: 'Successfully ran story!',
          type: 'success',
        });

        store.setNotRunning();
        store.refreshDiagram();
      })
      .catch((error) => {
        store.setNotRunning();
        showNotification({
          message:
            'Crap! Could not run story! Check console.',
          type: 'error',
        });

        throw error;
      });
  };

  return (
    <BaseControl
      id={id}
      title={title}
      icon={icon}
      onClick={onClick}
    />
  );
};

export default observer(RunControl);
