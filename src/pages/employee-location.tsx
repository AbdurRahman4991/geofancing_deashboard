import { CONFIG } from 'src/config-global';

import { EmployeeLocationView} from 'src/sections/employee-location/view/employee-location-view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`EmployeeLocation - ${CONFIG.appName}`}</title>
      <EmployeeLocationView />
    </>
  );
}
