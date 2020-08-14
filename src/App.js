import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import List from "./components/List";
import { ViewerProvider } from "./context/ContextWrapper";

function App() {
  return (
    <ViewerProvider>
      <List />
    </ViewerProvider>
  );
}

export default App;
