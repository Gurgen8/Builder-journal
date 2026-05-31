import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, IconButton, Typography, Paper } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import { WorkLog } from '../../shared/types';
import { formatDate } from '../../shared/utils/date';

interface WorkLogsTableProps {
  logs: WorkLog[];
  isLoading: boolean;
  onEdit: (log: WorkLog) => void;
  onDelete: (id: string) => void;
}

// 1. Premium Custom Empty Overlay
const CustomNoRowsOverlay = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        py: 8,
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          borderRadius: '50%', 
          bgcolor: 'action.hover', 
          color: 'text.secondary',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <HourglassEmptyRoundedIcon sx={{ fontSize: 44 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Outfit, sans-serif' }}>
        Записи не найдены
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        В журнале пока нет записей для выбранных фильтров. Измените параметры поиска или добавьте новую запись.
      </Typography>
    </Box>
  );
};

// 2. Premium Custom Loading Overlay
const CustomLoadingOverlay = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        py: 8,
      }}
    >
      <Box sx={{ animation: 'spin 2s linear infinite', color: 'primary.main', mb: 2 }}>
        <ConstructionRoundedIcon sx={{ fontSize: 48 }} />
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
        Загрузка данных журнала...
      </Typography>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export const WorkLogsTable: React.FC<WorkLogsTableProps> = ({ logs, isLoading, onEdit, onDelete }) => {
  const columns: GridColDef<WorkLog>[] = [
    {
      field: 'date',
      headerName: 'Дата выполнения',
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<WorkLog, string>) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {formatDate(params.value || '')}
        </Typography>
      ),
    },
    {
      field: 'workType',
      headerName: 'Вид работ',
      flex: 2,
      minWidth: 260,
      valueGetter: (params) => params.row.workType?.name || '-',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'volume',
      headerName: 'Объем работ',
      flex: 1,
      minWidth: 120,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params: GridRenderCellParams<WorkLog, number>) => {
        const row = params.row;
        return (
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, justifyContent: 'flex-end', width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {params.value?.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {row.unit}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'workerName',
      headerName: 'Исполнитель',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<WorkLog, string>) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Действия',
      sortable: false,
      filterable: false,
      flex: 0.8,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<WorkLog>) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Редактировать">
            <IconButton
              color="primary"
              size="small"
              onClick={() => onEdit(params.row)}
              sx={{
                bgcolor: 'primary.light',
                '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
              }}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Удалить">
            <IconButton
              color="error"
              size="small"
              onClick={() => onDelete(params.row.id)}
              sx={{
                bgcolor: 'error.light',
                '&:hover': { bgcolor: 'error.main', color: 'error.contrastText' },
              }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.02)',
        overflow: 'hidden',
        width: '100%',
        minWidth: 0,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DataGrid
        rows={logs}
        columns={columns}
        loading={isLoading}
        autoHeight={logs.length > 0}
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          loadingOverlay: CustomLoadingOverlay,
        }}
        sx={{
          border: 'none',
          'min-height': logs.length === 0 ? '400px' : 'auto',
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'action.hover',
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
              color: 'text.secondary',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
          },
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid',
            borderColor: 'divider',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          },
          '& .MuiDataGrid-cell': {
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            borderColor: 'transparent',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.85rem',
            color: 'text.secondary',
          },
        }}
      />
    </Paper>
  );
};

// Sub-component Helper
const Tooltip: React.FC<{ children: React.ReactElement; title: string }> = ({ children, title }) => {
  return (
    <Box sx={{ cursor: 'pointer' }}>
      <Typography component="span">
        {React.cloneElement(children, { title })}
      </Typography>
    </Box>
  );
};
