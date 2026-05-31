import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateWorkTypeDto } from './dto/create-work-type.dto';

@Injectable()
export class WorkTypesService {
  private readonly logger = new Logger(WorkTypesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.logger.log('Fetching all work types');
    return this.prisma.workType.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async create(createWorkTypeDto: CreateWorkTypeDto) {
    const trimmedName = createWorkTypeDto.name.trim();
    this.logger.log(`Creating work type with name: "${trimmedName}"`);

    const existing = await this.prisma.workType.findUnique({
      where: { name: trimmedName },
    });

    if (existing) {
      this.logger.warn(`Work type "${trimmedName}" already exists`);
      throw new ConflictException('Вид работ с таким наименованием уже существует');
    }

    return this.prisma.workType.create({
      data: {
        name: trimmedName,
      },
    });
  }

  async remove(id: string) {
    this.logger.log(`Deleting work type with ID: ${id}`);

    const existing = await this.prisma.workType.findUnique({
      where: { id },
    });

    if (!existing) {
      this.logger.warn(`Work type with ID "${id}" not found`);
      throw new NotFoundException(`Вид работы с ID "${id}" не найден`);
    }

    return this.prisma.workType.delete({
      where: { id },
    });
  }
}
