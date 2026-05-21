import { exec, newId, queryOne } from "../db/index.js";
import { orgDisplayNameFromDomain } from "./email.js";

export type OrgRow = { id: string; name: string; status: string };

export async function resolveOrgForDomain(domain: string): Promise<OrgRow> {
  let org = await queryOne<OrgRow>(
    `SELECT id, name, status FROM organisations WHERE domain = $1`,
    [domain],
  );

  if (!org) {
    const orgId = newId();
    const name = orgDisplayNameFromDomain(domain);
    await exec(
      `INSERT INTO organisations (id, name, domain, status) VALUES ($1, $2, $3, $4)`,
      [orgId, name, domain, "active"],
    );
    org = { id: orgId, name, status: "active" };
  } else if (org.status === "pending") {
    await exec(`UPDATE organisations SET status = 'active' WHERE id = $1`, [org.id]);
    org = { ...org, status: "active" };
  }

  return org;
}
