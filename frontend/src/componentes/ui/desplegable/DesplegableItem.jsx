import { Link } from "react-router";

export const DesplegableItem = ({
  tag = "button",
  to,
  onClick,
  onItemClick,
  baseClassName = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  className = "",
  children,
}) => {
  const clasesCombinadas = `${baseClassName} ${className}`.trim();

  const handleClick = (event) => {
    if (tag === "button") {
      event.preventDefault();
    }
    if (onClick) onClick();
    if (onItemClick) onItemClick();
  };

  if (tag === "a" && to) {
    return (
      <Link
        to={to}
        className={clasesCombinadas}
        onClick={handleClick}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      className={clasesCombinadas}
    >
      {children}
    </button>
  );
};