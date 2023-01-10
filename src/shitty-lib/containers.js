import styled from "@emotion/styled"
import { Box } from "@mui/system"       // to manipulate MUI components

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  row-gap: 20px;
  text-align: center;
`

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  
  justify-content: center;
  align-items: center;

`