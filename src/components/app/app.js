// libs
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core';
// used components
import {QuestsPage} from '../../pages/quests-page';
import { ModGroupsPage } from '../../pages/mod-groups-page';
import { ModStudentsPage } from '../../pages/mod-students-page';

import {ThemeProvider as GitsTheme} from '../../theme_from_git'

const testTheme = createTheme({
  palette: {
    primary:{
      main: '#33333'
    },
    secondary:{
      main: '#ccccc'
    }
  }
})

const App = () => {

  const defaultRedirect = () => <Navigate to='/groups' />;
  

  return (
      <GitsTheme>
      <ThemeProvider theme={testTheme}>
      <Router>
        <Routes>
          <Route exact path='/'             element={defaultRedirect()} />
          <Route exact path='/quests'       element={<QuestsPage/>}/>
          <Route exact path='/groups'       element={<ModGroupsPage/>}/>
          <Route exact path='/groups/:name' element={<ModStudentsPage/>}/>
        </Routes>

      </Router>
      </ThemeProvider>
      </GitsTheme>
  );
};

export default App;