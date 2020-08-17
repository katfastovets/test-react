import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import List from "./components/List";
import { ViewerProvider } from "./context/ContextWrapper";
import InputCreateItem from "./components/InputCreateItem/InputCreateItem";
import './App.css';

function App() {
  return (
    <ViewerProvider>
      <h1 className={'heading'}>Facts about cats</h1>
      <InputCreateItem />
      <List />
    </ViewerProvider>
  );
}

export default App;
