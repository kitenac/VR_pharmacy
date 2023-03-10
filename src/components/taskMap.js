

import { Component, useEffect, useState } from 'react'
import Brightness1Icon from '@mui/icons-material/Brightness1'
import { Popover, Typography, Box, Menu, Tooltip } from '@mui/material'

import { ColumnContainer, MiniPaginator, RowContainer } from '../shitty-lib'

// just one circle 
const TaskItem = ({params = {task_name:'-', task_id: '-', answer: false}}) => {

    const [open, setOpen] = useState(false)  // open - rules where(which el) to render Backdrop
    const handleTogglePopInfo = (e) => setOpen(!open ? e.currentTarget : false)  // e.currentTarget - current(event place) DOM element
     
    const {task_name, task_id, answer} = params
    
    return <Box>

      <Tooltip title={<Typography> {task_name} </Typography>}> 
        <Brightness1Icon 
        color={answer ? 'success' : 'error'} sx={{width: '1rem', height: '1rem', 
        "&:hover": {color: 'white', cursor: 'pointer'}}} 
        onMouseOver={handleTogglePopInfo}
        key={task_id}
        />
      </Tooltip>
        
    </Box>
  }
  
  
  export const TaskMap = ({ tasks = [{task_name: '', answer: false}], limit =  6, rows_count = 2, Additinal}) => {
    
    const key_gen = (id) => `${'cool_task_el'+id+'o_0'}`

    const [Params, setParams] = useState({
      page: 1,     
      content: tasks.slice(0, limit)      
    })

    const {content} = Params

    const handleChangePage = (e, page) => {
      setParams({ 
        page: page,
        content: tasks.slice((page - 1) * limit, page * limit)
      })

    }



    let rows = []
    const sz = Math.ceil(content.length/rows_count) // size of row
    console.log('size of task-row: ', sz)
    for (let row = 0; row < rows_count; ++row)
      rows.push( content.slice(sz*row, sz*(row+1)) )




    return <Box sx={{ padding: 0, borderRadius: '4px', minHeight: '4rem', width: '15rem',
      bgcolor: 'rgba(0.05, 0.05, 0.05, 0.05)', display: 'flex', justifyContent: 'space-around'}}>
        
        <MiniPaginator 
          style={{width: '70%', alignSelf: 'end'}}
          content = <ColumnContainer style={{rowGap: '10px'}}> {
            rows.map( (row, i) => <RowContainer style={{gap: '20px'}} key={'i`m taskContainer'+key_gen(i)}> 
              {row.map(({task_name, task_id, answer}) => <TaskItem key={key_gen(task_id)} params={ {task_name, task_id, answer} }/>)} 
            </RowContainer>) }
          </ColumnContainer>
          
          PagParams={{
           count: Math.ceil(tasks.length/limit),
           page: Params.page,
           onChange: handleChangePage}
          }
        />
          
        {Additinal ?? Additinal} 
    </Box>
  }



