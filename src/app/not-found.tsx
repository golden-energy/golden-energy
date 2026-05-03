"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <main className="main-error-page">
      <div className="error-header">
        <h1>404 - Page Not Found</h1>
        <h3>{pathname} is not a valid page</h3>
        <Link className="back-to-home-button" href={"/"}>Back to Home</Link>
      </div>
      <div className="svg-container">
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="110" cy="188" rx="42" ry="10" fill="#FFF4C2" />
          <path
            d="M110 34C78 34 56 61 56 98V122C56 157 81 182 110 182C139 182 164 157 164 122V98C164 61 142 34 110 34Z"
            fill="#FFE37A"
          />
          <circle cx="88" cy="104" r="8" fill="#1F2937" />
          <circle cx="132" cy="104" r="8" fill="#1F2937" />
          <circle cx="78" cy="121" r="7" fill="#FF9DB0" opacity="0.8" />
          <circle cx="142" cy="121" r="7" fill="#FF9DB0" opacity="0.8" />
          <path
            d="M98 132C103 139 117 139 122 132"
            stroke="#1F2937"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M56 112C45 116 40 126 42 136"
            stroke="#FFE37A"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M164 112C175 116 180 126 178 136"
            stroke="#FFE37A"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </main>
  );
}
