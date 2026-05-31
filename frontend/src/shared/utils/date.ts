import dayjs from 'dayjs';

export const formatDate = (date: string | Date | null): string => {
  if (!date) return '-';
  return dayjs(date).format('DD.MM.YYYY');
};

export const formatIsoDate = (date: Date | string | null): string => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};
