import { CONFIG } from 'src/config-global';

import { GeofenchView } from 'src/sections/geofench/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Geofench - ${CONFIG.appName}`}</title>

      <GeofenchView />
    </>
  );
}
