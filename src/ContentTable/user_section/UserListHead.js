
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import { ArrowDownward, ArrowUpward} from '@mui/icons-material';
import ImportExportIcon from '@mui/icons-material/ImportExport';

export default function UserListHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headLabel.map(({colName, poleName, sortable, id, alignRight}) => (
          <TableCell
            key={id}
            align={alignRight ? 'right' : 'left'}
          >
            <TableSortLabel
              hideSortIcon
              onClick={sortable ? createSortHandler(poleName) : null}
            >
              {colName} 
              <Box> 
              {sortable ? order==='-created_at' ? 
                <ImportExportIcon/> : 
                order===poleName ? <ArrowUpward/> :
                order==='-'+poleName ? <ArrowDownward/> : <ImportExportIcon/> 
                : null} 
              </Box>

            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
