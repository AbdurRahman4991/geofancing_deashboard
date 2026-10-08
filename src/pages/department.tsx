import { CONFIG } from 'src/config-global';

import { DepartmentView } from 'src/sections/department/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Department - ${CONFIG.appName}`}</title>
      <DepartmentView />
    </>
  );
}
