import { CONFIG } from 'src/config-global';

import { EmployeeView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Employee - ${CONFIG.appName}`}</title>

      <EmployeeView />
    </>
  );
}
