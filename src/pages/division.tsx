import { CONFIG } from 'src/config-global';

import { DivisionView } from 'src/sections/hierarchy/division/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Attendance - ${CONFIG.appName}`}</title>
      <DivisionView />
    </>
  );
}
