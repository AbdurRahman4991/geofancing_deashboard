export type LoggedInUser = {
  id?: number;
  name?: string;
  display_name?: string;
  displayName?: string;
  email?: string;
  company_id?: string;
  roles?: Array<string | { name?: string }>;
  avatar_url?: string;
  photo_url?: string;
  employee?: { name?: string; company_id?: string | number };
};

export function getCurrentUser(): LoggedInUser {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? (JSON.parse(storedUser) as LoggedInUser) : {};
  } catch {
    return {};
  }
}

export function hasRole(roleName: string, user = getCurrentUser()): boolean {
  const targetRole = roleName.toLowerCase().replace(/[_-]/g, ' ');
  return (user.roles ?? []).some((role) => {
    const name = typeof role === 'string' ? role : role.name;
    return name?.toLowerCase().replace(/[_-]/g, ' ') === targetRole;
  });
}

export function isSuperAdmin(user = getCurrentUser()): boolean {
  return hasRole('Super-Admin', user);
}

export function getCurrentCompanyId(user = getCurrentUser()): number {
  const companyId = Number(user.company_id ?? user.employee?.company_id);
  return Number.isInteger(companyId) && companyId > 0 ? companyId : 0;
}
