import { CONFIG } from 'src/config-global';

import { AreaView } from 'src/sections/hierarchy/area/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Attendance - ${CONFIG.appName}`}</title>
      <AreaView />
    </>
  );
}
