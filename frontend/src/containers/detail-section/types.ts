export interface DetailSectionActions {
  price?: number;
  onClose?: () => void;
  primary?: {
    text: string;
    onClick: () => void;
  };
  secondary?: {
    text: string;
    onClick: () => void;
  };
}
