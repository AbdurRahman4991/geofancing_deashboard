import { CONFIG } from 'src/config-global';

import { AttendanceRoleView } from 'src/sections/attendance-roles/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`AttendanceRole - ${CONFIG.appName}`}</title>

      <AttendanceRoleView />
    </>
  );
}
