import { CONFIG } from 'src/config-global';

import { SubDistrictView } from 'src/sections/hierarchy/sub_district/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Attendance - ${CONFIG.appName}`}</title>
      <SubDistrictView />
    </>
  );
}
