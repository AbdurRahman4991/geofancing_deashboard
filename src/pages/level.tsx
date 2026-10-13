import { CONFIG } from 'src/config-global';

import { LevelView } from 'src/sections/hierarchy/level/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Level - ${CONFIG.appName}`}</title>
      <LevelView />
    </>
  );
}
