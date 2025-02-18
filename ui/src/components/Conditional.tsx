type Props = React.PropsWithChildren & {
  display: boolean;
};

export default function Conditional({ display, children }: Props) {
  return display ? children : undefined;
}
