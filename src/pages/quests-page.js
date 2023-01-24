import dayjs from "dayjs"         // lib to parse back`s date
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Groups, ArrowDownward, ArrowUpward} from '@mui/icons-material';
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
         Tab, Tabs, ListItemButton, Typography, Pagination, PaginationItem, Backdrop, CircularProgress, Popover, Input  } from '@mui/material'


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
     
    const SetValue = (val) => localStorage.setItem("BarKey", val)
    const GetValue = () => JSON.parse(localStorage.getItem("BarKey"))

    if ( !localStorage.getItem("BarKey") ) SetValue(0)
    const Value = GetValue()

    // moving bar`s underline to bar #newValue
    const handleChange = (event, newValue) => {
      SetValue(newValue)
    }

    const key_gen = (value, id) => `${value + 'cool_id' + id}`

    console.log('value:', Value)
    const {onChange} = PagParams
    return <MiniPaginator 
      PagParams={PagParams={ ...PagParams, onChange: (e, page) => {onChange(e, page); SetValue(0)} } }
      content={
       <Tabs
        value={Value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        indicatorColor='primary'
        textColor="#101d96"
        sx={{color:"#101d96"}}
        >
        {quests.length > 0 ? quests.map((el) => <Tab 
          key={key_gen(value, el.id)} 
          sx={{height: '4rem', width: '22rem'}} 
          label={ 
            el.name 
          } 
          onClick={() => setQuest(el.id)} />) : null }
       </Tabs>
      }/>    
}


// filter in js works bad with object`s poles somehow, so here goes:
// - filtering array of objects by pole value 
const i_hate_js_filter = (arr_of_objects, val, poleName) => {
  let buff = []
  arr_of_objects.map(el => (el[poleName].toLowerCase().includes(val.toLowerCase())) ? buff.push(el) : null)
  return buff
}


function StudentsTable({
  cur_quest_progress = {data: [], setData: {}},
  }){

  const [progress, setProgress] = useState(cur_quest_progress.data)
    
  const [sortRow, setSortRow] = useState({
    i: null,
    isAsc: null
  })

  // progress.length === 0 || e.target.value === '' || e.target.value === undefined

  // sort and filter(serch)
  const handleRequestSort = (e, poleName, asc=true, fraction=[]) => {
    // handling where to use filtered progress(progress) and actual progress(cur_quest_progress)
    let buff = (progress.length === 0 || e.target.value === '') ? 
      JSON.parse(JSON.stringify(cur_quest_progress.data)):
      JSON.parse(JSON.stringify(progress))
    const [n,m] = fraction
    
    if (e.target.value){
      buff = i_hate_js_filter(buff, e.target.value, poleName)
      //buff.filter(el => el[poleName].includes(e.target.value))
    }
    else
      switch (typeof(buff[0][poleName || fraction[0]]) ){
        case "number":
          // compare by fraction n/m of poles n, m if such given(fraction = [n, m]) 
          (fraction.length === 2) ?
            buff.sort((a,b)=> asc ? parseInt((a[n]/a[m] - b[n]/b[m])*100) : parseInt((b[n]/b[m] - a[n]/a[m])*100) ):
            buff.sort((a,b) => asc ? a[poleName] - b[poleName] : b[poleName] - a[poleName])
          break
        case "string":
          const minus = !asc ? -1 : 1     // to switch sort-order
          buff.sort((a,b) => a[poleName] > b[poleName] ? minus*1 : minus*-1)
          break
      }    
    
    setProgress(buff)
    
    console.log('sorted progress table: ', buff, 'sorted by ', poleName ? poleName : 'fraction: ' + fraction, 'from table: ', progress )
  }

  
  
  useEffect(()=>{
    setSortRow({
      i: null,
      isAsc: null })
    setProgress(cur_quest_progress.data) 
    },
  [cur_quest_progress])

  const columns = [
    {colName: '', poleName: ""}, 
    {colName: 'ФИО', poleName: "student_full_name", sortable: true, isAsc: true},
    {colName: 'Процент выполнения', fraction: ["quest_true_answer_count", "quest_total_tasks_count"], sortable: true, isAsc: true},
    {colName: 'Обзор подзадач', poleName: "task_map", sortable: false},
    {colName: 'Время начала', poleName: "quest_start_at", sortable: true, isAsc: true},
    {colName: 'Время завершения', poleName: "quest_end_at", sortable: true, isAsc: true},
    ]
  


// ===============   Output table after dealing with fetching cur_quest_progress   ===============
    const key_gen = (i, poleName) => `${i+'head_id'+poleName}`

    console.log('*** table data :', progress)
    return (
      <TableContainer component={Paper} className="noscroll" style={{ height: 'calc(81vh - 64px)'}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(({colName, poleName, sortable, fraction}, i) => <TableCell 
                key={key_gen(i, poleName)} 
                 
                sx={{ cursor: sortable ? 'pointer' : 'arrow'}}> 
                
                <Box sx={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                <Box
                  onClick={sortable ? (e)=>{
                    let dir = i !== sortRow.i ? true : (sortRow.isAsc !== null ? !sortRow.isAsc : true)
                    setSortRow({ i: i, isAsc: dir})
                    handleRequestSort(e, poleName, sortRow.isAsc, fraction) } : null}> 
                  {colName}
                  {i === sortRow.i ? sortRow.isAsc ? <ArrowUpward/> : <ArrowDownward/> : sortable ? <ImportExportIcon/> : null} 
                </Box>
                
                {
                  poleName === "student_full_name" ?
                  <Input 
                    onChange={(e)=>handleRequestSort(e, poleName)}
                    placeholder='введите имя студента...'  
                  /> : null
                }
                </Box>
                
                </TableCell> )}
            </TableRow>
          </TableHead>
          <TableBody>
          {
            // progress might be uniterable
            !progress[0] ? null :  
            Object.keys(progress[0]).length > 0 ? 
            progress.map(
              (quest_result, idx) => {
                const {
                  student_full_name,
                  quest_start_at,
                  quest_end_at,
                  quest_total_tasks_count,
                  quest_true_answer_count,
                  quest_false_answer_count,
                  tasks,
                  student_id
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
                  <TaskMap 
                    tasks={tasks} 
                    Additinal=<em style={{ alignSelf: 'end', color: '#07378F'}}> {quest_true_answer_count}/{quest_total_tasks_count} </em>
                  />,
                  dayjs(quest_start_at).format("DD.MM.YYYY H:m:s"),
                  dayjs(quest_end_at).format("DD.MM.YYYY  H:m:s")
                ]
              
                return <TableRow key={student_id}>
                  <TableCell align='right' sx={{width: '1rem'}}>
                    <Typography variant="subtitle4" noWrap> 
                      {`${idx+1}.`} 
                    </Typography>
                  </TableCell>
                  {row.map((el, idx) => <TableCell key={`${student_id}_${idx}`}> {el} </TableCell>)}
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
    const key_gen = (group) => `${group.id + 'pretty_ID' + items.length}`
    return (items.map((group) => {
        return <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'start'}}>
                <List style={{width: '100%'}}>
                    <ListItemButton  sx={card} key={key_gen(group)} onClick={() => {console.log(' **** set group_id:', group.id); setGroup(group.id)}}>
                        <ListItemAvatar key={key_gen(group)+'ava'}>
                           { <Groups sx={{color: '#07378F'}}/> }
                        </ListItemAvatar>

                        <Typography key={key_gen(group)+'g_text'} style={{color: '#F6F7F6'}}>{group.name}</Typography>            
                    </ListItemButton>
                </List>
            </Box>} ))
}
    

const GroupBar = (props) => {
    //const key_gen = () => `${}`
    const {groups, Paginator, setGroup} = props

    // gradient: https://cssgradient.io/
    // old color: linear-gradient(0deg, rgba(35,123,247,1) 42%, rgba(5,82,189,0.9654062308517157) 97%)
    // red-theme: linear-gradient(0deg, rgba(150,16,34,1) 63%, rgba(219,34,53,1) 97%)
    
    return <ColumnContainer style={{  
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(0deg, rgba(0,15,67,1) 42%, rgba(0,25,89,1) 97%)',
            width: '20%',
            height: 'calc(100vh - 64px)',
            flexWrap: 'nowrap',
            paddingBottom: '1rem', 
            paddingTop: '1rem'
            }}>
            
            <Typography variant='h4' style={{color: '#F6F7F6'}}>Группы</Typography>

            <Box sx={{'scrollbar-width': 'none', width: '90%', height: '80%', overflow: 'scroll' }}> 
               { groups.length > 0 ? Items(groups, setGroup) : CircleDots } 
            </Box>
            {Paginator}
            

    </ColumnContainer>
}

async function getGroupsData(setData, Params={params: null}) {
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
    search: '', 
  }

  // params for pagination in /groups/search
  const [Params, setParams] = useState({})

  // same for /quests/search
  const [QuestParams, setQuestParams] = useState({ params: {...defaultPaginationParams.params, limit: 4} })

  const [groups, setGroups] = useState({data:[], meta: {}})
  const {data: Data, meta: Meta} = groups

  const [quests, setQuests] = useState({data:[], meta: {}})
  const [progress, setProgress] = useState([{}])
  const [chosen, setChosen] = useState({ group: null, quest: null })

  // init default state for chosen group`s quest progress after fetching someth
  // check if there`s cashed which quest/group was chosen previously
  const setChosenCashed = (val) => localStorage.setItem("chosen", JSON.stringify(val))
  const getChosenCashed = () => JSON.parse(localStorage.getItem("chosen")) 
  const cashedChosen = getChosenCashed()

  const isEmtyObj = (obj) => Object.keys(obj).length === 0

  // same for group`s list
  const setParamsCashed = (val) => localStorage.setItem("groups", JSON.stringify(val))
  const getParamsCashed = () => JSON.parse(localStorage.getItem("groups")) 
  const cashedParams = getParamsCashed()


  // handling cashing
  if (!chosen.group && !chosen.quest){
    if (cashedChosen) {setChosen(cashedChosen); console.log('cashed out!!!', getChosenCashed())}
    else if (groups.data.length > 0 && quests.data.length > 0) setChosen({group: groups.data[0], quest: quests.data[0]})
  }
  
  if (isEmtyObj(Params)){
    cashedParams ? setParams(cashedParams) :
    setParams({
      ...defaultPaginationParams,
      params: {...defaultPaginationParams.params, order: ["-created_at"]}}) 
  } 
  
  console.log('am i wrong?', Object.keys(Params).length === 0, Boolean(cashedParams))
  
  // refreshing groups
  useEffect(() => {
    setParamsCashed(Params)
    getGroupsData(setGroups, Params)
  }, [Params])

  // refreshing progress-table weather "chosens" are
  useEffect(() => {

    console.log('===== chosens are: ', chosen)
    if (chosen.group && chosen.quest) {
      getProgressData(setProgress, chosen)
      localStorage.setItem("chosen", JSON.stringify(chosen))
    } 
  }, [chosen])

  // refreshing list of Quests on a selected page 
  useEffect(()=>{
    getQuestsData(setQuests, QuestParams)  
  }, [QuestParams])



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


  console.log('params now: ', Params, isEmtyObj(Params))

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
    rowsPerPage={!isEmtyObj(Params) ? Params.params.limit : 0}
    page={!isEmtyObj(Params) ? Params.params.page - 1 : 0}
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
                <StudentsTable 
                  style={{ marginTop: '1rem'}} 
                  cur_quest_progress={ progress ? {data: progress} : null } 
            />    
            </ColumnContainer>
                
            </div>
         </div>
  
}