import * as React from "react";

function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      width={67}
      height={67}
    >
      <circle cx={33.5} cy={33.5} r={33.5} fill="#000" />
      <path
        d="M35.653 13.465h-4.32l-15.12 34.56h4.703l21.265-8.784 3.84 8.784h4.752l-15.12-34.56zM23.413 42.36l10.08-23.04 6.96 15.936-17.04 7.104z"
        fill="#fff"
      />
    </svg>
  );
}

export default Logo;
