import { useEffect, useRef, useState } from "react";

function AnimatedSection({
  children,
  className = "",
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default AnimatedSection;
