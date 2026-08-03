import { CONFIG } from 'src/config-global';

import { PermissionView } from 'src/sections/permissions/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Roles - ${CONFIG.appName}`}</title>
      <PermissionView />
    </>
  );
}
