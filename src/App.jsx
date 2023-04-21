import './App.css';
import { ThemeProvider } from './context';
import { MainLayout } from "./layouts";
import { MainRoutes } from "./routes";


function App() {
  return (

    <ThemeProvider>
      <MainLayout>
        <MainRoutes />
      </MainLayout>
    </ThemeProvider>

  );
}

export default App;
