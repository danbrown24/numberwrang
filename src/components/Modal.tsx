import { useRecoilState } from 'recoil';
import { darkModeState } from '../store';
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import classNames from 'classnames';

interface ModalProps {
  closeOnBackdropClick?: boolean;
  initialShowDelay?: number;
  onClose?: () => void;
}

const Modal = ({ closeOnBackdropClick = true, initialShowDelay = 0, onClose, children }: PropsWithChildren<ModalProps>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode] = useRecoilState(darkModeState);

  const close = useCallback(() => {
    dialogRef.current?.close();
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }
    const onBackdropClick = (event: MouseEvent) => {
      const { clientX: x, clientY: y } = event;
      const rect = dialog.getBoundingClientRect();
      const isClickWithinDialog = rect.top <= y && y <= rect.top + rect.height && rect.left <= x && x <= rect.left + rect.width;
      !isClickWithinDialog && close();
    };

    dialog.showModal();
    closeOnBackdropClick && dialog.addEventListener('click', onBackdropClick);

    return () => {
      closeOnBackdropClick && dialog.removeEventListener('click', onBackdropClick);
      dialog.close();
    };
  }, [close, closeOnBackdropClick]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsOpen(true), initialShowDelay);
    return () => clearTimeout(timeout);
  }, [initialShowDelay]);

  return (
    <dialog ref={dialogRef} className={classNames('modal', isOpen && 'open')}>
      {onClose && (
        <button className="close" onClick={onClose}>
          <IoMdClose size={24} color={darkMode ? '#fff' : '#000'} />
        </button>
      )}
      {children}
    </dialog>
  );
};

export default Modal;
