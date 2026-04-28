import { apiFetch } from "@/lib/api";

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  role: string;
  created_at: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await apiFetch<CurrentUser>("/auth/me", { cache: "no-store" });
  } catch {
    return null;
  }
}
