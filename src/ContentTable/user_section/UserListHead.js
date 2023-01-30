import PropTypes from 'prop-types';
// @mui
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import { ArrowDownward, ArrowUpward} from '@mui/icons-material';
import ImportExportIcon from '@mui/icons-material/ImportExport';
// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

UserListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};

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
