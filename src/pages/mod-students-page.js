import { Head } from '../components/head';
import { InteractiveTable } from '../ContentTable/table';

import {getStudents} from '../Utils/requests' 
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material'

async function getData(setData, Params={params: {}, optional: {}}, groupID){
  const Students = await getStudents({groupID: groupID, ...Params })
  setData(Students)
}  


export const ModStudentsPage = (props) => {

    // last column('') - for 'options' pic!
    const columns = [{colName: '', poleName: ""}, {colName: 'ФИО', poleName: "full_name"}, {colName: '', poleName: ""}]

    const {row} = useLocation().state
    const crumbs = useLocation().pathname.split('/')
    const groupID = crumbs[crumbs.length-1]
    

    const poles={
      to_fill: [{
        name: 'full_name', 
        placeholder: 'Имя студента',
      }],

      readyData: {
        group_id: groupID,
      }
    }

    const redirect = useNavigate()
    const goBack = <Box 
        onClick={() => {redirect('/groups')}}>
        <Typography variant="h4" 
         color='#466EE3' 
         sx ={{cursor: 'pointer', "&:hover": {color: '#0C61F8'} }}>
            {"< Назад к группам"}
        </Typography>
    </Box>

    return <div>
               <Head/>
               <InteractiveTable tableName={'Студенты ' + row.name} blockGo={true} AddToHead={goBack}
                 endpoint='students' columns={columns} poles={poles}
                 getData={(setData, params) => getData(setData, params, groupID)} 
               />
           </div>
    

}