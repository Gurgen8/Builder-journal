import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { WorkLog } from '../types';
import { formatDate } from '../utils/date';
import { Card } from './shared/Card';
import { Loader } from './shared/Loader';
import { EmptyState } from './shared/EmptyState';
import { Text } from './shared/Text';
import { TOKENS } from '../constants/tokens';

interface WorkLogsTableProps {
  logs: WorkLog[];
  isLoading: boolean;
  onEdit: (log: WorkLog) => void;
  onDelete: (id: string) => void;
}

const tableStyles = {
  border: 'none',
  '& .MuiDataGrid-columnHeaders': {
    bgcolor: 'action.hover',
    borderBottom: '1px solid',
    borderColor: TOKENS.colors.divider,
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
    borderColor: TOKENS.colors.divider,
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
    borderColor: TOKENS.colors.divider,
    bgcolor: 'background.paper',
  },
  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
    fontSize: '0.85rem',
    color: 'text.secondary',
  },
};

export const WorkLogsTable: React.FC<WorkLogsTableProps> = ({ logs, isLoading, onEdit, onDelete }) => {
  const columns: GridColDef<WorkLog>[] = [
    {
      field: 'date',
      headerName: 'Дата выполнения',
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<WorkLog, string>) => (
        <Text sx={{ fontWeight: 600, color: 'text.primary' }}>
          {formatDate(params.value || '')}
        </Text>
      ),
    },
    {
      field: 'workType',
      headerName: 'Вид работ',
      flex: 2,
      minWidth: 260,
      valueGetter: (params) => params.row.workType?.name || '-',
      renderCell: (params) => (
        <Text sx={{ fontWeight: 500, color: 'text.primary' }}>
          {params.value}
        </Text>
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
            <Text sx={{ fontWeight: 700, color: 'primary.main' }}>
              {params.value?.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 3 })}
            </Text>
            <Text variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {row.unit}
            </Text>
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
        <Text sx={{ fontWeight: 500 }}>
          {params.value}
        </Text>
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
        <Box sx={{ display: 'flex', gap: 1 }}>
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
    <Card
      sx={{
        p: 0,
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
          noRowsOverlay: () => (
            <EmptyState
              title="Записи не найдены"
              description="В журнале пока нет записей для выбранных фильтров. Измените параметры поиска или добавьте новую запись."
            />
          ),
          loadingOverlay: () => <Loader message="Загрузка данных журнала..." />,
        }}
        sx={{
          ...tableStyles,
          minHeight: logs.length === 0 ? '400px' : 'auto',
        }}
      />
    </Card>
  );
};
