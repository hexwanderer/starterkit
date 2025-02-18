import {
  adminAc,
  createAccessControl,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/access";

const statement = {
  ...defaultStatements,
  team: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  team: ["create", "update", "delete"],
  ...ownerAc.statements,
});

export const admin = ac.newRole({
  team: ["create", "update"],
  ...adminAc.statements,
});

export const member = ac.newRole({
  ...memberAc.statements,
});
