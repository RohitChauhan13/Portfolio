import "server-only";
import "server-only";

export function hasSupabaseEnv() {
  return false;
}

export function createPublicSupabaseClient() {
  return null;
}

export function createAdminSupabaseClient() {
  return null;
}
