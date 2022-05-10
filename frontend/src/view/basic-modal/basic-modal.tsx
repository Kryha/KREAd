import React, { FC, useState } from 'react';
import Modal from '@mui/material/Modal';
import { ModalBox } from "./styles";


interface BasicModalProps {
  openTab: boolean;
  isItemCard?: boolean;
}
export const BasicModal: FC<BasicModalProps> = ({ children, openTab, isItemCard = false }) => {
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox isItemCard={isItemCard}>
          {children}
        </ModalBox>
      </Modal>
    </div>
  );
}
