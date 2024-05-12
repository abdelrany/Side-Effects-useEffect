import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) return dialog.current.showModal();
    else return dialog.current.close();
  }, [open]);

  return createPortal(
    <dialog
      ref={dialog}
      onClose={onClose}
      className='modal'
    >
      {open ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
}
export default Modal;
