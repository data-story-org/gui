import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Options, useHotkeys } from 'react-hotkeys-hook';
import { BaseVoidEventHandler } from '../types';
import Modal from 'react-modal';
import { modalDialogStyle } from './modalStyle';
import { useStore } from '../store';

interface Props {
  title: string;
  description: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm?: BaseVoidEventHandler;
  onClose?: BaseVoidEventHandler;
}

type DialogButton = 'Confirm' | 'Cancel';

export const ConfirmDialog: FC<Props> = ({
  title = 'Confirm',
  description = 'Are you sure?',
  open,
  setOpen,
  onConfirm = () => {},
  onClose = () => {},
}) => {
  const store = useStore();

  let cancelButtonRef = useRef(null);
  let confirmButtonRef = useRef(null);
  const [currentButton, setCurrentButton] =
    useState<DialogButton>('Cancel');

  useEffect(() => {
    if (open) {
      store.setConfirmRequired(true);
    }

    return () => {
      store.setConfirmRequired(false);
    };
  }, [open]);

  const confirmationHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(false);

    onConfirm();
  };

  const cancelationHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(false);

    onClose();
  };

  const hotkeysOptions: Options = {
    enabled: open,
    enableOnContentEditable: false,
    enableOnTags: [],
  };

  useHotkeys(
    'enter',
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      currentButton === 'Confirm'
        ? confirmationHandler(e)
        : cancelationHandler(e);
    },
    hotkeysOptions,
  );

  useHotkeys(
    'left, right, shift+tab, tab',
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      switch (currentButton) {
        case 'Cancel':
          setCurrentButton('Confirm');
          confirmButtonRef.current.focus();
          break;
        case 'Confirm':
          setCurrentButton('Cancel');
          cancelButtonRef.current.focus();
          break;
      }
    },
    hotkeysOptions,
  );

  if (!open) return null;

  return (
    <Modal
      isOpen={true}
      show={true}
      onRequestClose={cancelationHandler}
      style={modalDialogStyle}
      closeTimeoutMS={250}
    >
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-2xl drop-shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full visible"
            aria-label="Confirm Modal"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                aria-label="Confirm"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={confirmationHandler}
                ref={confirmButtonRef}
              >
                {title}
              </button>
              <button
                type="button"
                aria-label="Cancel"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={cancelationHandler}
                ref={cancelButtonRef}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
