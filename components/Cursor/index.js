import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Cursor = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    const handlePointerMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  if (!mounted) return null;

  const color = theme === "dark" ? "#ffffff" : "#000000";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: 22,
        height: 22,
        border: `1.5px solid ${color}`,
        borderRadius: "50%",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        opacity: 0.9,
        mixBlendMode: theme === "dark" ? "screen" : "normal",
      }}
    />
  );
};

export default Cursor;
