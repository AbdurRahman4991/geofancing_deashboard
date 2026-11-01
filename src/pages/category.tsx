import { CONFIG } from 'src/config-global';

import { CategoryView } from 'src/sections/product/category/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>

      <CategoryView />
    </>
  );
}
