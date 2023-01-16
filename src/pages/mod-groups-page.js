import { useEffect, useState } from 'react';

import { Head } from '../components/head';
import { InteractiveTable } from '../ContentTable/table';
import {getGroups} from '../Utils/requests' 



// setData - setter for useState`s pole
export async function getData(setData, Params) {
  const groups = await getGroups(Params)
  
  groups.data.map((group) => {return group.countStudents = group.students.length})
  setData(groups)
}


export const ModGroupsPage = () => {
    
    // last column('') - for 'options' pic!
    const columns = [
      {colName: '', poleName: '', sortable: false},
      {colName: 'Код группы', poleName: "name", sortable: true},
      {colName: 'Число студентов', poleName: 'countStudents', sortable: false},
      {colName: 'Почта группы', poleName: 'email', sortable: true},
      {colName: '', poleName: '', sortable: false}]

    const poles={
      to_fill: [{
        name: 'name', 
        placeholder: 'Название группы'}],
      
      readyData: {}
    }

    return <div>
               <Head/>
               <InteractiveTable tableName='Группы' endpoint='groups' columns={columns} poles={poles}
                                 getData={(setData, params) => getData(setData, params)}
                                 />
           </div>
    

}