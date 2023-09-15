export interface DetailSectionActions {
  price?: number;
  onClose?: () => void;
  primary?: {
    text: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  secondary?: {
    text: string;
    onClick: () => void;
  };
}
