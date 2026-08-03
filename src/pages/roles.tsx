import { CONFIG } from 'src/config-global';

import { RoleView } from 'src/sections/roles/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Roles - ${CONFIG.appName}`}</title>
      <RoleView />
    </>
  );
}
