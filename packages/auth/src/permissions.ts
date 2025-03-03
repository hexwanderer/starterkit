import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  team: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  ...ownerAc.statements,
  team: ["create", "update", "delete"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  team: ["create", "update"],
});

export const member = ac.newRole({
  ...memberAc.statements,
});
