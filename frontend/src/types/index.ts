export interface WorkType {
  id: string;
  name: string;
  createdAt: string;
}

export interface WorkLog {
  id: string;
  date: string;
  volume: number;
  unit: string;
  workerName: string;
  workTypeId: string;
  workType: Pick<WorkType, 'id' | 'name'>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  errors?: string[];
  statusCode: number;
}
