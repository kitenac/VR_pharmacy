
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
} from '@mui/material';
// components
import Iconify from './components/iconify';
// sections
import { UserListHead, UserListToolbar } from './user_section';
import { DelModal as Del, ModifyModal, AddModal as Add } from '../components/modal';
import { ScanningMan } from '../Media';
// ----------------------------------------------------------------------

const Spinner = ({spinner_path = '/nope'}) => {
  return <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}> 
    <img src={spinner_path}/> </Box>
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}




export const InteractiveTable = (props) => {
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');



  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [modOpen, setModOpen] = useState(false)
  const [delOpen, setDelOpen] = useState(false)

      
  // params - request params that`re handling pagination and sorting. serv uses 1-based pagination 
  // btw <Paginator/> uses 0-based paging => in it`s props page = {params.page - 1}
  const [Params, setParams] = useState({
    params: {
      limit: 10,
      page: 1,
      order: ["-created_at"]},
    search: '',
  })
  
  const [curRow, setRow] = useState({})

  const [data, setData] = useState({data: {}, meta: {}})     // data - table data, meta - pagination and other stuff data
  const {data: Data, meta: Meta} = data

  const {tableName, columns, getData, endpoint, poles, blockGo, AddToHead} = props

  const refreshData = () => getData(setData, Params)

  useEffect(() => {
    console.log('new params:', Params)
    refreshData()
  }, [Params])  

  


  // Table content and colomunNames
  const USERLIST = Data
  const TABLE_HEAD = columns.map((el, i) => { return {id: i, ...el} })

  const redirect = useNavigate()
  const path = useLocation().pathname


  const handleRowClick = (event, row) => {
    console.log(`clicked on ${row.name} with data: ${row}`)
    if (!blockGo) redirect(`${path}/${row.id}`, {state: {row: row}})     // redirect + passing props (by react-navigate)
  }


  /* "page: page + 1" - why?:
        Paginator uses 0-base page-numbering 
        server    uses 1-base page-numbering  => in request`s params to server: page = newPage + 1 */
  const handleChangePage = (e, newPage) => {
    setParams({
      ...Params, 
      params:
      {
       ...Params.params,
       page: newPage + 1 }
    })
  };

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


  const handleFilterByName = (e, col) => {
    setParams({
      ...Params, 
      search: e.target.value
    })
  };

  const handleOpenMenu = (e, row) => {
    setOpen(e.currentTarget)
    setRow(row)
  };

  const handleCloseMenu = (e) => {
    setOpen(false); 
  }


  const handleRequestSort = (event, poleName) => {
    const order = [Params.params.order[0][0]==='-' ? poleName : '-'+poleName]

    setParams({...Params, params: {
      limit: 10,
      page: 1,
      order: order},
    })
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };


  
  let isNotFound = USERLIST.length === 0
  let noData = Object.keys(Meta).length === 0

  return (
    <div>
      <Container style={{ width: '60%', marginTop: '1rem' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          {AddToHead}
          <Typography variant="h3" gutterBottom>
            {tableName ? tableName : 'no_page_name'}
          </Typography>
          <Button 
           variant="contained" 
           startIcon={<Iconify icon="eva:plus-fill" />}
           onClick={() => {
            setAddOpen(true); 
            handleCloseMenu(true) // true <=> reload page - after adding new data
           }}
           >
            Добавить
          </Button>
        </Stack>
        
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={Params.search} onFilterName={handleFilterByName} />

          
            <TableContainer>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  { noData ? <Spinner spinner_path={ScanningMan}/>
                    : USERLIST.map((row, idx) => {
                    
                    const {id} = row

                    const {page, limit} = Params.params
                    const name = row['name'] ? row['name'] : row['full_name'] 

                    const content = columns.slice(2,-1)   // columns.slice(1,-1) - deleting 1-st and last cols

                    console.log('row: ', row)
                    const selectedUser = selected.indexOf(name) !== -1;


                    return (<TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser} sx={{cursor: !blockGo ? 'pointer' : 'arrow'}}>
                        
                        <TableCell align='right' sx={{width: '1rem'}}>
                          <Typography variant="subtitle3" noWrap> 
                            {`${(page-1)*limit + idx+1}.`} 
                          </Typography>
                        </TableCell>


                         <TableCell component="th" scope="row" onClick={(e) => handleRowClick(e, row)}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        
                        {content.map(({poleName}) => <TableCell onClick={(e) => handleRowClick(e, row)} 
                                                          align="left"> {row[poleName]} </TableCell>)}
                      

                      <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      
                      </TableRow>) 
                    })}

                  
                </TableBody>
                
                

                {isNotFound && !noData && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Нет совпадений
                          </Typography>

                          <Typography variant="body2">
                            Ничего не найдено по запросу &nbsp;
                            <strong>&quot;{Params.search}&quot;</strong>.
                            <br /> Попробуйте проверить регистр или вводить слова целиком.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>

        </Card>


        <TablePagination
            labelRowsPerPage='Число строк на странице'
            labelDisplayedRows={
              ({ from, to, count }) => ` ${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}` }
            
            rowsPerPageOptions={[10, 15, 25]}
            component="div"
            count={Meta.total}
            rowsPerPage={Params.params.limit}
            page={Params.params.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}            
          />

      </Container>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 150,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => {setModOpen(true); handleCloseMenu()}}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Изменить
        </MenuItem>

        <MenuItem onClick={() => {setDelOpen(true); handleCloseMenu()}}
           sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Удалить
        </MenuItem>
      </Popover>


      <Add refreshData={refreshData} poles={poles} endpoint={endpoint} isOpen={addOpen} setOpen={setAddOpen}/>
      <ModifyModal refreshData={refreshData} poles={poles} endpoint={endpoint} isOpen={modOpen} setOpen={setModOpen} row={curRow}/>
      <Del refreshData={refreshData} poles={poles} endpoint={endpoint} isOpen={delOpen} setOpen={setDelOpen} row={curRow}/>
      
    </div>
  );
}
