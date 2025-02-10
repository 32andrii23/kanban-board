import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RouterKey, routerKeyToComponentMap } from '@/constants';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {Object.entries(RouterKey).map(([key, path]) => {
          return (
            <Route
              key={key}
              path={path}
              element={routerKeyToComponentMap[path as RouterKey]}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
