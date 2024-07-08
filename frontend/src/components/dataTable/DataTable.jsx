import './dataTable.scss';
import { DataGrid, GridToolbar, esES } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const DataTable = ({
  columns, rows, rowHeight, filter,
}) => (
  <Box
    className="dataTable"
    sx={{
      display: 'flex', tableLayout: 'fixed', width: '100%', overflowY: 'auto', height: '70vh',
    }}
  >
    <DataGrid
      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
      className="dataGrid"
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      pageSizeOptions={[5, 7, 10, 15]}
      disableRowSelectionOnClick
      disableColumnFilter={!filter}
      disableColumnSelector
      disableColumnMenu
      sx={{
        minHeight: 450,
        backgroundColor: 'info.main',
        border: 'none',
        '@media print': { color: 'black' },
      }}
      {...(rowHeight && { rowHeight })}
    />
  </Box>
);

export default DataTable;
