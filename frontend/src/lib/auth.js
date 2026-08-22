"use client";

import { useCallback, useEffect, useState } from "react";
import { api, clearToken, setToken } from "@/lib/api";

export async function loginRequest(email, password) {
  const res = await api.post("/auth/login", { email, password });
  const { user, token } = res.data;
  setToken(token);
  return user;
}

export async function registerRequest(name, email, password, confirmPassword) {
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
    confirmPassword,
  });
  const { user, token, devVerificationToken } = res.data;
  setToken(token);
  return { user, devVerificationToken };
}

export async function logoutRequest() {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore - we clear local state regardless
  } finally {
    clearToken();
  }
}

/**
 * Fetches the current user from /auth/me using the stored token.
 * Every page that needs auth state (e.g. the admin dashboard guard)
 * calls this independently - there's no app-wide provider, so nothing
 * in the existing layout needs to change.
 */
export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
      clearToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  return { user, isLoading, isAdmin: user?.role === "admin", refresh };
}
