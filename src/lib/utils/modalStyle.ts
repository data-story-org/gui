export const modalStyle = {
  content: {
    maxWidth: '800px',
    top: '110px',
    left: '120px',
    padding: '0px',
    backgroundColor: '#F3F4F6',
    //top                   : '25%',
    //left                  : '25%',
    //right                 : 'auto',
    //bottom                : 'auto',
    //marginRight           : '-50%',
    //transform             : 'translate(-50%, -50%)'
  },
  overlay: {
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

export const modalDialogStyle = {
  ...modalStyle,
  content: {
    ...modalStyle.content,
    top: 'auto',
    left: 'auto',
    padding: 'auto',
    backgroundColor: 'transparent',
  },
};
