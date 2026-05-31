import React from 'react';
import {
  Grid,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  InputAdornment,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListOffRoundedIcon from '@mui/icons-material/FilterListOffRounded';
import { useWorkTypes } from '../../entities/work-type/api';
import { WorkLogsQueryParams } from '../../entities/work-log/api';

interface WorkLogFiltersProps {
  filters: WorkLogsQueryParams;
  onFiltersChange: (newFilters: WorkLogsQueryParams) => void;
}

export const WorkLogFilters: React.FC<WorkLogFiltersProps> = ({ filters, onFiltersChange }) => {
  const { data: workTypes = [] } = useWorkTypes();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: event.target.value });
  };

  const handleDateChange = (field: 'startDate' | 'endDate') => (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, [field]: event.target.value || undefined });
  };

  const handleWorkTypeChange = (event: SelectChangeEvent<string>) => {
    onFiltersChange({ ...filters, workTypeId: event.target.value || undefined });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      startDate: undefined,
      endDate: undefined,
      workTypeId: undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
  };

  const hasActiveFilters = !!(filters.search || filters.startDate || filters.endDate || filters.workTypeId);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 18px 0 rgba(0, 0, 0, 0.02)',
        mb: 3,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* 1. Global Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Поиск по исполнителю или виду работ..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* 2. Date From */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            label="Дата с"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate || ''}
            onChange={handleDateChange('startDate')}
          />
        </Grid>

        {/* 3. Date To */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            label="Дата по"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate || ''}
            onChange={handleDateChange('endDate')}
          />
        </Grid>

        {/* 4. Work Type Selection */}
        <Grid item xs={12} sm={8} md={3}>
          <FormControl fullWidth>
            <InputLabel id="filter-work-type-label">Вид работ</InputLabel>
            <Select
              labelId="filter-work-type-label"
              label="Вид работ"
              value={filters.workTypeId || ''}
              onChange={handleWorkTypeChange}
            >
              <MenuItem value="">
                <em>Все виды работ</em>
              </MenuItem>
              {workTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 5. Clear Filters Action */}
        <Grid item xs={12} sm={4} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
          {hasActiveFilters ? (
            <Button
              variant="text"
              color="error"
              onClick={handleClearFilters}
              startIcon={<FilterListOffRoundedIcon />}
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Сбросить
            </Button>
          ) : (
            <Tooltip title="Фильтры не активны">
              <span>
                <IconButton disabled sx={{ py: 1.5 }}>
                  <FilterListOffRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};
