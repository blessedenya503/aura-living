import React from "react";

export function PaystackLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Paystack"
    >
      <rect width="110" height="32" rx="6" fill="#0BA4DB" />
      <path
        d="M14 10H26M14 16H22M14 22H26"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <text
        x="34"
        y="21"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="13"
        fontWeight="800"
        letterSpacing="-0.3"
      >
        paystack
      </text>
    </svg>
  );
}

export function MastercardLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 38 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mastercard"
    >
      <rect width="38" height="24" rx="4" fill="#1E293B" />
      <circle cx="15" cy="12" r="7" fill="#EB001B" />
      <circle cx="23" cy="12" r="7" fill="#F79E1B" fillOpacity="0.88" />
      <path
        d="M19 6.8a7 7 0 0 0 0 10.4 7 7 0 0 0 0-10.4z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export function VisaLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Visa"
    >
      <rect width="42" height="24" rx="4" fill="#0A2540" />
      <text
        x="21"
        y="16.5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="sans-serif"
        fontSize="11"
        fontWeight="900"
        fontStyle="italic"
        letterSpacing="0.8"
      >
        VISA
      </text>
    </svg>
  );
}

export function ApplePayLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 46 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Apple Pay"
    >
      <rect width="46" height="24" rx="4" fill="#000000" />
      {/* Apple glyph */}
      <path
        d="M14.2 9.4c-.4.5-1 .8-1.7.7-.1-.7.2-1.4.6-1.8.4-.5 1.1-.8 1.7-.7.1.7-.2 1.3-.6 1.8zm.6 1c-.9 0-1.7.5-2.1.5-.4 0-1.1-.5-1.9-.5-.9 0-1.8.6-2.3 1.5-.9 1.6-.2 4 1 5.3.4.6.9 1.2 1.6 1.2.7 0 .9-.4 1.7-.4.8 0 1 .4 1.7.4.7 0 1.2-.6 1.6-1.2.5-.7.7-1.4.7-1.5-.1 0-1.3-.5-1.3-1.9 0-1.2 1-1.7 1-1.8-.6-.9-1.5-1.1-1.7-1.1z"
        fill="#FFFFFF"
      />
      <text
        x="27"
        y="16.5"
        fill="#FFFFFF"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="600"
        letterSpacing="-0.2"
      >
        Pay
      </text>
    </svg>
  );
}

export function GooglePayLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 46 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Google Pay"
    >
      <rect width="46" height="24" rx="4" fill="#FFFFFF" stroke="#E2E8F0" />
      {/* G icon */}
      <path
        d="M13.5 12c0-.3 0-.7-.1-1H9v2h2.5c-.1.6-.4 1.1-.9 1.4v1.2h1.5c.9-.8 1.4-2.1 1.4-3.6z"
        fill="#4285F4"
      />
      <path
        d="M9 16.5c1.2 0 2.2-.4 3-1.1l-1.5-1.2c-.4.3-.9.4-1.5.4-1.1 0-2.1-.8-2.4-1.8H5v1.2C5.7 15.4 7.2 16.5 9 16.5z"
        fill="#34A853"
      />
      <path
        d="M6.6 12.8c-.1-.3-.1-.6-.1-.8s0-.5.1-.8V10H5c-.4.8-.6 1.6-.6 2.8s.2 2 .6 2.8l1.6-1.2z"
        fill="#FBBC05"
      />
      <path
        d="M9 8.5c.7 0 1.3.2 1.7.7l1.3-1.3C11.2 7.2 10.2 6.7 9 6.7 7.2 6.7 5.7 7.8 5 9.2l1.6 1.2c.3-1 1.3-1.9 2.4-1.9z"
        fill="#EA4335"
      />
      <text
        x="22"
        y="15.5"
        fill="#5F6368"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="9.5"
        fontWeight="700"
      >
        Pay
      </text>
    </svg>
  );
}

export function PayPalLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PayPal"
    >
      <rect width="64" height="24" rx="4" fill="#FFC439" />
      <path
        d="M15.4 6.5h-4.1c-.3 0-.5.2-.6.5l-1.7 10.6c0 .2.1.4.3.4h2c.3 0 .5-.2.6-.5l.5-3h1.9c2.5 0 4.1-1.2 4.5-3.6.2-1.1 0-1.9-.5-2.5-.6-.6-1.6-.9-2.9-.9zm.5 3.8c-.2 1.4-1.3 1.4-2.3 1.4h-.6l.4-2.6c0-.2.2-.3.4-.3h.3c.8 0 1.5 0 1.8.4.2.2.2.6 0 1.1z"
        fill="#003087"
      />
      <text
        x="21.5"
        y="16"
        fill="#003087"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="11"
        fontWeight="900"
        fontStyle="italic"
      >
        Pay
      </text>
      <text
        x="40.5"
        y="16"
        fill="#0079C1"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="11"
        fontWeight="900"
        fontStyle="italic"
      >
        Pal
      </text>
    </svg>
  );
}

export function PaymentLogosStrip({ className = "flex items-center gap-2" }: { className?: string }) {
  return (
    <div className={className}>
      <PaystackLogo className="h-5 sm:h-6 w-auto shadow-2xs hover:scale-105 transition-transform" />
      <PayPalLogo className="h-5 sm:h-6 w-auto shadow-2xs hover:scale-105 transition-transform" />
      <VisaLogo className="h-5 sm:h-6 w-auto shadow-2xs hover:scale-105 transition-transform" />
      <MastercardLogo className="h-5 sm:h-6 w-auto shadow-2xs hover:scale-105 transition-transform" />
      <ApplePayLogo className="h-5 sm:h-6 w-auto shadow-2xs hover:scale-105 transition-transform" />
      <GooglePayLogo className="h-5 sm:h-6 w-auto shadow-2xs hover:scale-105 transition-transform" />
    </div>
  );
}
