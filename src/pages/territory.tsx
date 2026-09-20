import { CONFIG } from 'src/config-global';

import { TerritoryView } from 'src/sections/hierarchy/territory/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Attendance - ${CONFIG.appName}`}</title>
      <TerritoryView />
    </>
  );
}
