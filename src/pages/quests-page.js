import dayjs from "dayjs"         // lib to parse back`s date
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Groups } from '@mui/icons-material';
import { Box, 
         Button,
         Table,
         TableBody,
         TableCell,
         TableContainer,
         TableHead,
         TableRow, 
         TablePagination,
         Paper, 
         Tab, Tabs, ListItemButton, Typography, Pagination, PaginationItem, Backdrop, CircularProgress, Popover  } from '@mui/material'


import { getProgress, getQuests, getGroups } from '../Utils/requests';

import { Head } from '../components/head'
import { TaskMap } from "../components/taskMap"
import { MiniPaginator, RowContainer, ColumnContainer } from '../shitty-lib';

import { ScanningMan, Centrifuge, CircleDots } from "../Media";

import { noScrollBar } from "../Utils/which_browser"
import '../magic.css'

export async function questsList(setData, Params) {
  const quests = await getQuests(Params)
  setData(quests)
}



const QuestBar = ({quests = [], setQuest, PagParams}) =>{
    const [value, setValue] = useState(0)
    
    // moving bar`s underline to bar #newValue
    const handleChange = (event, newValue) => {
      setValue(newValue)
    }

    const {onChange} = PagParams
    return <MiniPaginator 
      PagParams={PagParams={ ...PagParams, onChange: (e, page) => {onChange(e, page); setValue(0)} } }
      content={
       <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{height: '4rem'}}
        >
        {quests.length > 0 ? quests.map((el) => <Tab label={ el.name } onClick={() => setQuest(el.id)} />) : null }
       </Tabs>
      }/>    
}





function StudentsTable({
  cur_quest_progress = {data: [], setData: {}}
  }){
  
  const columns = ['', 'ФИО', 'Поцент выполнения', 'Обзор подзадач', 'Время начала', 'Время завершения']


// ===============   Output table after dealing with fetching cur_quest_progress   ===============

    return (
      <TableContainer component={Paper} className="noscroll" style={{ height: 'calc(81vh - 64px)'}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((el) => <TableCell> {el} </TableCell> )}
            </TableRow>
          </TableHead>
          <TableBody>
          {
            // progress might be uniterable
            !cur_quest_progress.data[0] ? null :  
            Object.keys(cur_quest_progress.data[0]).length > 0 ? 
            cur_quest_progress.data.map(
              (quest_result, idx) => {
                const {
                  student_full_name,
                  quest_start_at,
                  quest_end_at,
                  quest_total_tasks_count,
                  quest_true_answer_count,
                  quest_false_answer_count,
                  tasks
                } = quest_result
              
                let row

                (quest_total_tasks_count === 0) ? row = [
                  student_full_name,
                  '0%',
                  '',
                  '-',
                  '-'
                ]:
                row = [
                  student_full_name,
                  (quest_false_answer_count === 0) ? '100%' : Math.round((quest_true_answer_count/quest_total_tasks_count)*100) + '%',
                  <TaskMap tasks={tasks}/>,
                  dayjs(quest_start_at).format("DD.MM.YYYY H:m:s"),
                  dayjs(quest_end_at).format("DD.MM.YYYY  H:m:s"),
                ]
              
                return <TableRow>
                  <TableCell align='right' sx={{width: '1rem'}}>
                    <Typography variant="subtitle4" noWrap> 
                      {`${idx+1}.`} 
                    </Typography>
                  </TableCell>
                  {row.map((el) => <TableCell> {el} </TableCell>)}
                </TableRow>
              }
            ) : <Spinner spinner_path={Centrifuge}/>
          }

          </TableBody>
        </Table>
      </TableContainer>
    );

}



export const card = { 
    width: '100%', 
    border: '1px solid #1A2999',
    borderRight: 0,
    borderLeft: 0,
    borderRadius: '5px', 
    bgcolor: 'rgba(0.15, 0.15, 0.15, 0.15)' }


const Spinner = ({spinner_path = '/nope'}) => {
  return <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}> 
    <img src={spinner_path}/> </Box>
}

export const Items = (items, setGroup) => {
    console.log('items: ', items)
    return (items.map((group) => {
        return <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'start'}}>
                <List style={{width: '100%'}}>
                    <ListItemButton  sx={card} id={group.id} onClick={() => {console.log(' **** set group_id:', group.id); setGroup(group.id)}}>
                        <ListItemAvatar >
                           { <Groups/> }
                        </ListItemAvatar>

                        <Typography style={{color: '#F6F7F6'}}>{group.name}</Typography>            
                    </ListItemButton>
                </List>
            </Box>} ))
}
    

const GroupBar = (props) => {
    const {groups, Paginator, setGroup} = props

    // gradient: https://cssgradient.io/
    return <ColumnContainer style={{  
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(0deg, rgba(35,123,247,1) 42%, rgba(5,82,189,0.9654062308517157) 97%)',
            width: '20%',
            height: 'calc(100vh - 64px)',
            flexWrap: 'nowrap',
            paddingBottom: '1rem', 
            paddingTop: '1rem'
            }}>
            
            <Typography variant='h4' style={{color: '#F6F7F6'}}>Группы</Typography>

            <Box sx={{'scrollbar-width': 'none', width: '90%', height: '80%' }}> 
               { groups.length > 0 ? Items(groups, setGroup) : CircleDots } 
            </Box>
            {Paginator}
            

    </ColumnContainer>
}

async function getGroupsData(setData, Params={params: null, optional: null}) {
  const groups = await getGroups(Params)
  setData(groups)
}

async function getQuestsData(setData, Params){
  const quests = await getQuests(Params)
  setData(quests)
}

async function getProgressData(setData, args = {group:{id: 'no_id'}, quest:{id: 'no_id'}}){
  const progress = await getProgress(args.group.id, args.quest.id)
  setData(progress.data)
} 



// 'calc(100% - 64px)' - bc height of <Head/> is 64px - known by expirements
export const QuestsPage = () => {

  const defaultPaginationParams = {
    params: {
      limit: 10,
      page: 1,
      order: ['-id']},
    optional: {
      search: '', 
      sort: {col: null, direction: 'asc'}
    }
  }

  // params for pagination in /groups/search
  const [Params, setParams] = useState(defaultPaginationParams)

  // same for /quests/search
  const [QuestParams, setQuestParams] = useState({ params: {...defaultPaginationParams.params, limit: 4} })


  const [groups, setGroups] = useState({data:[], meta: {}})
  const {data: Data, meta: Meta} = groups

  const [quests, setQuests] = useState({data:[], meta: {}})
  const [progress, setProgress] = useState([{}])
  const [chosen, setChosen] = useState({ group: null, quest: null })


  // init default state for chosen group`s quest progress after fetching someth
  if (!chosen.group && groups.data.length > 0 && quests.data.length > 0)
      setChosen({ group: groups.data[0], quest: quests.data[0] })
    
  // refreshing groups
  useEffect(() => {
    getGroupsData(setGroups, Params)
  }, [Params])

  // refreshing progress-table weather "chosens" are
  useEffect(() => {
    console.log('===== chosens are: ', chosen)
    if (chosen.group && chosen.quest) getProgressData(setProgress, chosen) 
  }, [chosen])

  // refreshing list of Quests on a selected page 
  useEffect(()=>{
    getQuestsData(setQuests, QuestParams)  
  }, [QuestParams])

  // refreshing progress-table after moving to another page of Quests
  useEffect(()=>{
    if (quests.data[0]) setChosen({
      ...chosen, 
      quest: {...chosen.quest, id: quests.data[0].id }
    })
  }, [quests])


  // paginator`s handlers
  const handleChangePage = (e, newPage) => {
    setParams({
      ...Params, 
      params:
      {
       ...Params.params,
       page: newPage + 1 }
    })
  }

  const handleChangeRowsPerPage = (e) => {
    setParams({
      ...Params, 
      params:
      {
       ...Params.params,
       limit: parseInt(e.target.value, 10), 
       page: 1 }
    })

  }

  // paginator for student`s progress table
  const Paginator = <TablePagination
    className="noscroll"
    labelRowsPerPage=''
    labelDisplayedRows={
      ({ from, to, count }) => ` ${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}` }
    sx={{color: '#F6F7F6', 'scrollbar-width': 'none', display: 'flex', flexWrap: 'nowrap'}}
    component="div"
    rowsPerPageOptions={[10, 15, 25]}
    count={Meta.total}
    rowsPerPage={Params.params.limit}
    page={Params.params.page - 1}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />


    const questPagParam = {
      count: quests.meta.last_page ? quests.meta.last_page : 0,
      page: quests.meta.current_page ? quests.meta.current_page : 1,
      onChange: (e, page) => setQuestParams({ ...QuestParams, params: {...QuestParams.params, page: page} })
    }
  
  return <div style={{ height: '100%' }}>
            <Head/> 
            <div style={{display: 'flex', justifyContent: 'start', alignItems: 'start'}}>
            <GroupBar groups={Data} Paginator={Paginator} 
                setGroup={(id) => setChosen({...chosen, group: {...chosen.group, id: id }}) }/>
              
            <ColumnContainer style={{ width: '100%', alignItems: 'start', padding: '1rem'}}>
                <QuestBar quests={quests.data} PagParams={questPagParam} 
                setQuest = {(id) => {
                  setProgress([{}])   // clean page before getting response => give info for spinner
                  setChosen({...chosen, quest: {...chosen.quest, id: id }})
                }}
                />
                <StudentsTable style={{ marginTop: '1rem'}} cur_quest_progress={ progress ? {data: progress} : null } />    
            </ColumnContainer>
                
            </div>
         </div>
  
}