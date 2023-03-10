import { Button, Popover, TextField, Typography } from "@mui/material"
import { RowContainer, ColumnContainer } from "../shitty-lib/containers"
import { Close, Image} from "@mui/icons-material"
import Divider from '@mui/material/Divider';
import { useState } from "react"

import { Add, Del, Modify } from "../Utils/requests"
 

const handleSubmit = (e) => {
  //refreshPage(500)
  return
}

  
export const Modal = ({isOpen, setOpen, poles,
                       hasReadyData=true, 
                       title = 'no title(', 
                       previousVal={},
                       buttons = [['Ок', 'primary', () => setOpen(false)], 
                                  ['Отмена', 'cancel', () => setOpen(false)]] }) => {
    
    const [Data, setData] = useState(hasReadyData ? poles.readyData : {})    // data for request
    
    const key_gen = (i, name) => `${name + 'modal' + i}`
    console.log('@@@@@@@@ previous value: ', previousVal)
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
            <Typography sx={{textAlign: "center"}} variant="h3">{title}</Typography>
            <Close sx={{width: '40px', height: '40px', cursor: 'pointer'}}
            onClick={() => setOpen(false)}/>
        </RowContainer>

        
        <ColumnContainer>
            <Divider variant="middle" sx={{marginBottom: '3rem'}}/>
            {hasReadyData ? 
              poles.to_fill.map((pole, i) => {
                return  <TextField label={pole.placeholder}
                key={key_gen(i, pole.placeholder)}
                value={Data[pole.name] ? Data[pole.name] : previousVal[pole.name]}
                variant="outlined"
                onChange={(e) => {
                  e.preventDefault()
                  setData({...Data, [pole.name]: e.target.value})
                }}
                sx={{width: '100%', mb: '1rem'}}/>})
             : null}
             

            <RowContainer style={{width: '100%', gap: '10px', justifyContent: 'end'}}>
              {buttons.map( ([name, color, onClick], i) => <Button variant='contained'
                                                       color={color}
                                                       key={key_gen(i, name)+'btn'}
                                                       onClick={ (e) => {onClick(Data);}} 
                                                       sx={{ borderRadius: '10px' }}> 
                                                {name} </Button>)}
            </RowContainer>

        </ColumnContainer>
        

    </Popover>}




export const AddModal = ({ isOpen, setOpen, endpoint, poles, refreshData}) => {
  const buttons = [
    ['Создать', 'primary', async function(Data) {await Add(endpoint, Data); await refreshData(); setOpen(false)}], 
    ['Отмена', 'cancel', () => setOpen(false)]
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
    ['Отмена', 'cancel', () => setOpen(false)]
  ]

  // previousVal = {row.name ? row.name : row.full_name}
  return <Modal isOpen = {isOpen} setOpen = {setOpen}          
                title={`Редактирование`}
                previousVal = {row}
                poles={poles}
                buttons = { buttons }
          />
}


export const DelModal = ({isOpen, setOpen, endpoint, row, poles, refreshData}) => {
  const buttons = [
    ['Удалить', 'caution',  async function() { await Del(endpoint, row.id); await refreshData(); setOpen(false)}], 
    ['Отмена', 'cancel', () => setOpen(false)]]

  return <Modal hasReadyData={false} isOpen = {isOpen} setOpen = {setOpen}
                title={`Вы, действительно, хотите удалить ${row.name ? row.name : row.full_name}?`}
                poles= { poles }
                buttons = { buttons }/>
}


