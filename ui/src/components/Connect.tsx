type Props = {
  onClick: () => void;
  isConnected: boolean;
};

export default function Connect({ onClick, isConnected }: Props) {
  return (
    <button onClick={onClick} className="action">
      {isConnected ? "Connected" : "Connect"}
    </button>
  );
}
