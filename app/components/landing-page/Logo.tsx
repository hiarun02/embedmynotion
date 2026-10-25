export function Logo() {
  return (
    <span className="logo">
      <svg className="brand-logo-mark" width="38" height="38" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 8 10 4H28V24L22 28H4Z" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
        <path d="m4 8 6-4h18l-6 4Z" fill="#f5f5f5" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
        <path d="m22 8 6-4v20l-6 4Z" fill="#303030" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
        <path d="M4 8H22V28H4Z" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
        <path transform="translate(-1 1)" d="M18.9 18.3h-6.6c.35 1.35 1.4 2.1 2.9 2.1 1.05 0 1.95-.3 2.75-.9l1.05 1.85c-1.1.85-2.5 1.3-4.05 1.3-3.5 0-5.9-2.2-5.9-5.45 0-3.2 2.35-5.5 5.55-5.5 3.15 0 5.15 2.2 5.15 5.3 0 .45-.05.85-.12 1.3Zm-6.55-2.05h4.7c-.18-1.35-1.05-2.1-2.35-2.1-1.25 0-2.05.75-2.35 2.1Z" fill="#0a0a0a" />
      </svg>
      <span className="logo-wordmark">Embed My Notion</span>
    </span>
  );
}
