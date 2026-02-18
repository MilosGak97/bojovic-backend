import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Load } from '../entities/load.entity';
import { LoadStatus } from '../../../common/enums';

@Injectable()
export class LoadRepository extends Repository<Load> {
  constructor(private dataSource: DataSource) {
    super(Load, dataSource.createEntityManager());
  }

  async findWithRelations(id: string): Promise<Load | null> {
    return this.findOne({
      where: { id },
      relations: ['broker', 'brokerContact', 'plannerVan', 'stops', 'freightDetails', 'pallets'],
    });
  }

  async findAllWithBroker(options?: {
    status?: LoadStatus;
    brokerId?: string;
    limit?: number;
    offset?: number;
  }): Promise<[Load[], number]> {
    const qb = this.createQueryBuilder('load')
      .distinct(true)
      .leftJoinAndSelect('load.broker', 'broker')
      .leftJoinAndSelect('load.brokerContact', 'brokerContact')
      .leftJoinAndSelect('load.plannerVan', 'plannerVan')
      .leftJoinAndSelect('load.freightDetails', 'freight')
      .leftJoinAndSelect('load.stops', 'stops')
      .leftJoinAndSelect('load.pallets', 'pallets')
      .orderBy('load.createdAt', 'DESC')
      .addOrderBy('stops.orderIndex', 'ASC')
      .addOrderBy('pallets.orderIndex', 'ASC');

    if (options?.status) {
      qb.andWhere('load.status = :status', { status: options.status });
    }
    if (options?.brokerId) {
      qb.andWhere('load.brokerId = :brokerId', { brokerId: options.brokerId });
    }
    if (options?.limit) {
      qb.take(options.limit);
    }
    if (options?.offset) {
      qb.skip(options.offset);
    }

    return qb.getManyAndCount();
  }

  async findByReferenceNumber(ref: string): Promise<Load | null> {
    return this.findOne({
      where: { referenceNumber: ref },
      relations: ['broker', 'brokerContact', 'plannerVan', 'freightDetails'],
    });
  }
}
