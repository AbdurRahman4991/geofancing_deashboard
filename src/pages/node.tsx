import { CONFIG } from 'src/config-global';

import { NodeView } from 'src/sections/hierarchy/node/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Node - ${CONFIG.appName}`}</title>
      <NodeView />
    </>
  );
}
