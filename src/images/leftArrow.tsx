import * as React from "react";

function LeftArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle
        cx={50}
        cy={50}
        r={50}
        transform="rotate(-180 50 50)"
        fill="#700A6B"
        fillOpacity={0.6}
      />
      <path
        d="M199 51.5a1.5 1.5 0 000-3v3zM40.94 48.94a1.5 1.5 0 000 2.12l9.545 9.547a1.5 1.5 0 102.122-2.122L44.12 50l8.486-8.485a1.5 1.5 0 10-2.122-2.122L40.94 48.94zM199 48.5H42v3h157v-3z"
        fill="#fff"
      />
    </svg>
  );
}

export default LeftArrow;
