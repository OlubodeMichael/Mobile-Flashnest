import { TouchableOpacity, Text } from "react-native";

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const variants = {
  primary: "bg-yellow-500 active:bg-yellow-600",
  secondary: "bg-gray-200 active:bg-gray-300",
  danger: "bg-red-500 active:bg-red-600",
  success: "bg-green-500 active:bg-green-600",
  outline: "border-2 border-yellow-500 bg-transparent",
};

const textColors = {
  primary: "text-white",
  secondary: "text-gray-800",
  danger: "text-white",
  success: "text-white",
  outline: "text-yellow-500",
};

export default function Button({
  children,
  onPress,
  className = "",
  size = "md",
  variant = "primary",
  disabled = false,
}) {
  const baseStyles = "rounded-lg items-center justify-center";
  const disabledStyles = disabled ? "opacity-50" : "";

  const buttonClasses = [
    baseStyles,
    sizes[size],
    variants[variant],
    disabledStyles,
    className,
  ].join(" ");

  const textClasses = ["font-semibold", textColors[variant]].join(" ");

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={buttonClasses}>
      {typeof children === "string" ? (
        <Text className={textClasses}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
