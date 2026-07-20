import { useEffect, useRef, useState } from "react";

// This component wraps content and animates it when it enters the viewport
function AnimatedElement({
  children,
  className = "",
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default AnimatedElement;
