import { CONFIG } from 'src/config-global';

import { RegionView } from 'src/sections/hierarchy/region/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Attendance - ${CONFIG.appName}`}</title>
      <RegionView />
    </>
  );
}
