import "server-only";
import { config } from "../config";
import { authProblem, getSession, type SssSession } from "../sss-auth";

/**
 * Who may open /dashboard: someone signed in with SSS (scope `business`) who picked
 * this site's business on the consent screen. Their SSS role is enforced by SSS itself
 * on every write (writes use their own token, see actions.ts).
 */
export type DashboardAccess =
  | { ok: true; session: SssSession; storeId: string; role: string }
  | { ok: false; reason: "off" | "signed_out" | "wrong_business" | "no_business"; detail?: string; session?: SssSession };

export async function dashboardAccess(): Promise<DashboardAccess> {
  const problem = authProblem();
  if (problem) return { ok: false, reason: "off", detail: problem };
  const session = await getSession();
  if (!session) return { ok: false, reason: "signed_out" };
  const business = session.user.business;
  if (!business) return { ok: false, reason: "no_business", session };
  if (config.storeSlug && business.slug !== config.storeSlug) return { ok: false, reason: "wrong_business", session, detail: business.name };
  return { ok: true, session, storeId: business.id, role: business.role ?? "member" };
}

export const ROLE_LABEL: Record<string, string> = { owner: "Propriétaire", manager: "Gérant(e)", staff: "Équipe", member: "Membre" };
