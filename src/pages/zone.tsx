import { CONFIG } from 'src/config-global';

import { ZoneView } from 'src/sections/hierarchy/zone/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Attendance - ${CONFIG.appName}`}</title>
      <ZoneView />
    </>
  );
}
