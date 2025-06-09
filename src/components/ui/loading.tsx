import { CSSProperties } from "react";

type colorTypes = "blue" | "white";

interface LoadingThreeCircleProps {
  style?: CSSProperties;
  className?: string;
  size?: string;
  color?: colorTypes;
}

export const LoadingThreeCircle: React.FC<LoadingThreeCircleProps> = ({
  style,
  className = "",
  size = "1rem",
  color = "blue",
}) => {
  const dotColor = color === "white" ? "bg-white" : "bg-blue-500";

  return (
    <div
      className={`flex items-center gap-2 animate-pulse ${className}`}
      style={style}
    >
      <span className={`rounded-full ${dotColor}`} style={{ width: size, height: size }} />
      <span className={`rounded-full ${dotColor}`} style={{ width: size, height: size }} />
      <span className={`rounded-full ${dotColor}`} style={{ width: size, height: size }} />
    </div>
  );
};
