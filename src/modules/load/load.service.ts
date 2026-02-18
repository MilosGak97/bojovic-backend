import { Injectable, NotFoundException } from '@nestjs/common';
import { LoadRepository } from './repositories/load.repository';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { Load } from './entities/load.entity';
import { LoadFreightDetails } from './entities/load-freight-details.entity';
import { LoadPallet } from './entities/load-pallet.entity';
import { LoadStop } from './entities/load-stop.entity';
import { LoadStatus } from '../../common/enums';

@Injectable()
export class LoadService {
  constructor(private readonly loadRepo: LoadRepository) {}

  async create(dto: CreateLoadDto): Promise<Load> {
    const load = this.loadRepo.create({
      ...dto,
      freightDetails: dto.freightDetails ? dto.freightDetails : undefined,
      pallets: dto.pallets ? dto.pallets : undefined,
      stops: dto.stops ? dto.stops : undefined,
    });
    const saved = await this.loadRepo.save(load);
    return (await this.loadRepo.findWithRelations(saved.id))!;
  }

  async findAll(options?: {
    status?: LoadStatus;
    brokerId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Load[]; total: number }> {
    const [data, total] = await this.loadRepo.findAllWithBroker(options);
    return { data, total };
  }

  async findOne(id: string): Promise<Load> {
    const load = await this.loadRepo.findWithRelations(id);
    if (!load) throw new NotFoundException(`Load ${id} not found`);
    return load;
  }

  async update(id: string, dto: UpdateLoadDto): Promise<Load> {
    const existing = await this.findOne(id);
    const { freightDetails, pallets, stops, ...scalarUpdates } = dto;

    Object.assign(existing, scalarUpdates);

    if (freightDetails !== undefined) {
      existing.freightDetails = this.loadRepo.manager.create(LoadFreightDetails, {
        ...(existing.freightDetails ?? {}),
        ...freightDetails,
        loadId: id,
      });
    }

    if (pallets !== undefined) {
      existing.pallets = pallets.map((pallet, index) =>
        this.loadRepo.manager.create(LoadPallet, {
          ...pallet,
          loadId: id,
          orderIndex: index,
        }),
      );
    }

    if (stops !== undefined) {
      existing.stops = stops.map((stop, index) =>
        this.loadRepo.manager.create(LoadStop, {
          ...stop,
          loadId: id,
          orderIndex: stop.orderIndex ?? index,
        }),
      );
    }

    const saved = await this.loadRepo.save(existing);
    return (await this.loadRepo.findWithRelations(saved.id))!;
  }

  async updateStatus(id: string, status: LoadStatus): Promise<Load> {
    await this.findOne(id);
    await this.loadRepo.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const load = await this.findOne(id);
    await this.loadRepo.remove(load);
  }
}
