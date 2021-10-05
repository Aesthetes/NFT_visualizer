import * as React from "react";

function OnlyArrowBack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={161}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M159 13.5a1.5 1.5 0 000-3v3zM.94 10.94a1.5 1.5 0 000 2.12l9.545 9.547a1.5 1.5 0 102.122-2.122L4.12 12l8.486-8.485a1.5 1.5 0 10-2.122-2.122L.94 10.94zM159 10.5H2v3h157v-3z"
        fill="#fff"
      />
    </svg>
  );
}

export default OnlyArrowBack;
