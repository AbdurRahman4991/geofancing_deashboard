// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

// import App from './app';
// import { routesSection } from './routes/sections';
// import { ErrorBoundary } from './routes/components';

// // ----------------------------------------------------------------------

// const router = createBrowserRouter([
//   {
//     Component: () => (
//       <App>
//         <Outlet />
//       </App>
//     ),
//     errorElement: <ErrorBoundary />,
//     children: routesSection,
//   },
// ]);

// const root = createRoot(document.getElementById('root')!);

// root.render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>
// );
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';
import { Provider } from 'react-redux'; // <-- ✨ এটা যোগ করতে হবে
import store from '../redux/store'       // <-- তোমার store import

import App from './app';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';

// ----------------------------------------------------------------------

const router = createBrowserRouter([
  {
    Component: () => (
      <App>
        <Outlet />
      </App>
    ),
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    {/* ✅ এখন Redux Provider দিয়ে RouterProvider কে wrap করো */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
