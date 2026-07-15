import { CONFIG } from 'src/config-global';

import { EmployeeLocationMapView} from 'src/sections/employee-location/view/employee-location-map-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`EmployeeLocation - ${CONFIG.appName}`}</title>
       <EmployeeLocationMapView />
    </>
  );
}
