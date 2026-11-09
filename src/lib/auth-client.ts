"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

/** Google button is only shown once real Google credentials are configured. */
export const GOOGLE_AUTH_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_AUTH === "true";
