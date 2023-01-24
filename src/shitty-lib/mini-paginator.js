import {Box, Pagination, PaginationItem} from '@mui/material'

// paginator with content(JSX-valid) inside:  <- {content} -> 
export const MiniPaginator = ({ content='', style={}, PagParams:{count=0, page=1, onChange=()=>{}} }) => <Pagination 
  count={count} page={page} 
  onChange={onChange}
  sx={{maxHeight: '20%', display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', ...style}}
  renderItem={(item) => {
    // taking only arrows and content  
    switch (item.type) {
      case 'next':
        return <PaginationItem {...item} /> 
              
      case 'previous':
        return <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
          <PaginationItem {...item}/>
          <Box> {content} </Box>
        </Box>
    
      default:
        return null
    }
  }}
/>