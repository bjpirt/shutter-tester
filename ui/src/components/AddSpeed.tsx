import { useState } from "react";

type Props = {
  onAddSpeed: (speed: string) => void;
};

export default function SummaryLine({ onAddSpeed }: Props) {
  const [newSpeed, setNewSpeed] = useState("");
  const [error, setError] = useState("");

  const validate = (): boolean =>
    /^\d+$/.test(newSpeed) || !!/^1 ?\/ ?\d+$/.test(newSpeed);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setError("");
      onAddSpeed(newSpeed);
      setNewSpeed("");
    } else {
      setError("Invalid format for new speed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewSpeed(e.currentTarget.value);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChange} value={newSpeed}></input>
      <span>s</span>
      <button>Add speed</button>
      {!!error ? <span>{error}</span> : undefined}
    </form>
  );
}
