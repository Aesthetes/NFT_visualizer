import * as React from "react";
function NotFound(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={"100%"}
      height={"100%"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <path fill="url(#prefix__pattern0)" d="M-1 0h428v926H-1z" />
      <defs>
        <pattern
          id="prefix__pattern0"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <use xlinkHref="#prefix__image0" transform="scale(.00234 .00108)" />
        </pattern>
        <image
          id="prefix__image0"
          width={428}
          height={926}
        />
      </defs>
    </svg>
  );
}
export default NotFound;