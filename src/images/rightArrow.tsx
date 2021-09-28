import * as React from "react";

function RightArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx={151} cy={50} r={50} fill="#700A6B" fillOpacity={0.6} />
      <path
        d="M2 48.5a1.5 1.5 0 000 3v-3zm158.061 2.56a1.502 1.502 0 000-2.12l-9.546-9.547a1.5 1.5 0 00-2.122 2.122L156.879 50l-8.486 8.485a1.501 1.501 0 002.122 2.122l9.546-9.546zM2 51.5h157v-3H2v3z"
        fill="#fff"
      />
    </svg>
  );
}

export default RightArrow;
