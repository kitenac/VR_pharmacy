// libs
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// used components
import {QuestsPage} from '../../pages/quests-page';
import { ModGroupsPage } from '../../pages/mod-groups-page';
import { ModStudentsPage } from '../../pages/mod-students-page';

import {ThemeProvider as GitsTheme} from '../../theme_from_git'


// === To modify color theme - see:  theme_from_git/palette

const App = () => {

  const defaultRedirect = () => <Navigate to='/groups' />;
  

  return (
      <GitsTheme>
      <Router>
        <Routes>
          <Route exact path='/'             element={defaultRedirect()} />
          <Route exact path='/quests'       element={<QuestsPage/>}/>
          <Route exact path='/groups'       element={<ModGroupsPage/>}/>
          <Route exact path='/groups/:name' element={<ModStudentsPage/>}/>
        </Routes>

      </Router>
      </GitsTheme>);
};

export default App;