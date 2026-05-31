import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';
import { QueryWorkLogDto } from './dto/query-work-log.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkLogsService {
  private readonly logger = new Logger(WorkLogsService.name);

  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: QueryWorkLogDto) {
    this.logger.log(`Fetching work logs with query params: ${JSON.stringify(query)}`);
    const { startDate, endDate, workTypeId, search, sortBy, sortOrder, page, limit } = query;

    const where: Prisma.WorkLogWhereInput = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    if (workTypeId) {
      where.workTypeId = workTypeId;
    }

    if (search) {
      const searchTrimmed = search.trim();
      where.OR = [
        {
          workerName: {
            contains: searchTrimmed,
            mode: 'insensitive',
          },
        },
        {
          workType: {
            name: {
              contains: searchTrimmed,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    let orderBy: Prisma.WorkLogOrderByWithRelationInput = {};
    const orderDirection = sortOrder || 'desc';

    if (sortBy === 'workType') {
      orderBy = {
        workType: {
          name: orderDirection,
        },
      };
    } else if (sortBy === 'volume' || sortBy === 'workerName' || sortBy === 'date') {
      orderBy = {
        [sortBy]: orderDirection,
      };
    } else {
      orderBy = {
        date: 'desc',
      };
    }

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [total, data] = await Promise.all([
        this.prisma.workLog.count({ where }),
        this.prisma.workLog.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            workType: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    const data = await this.prisma.workLog.findMany({
      where,
      orderBy,
      include: {
        workType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return data;
  }

  async findOne(id: string) {
    this.logger.log(`Fetching work log with ID: ${id}`);
    const log = await this.prisma.workLog.findUnique({
      where: { id },
      include: {
        workType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!log) {
      this.logger.warn(`Work log with ID "${id}" not found`);
      throw new NotFoundException(`Запись в журнале с ID "${id}" не найдена`);
    }

    return log;
  }

  async create(createWorkLogDto: CreateWorkLogDto) {
    this.logger.log(`Creating work log for worker: "${createWorkLogDto.workerName}"`);

    const workType = await this.prisma.workType.findUnique({
      where: { id: createWorkLogDto.workTypeId },
    });

    if (!workType) {
      this.logger.warn(
        `Cannot create work log: Work type with ID "${createWorkLogDto.workTypeId}" not found`,
      );
      throw new NotFoundException('Выбранный вид работы не найден в справочнике');
    }

    return this.prisma.workLog.create({
      data: {
        date: new Date(createWorkLogDto.date),
        volume: createWorkLogDto.volume,
        unit: createWorkLogDto.unit.trim(),
        workerName: createWorkLogDto.workerName.trim(),
        workTypeId: createWorkLogDto.workTypeId,
      },
      include: {
        workType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, updateWorkLogDto: UpdateWorkLogDto) {
    this.logger.log(`Updating work log with ID: ${id}`);

    await this.findOne(id);

    if (updateWorkLogDto.workTypeId) {
      const workType = await this.prisma.workType.findUnique({
        where: { id: updateWorkLogDto.workTypeId },
      });

      if (!workType) {
        this.logger.warn(
          `Cannot update work log: Work type with ID "${updateWorkLogDto.workTypeId}" not found`,
        );
        throw new NotFoundException('Выбранный вид работы не найден в справочнике');
      }
    }

    const dataToUpdate: Prisma.WorkLogUpdateInput = {};

    if (updateWorkLogDto.date) {
      dataToUpdate.date = new Date(updateWorkLogDto.date);
    }
    if (updateWorkLogDto.volume !== undefined) {
      dataToUpdate.volume = updateWorkLogDto.volume;
    }
    if (updateWorkLogDto.unit) {
      dataToUpdate.unit = updateWorkLogDto.unit.trim();
    }
    if (updateWorkLogDto.workerName) {
      dataToUpdate.workerName = updateWorkLogDto.workerName.trim();
    }
    if (updateWorkLogDto.workTypeId) {
      dataToUpdate.workType = { connect: { id: updateWorkLogDto.workTypeId } };
    }

    return this.prisma.workLog.update({
      where: { id },
      data: dataToUpdate,
      include: {
        workType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    this.logger.log(`Deleting work log with ID: ${id}`);

    await this.findOne(id);

    return this.prisma.workLog.delete({
      where: { id },
    });
  }
}
