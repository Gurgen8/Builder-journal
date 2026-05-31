import React from 'react';
import {
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListOffRoundedIcon from '@mui/icons-material/FilterListOffRounded';
import { useWorkTypes } from '../services/work-type-service';
import { WorkLogsQueryParams } from '../services/work-log-service';
import { Card } from './shared/Card';
import { Input } from './shared/Input';
import { Button } from './shared/Button';
import { TOKENS } from '../constants/tokens';

interface WorkLogFiltersProps {
  filters: WorkLogsQueryParams;
  onFiltersChange: (newFilters: WorkLogsQueryParams) => void;
}

const selectStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: TOKENS.borderRadius.small,
  },
};

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
    <Card sx={{ mb: 3, p: 2.5 }}>
      <Grid container spacing={2} alignItems="center">
        { }
        <Grid item xs={12} md={4}>
          <Input
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

        { }
        <Grid item xs={12} sm={6} md={2}>
          <Input
            label="Дата с"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate || ''}
            onChange={handleDateChange('startDate')}
          />
        </Grid>

        { }
        <Grid item xs={12} sm={6} md={2}>
          <Input
            label="Дата по"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate || ''}
            onChange={handleDateChange('endDate')}
          />
        </Grid>

        { }
        <Grid item xs={12} sm={8} md={3}>
          <FormControl fullWidth size="small" sx={selectStyles}>
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

        <Grid item xs={12} sm={4} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
          {hasActiveFilters ? (
            <Button
              variant="text"
              color="error"
              onClick={handleClearFilters}
              startIcon={<FilterListOffRoundedIcon />}
              fullWidth
              sx={{ py: 1 }}
            >
              Сбросить
            </Button>
          ) : (
            <Tooltip title="Фильтры не активны">
              <span>
                <IconButton disabled sx={{ py: 1 }}>
                  <FilterListOffRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};
