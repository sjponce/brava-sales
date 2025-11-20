import './dataTable.scss';
import { DataGrid, GridToolbar, esES } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const DataTable = ({
  columns, rows, rowHeight, filter
}) => (
  <Box
    className="dataTable"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      minHeight: '70vh',
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
      slots={{
        toolbar: GridToolbar,
        noRowsOverlay: () => null,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
          csvOptions: { disableToolbarButton: true },
          printOptions: { disableToolbarButton: true }
        },
      }}
      pageSizeOptions={[5, 7, 10, 15]}
      disableRowSelectionOnClick
      disableColumnFilter={!filter}
      disableColumnSelector
      disableColumnMenu
      disableDensitySelector
      sx={{
        height: '100%',
        backgroundColor: 'background.default',
        borderEndEndRadius: 0,
        borderEndStartRadius: 0,
        '@media print': { color: 'black' },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold',
          color: 'text.secondary',
        },
      }}
      {...(rowHeight && { rowHeight })}
    />
  </Box>
);

export default DataTable;
