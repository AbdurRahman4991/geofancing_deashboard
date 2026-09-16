import { CONFIG } from 'src/config-global';

import { DistrictView } from 'src/sections/hierarchy/district/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Attendance - ${CONFIG.appName}`}</title>
      <DistrictView />
    </>
  );
}
