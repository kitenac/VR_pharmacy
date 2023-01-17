import { Button, Popover, TextField, Typography } from "@mui/material"
import { RowContainer, ColumnContainer } from "../shitty-lib/containers"
import { Close, Image } from "@mui/icons-material"
import { useState } from "react"

import { Add, Del, Modify } from "../Utils/requests"



const handleSubmit = (e) => {
  //refreshPage(500)
  return
}

  
export const Modal = ({isOpen, setOpen, poles,
                       hasReadyData=true, 
                       title = 'no title(', 
                       previousVal,
                       buttons = [['Ок', 'primary', () => setOpen(false)], 
                                  ['Отмена', 'gray', () => setOpen(false)]] }) => {
    
    const [Data, setData] = useState(hasReadyData ? poles.readyData : {})    // data for request
    
    return <Popover
        open={Boolean(isOpen)}
        anchorEl={isOpen}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        sx={{ background: 'rgba(0.1, 0.1, 0.1, 0.1)' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 800,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
        >
       <RowContainer style={{justifyContent: 'space-between', alignItems: 'start', paddingBottom: '1rem'}}> 
            <Typography variant="h3">{title}</Typography>
            <Close sx={{width: '40px', height: '40px', cursor: 'pointer'}}
            onClick={() => setOpen(false)}/>
        </RowContainer>

        
        <ColumnContainer>
            {hasReadyData ? 
              poles.to_fill.map((pole) => {
                return  <TextField label={previousVal ?  previousVal : pole.placeholder}
                value={previousVal ?  previousVal : pole.placeholder}
                variant="outlined"
                onChange={(e) => {
                  e.preventDefault()
                  setData({...Data, [pole.name]: e.target.value})
                }}
                sx={{width: '100%', mb: '1rem'}}/>})
             : null}
             

            <RowContainer style={{width: '100%', gap: '10px', justifyContent: 'end'}}>
              {buttons.map( ([name, color, onClick]) => <Button variant='contained'
                                                       onClick={ (e) => {onClick(Data);}} 
                                                       sx={{ borderRadius: '10px', background: color }}> 
                                                {name} </Button>)}
            </RowContainer>

        </ColumnContainer>
        

    </Popover>}




export const AddModal = ({ isOpen, setOpen, endpoint, poles, refreshData}) => {
  const buttons = [
    ['Создать', 'primary', async function(Data) {await Add(endpoint, Data); await refreshData(); setOpen(false)}], 
    ['Отмена', 'gray', () => setOpen(false)]
  ]

  let isGroup = false
  for (let el of poles.to_fill)
      if (el['name'] === 'name')
          isGroup = true

  return <Modal isOpen = {isOpen} setOpen = {setOpen}
                title={isGroup ? `Добавление группы` : 'Добавление студента'}
                poles={ poles }
                buttons = { buttons }
          />
}


export const ModifyModal = ({isOpen, setOpen, endpoint, row, poles, refreshData}) => {
  const buttons = [
    ['Применить', 'primary', async function(Data) {await Modify(endpoint, Data, row.id); await refreshData(); setOpen(false)}], 
    ['Отмена', 'gray', () => setOpen(false)]
  ]

  return <Modal isOpen = {isOpen} setOpen = {setOpen}          
                title={`Редактирование`}
                previousVal = {row.name ? row.name : row.full_name}
                poles={poles}
                buttons = { buttons }
          />
}


export const DelModal = ({isOpen, setOpen, endpoint, row, poles, refreshData}) => {
  const buttons = [
    ['Удалить', 'primary',  async function() { await Del(endpoint, row.id); await refreshData(); setOpen(false)}], 
    ['Отмена', 'gray', () => setOpen(false)]]

  return <Modal hasReadyData={false} isOpen = {isOpen} setOpen = {setOpen}
                title={`Вы, действительно, хотите удалить ${row.name ? row.name : row.full_name}?`}
                poles= { poles }
                buttons = { buttons }/>
}


