import { CONFIG } from 'src/config-global';

import { CountryView } from 'src/sections/hierarchy/country/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Attendance - ${CONFIG.appName}`}</title>
      <CountryView />
    </>
  );
}
