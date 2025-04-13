import clsx from "clsx";

// ==================================================
interface SwitchProps {
  value: boolean;
  onChange: () => void;
}
// ==================================================

export default function Switch({ value, onChange }: SwitchProps) {
  return (
    <div className="pricing-switchers" onClick={onChange}>
      <div className={clsx({ "pricing-switcher": true, "pricing-switcher-active": !value })} />
      <div className={clsx({ "pricing-switcher": true, "pricing-switcher-active": value })} />
      <div className="switcher-button bg-primary" />
    </div>
  );
}
