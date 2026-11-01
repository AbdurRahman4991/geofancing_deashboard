import { CONFIG } from 'src/config-global';

import { SubCategoryView } from 'src/sections/product/sub-category/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>

      <SubCategoryView />
    </>
  );
}
