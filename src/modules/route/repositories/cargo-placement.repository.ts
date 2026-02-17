import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CargoPlacement } from '../entities/cargo-placement.entity';

@Injectable()
export class CargoPlacementRepository extends Repository<CargoPlacement> {
  constructor(private dataSource: DataSource) {
    super(CargoPlacement, dataSource.createEntityManager());
  }

  async findByRoute(routePlanId: string): Promise<CargoPlacement[]> {
    return this.find({
      where: { routePlanId },
      relations: ['load', 'pallet'],
      order: { loadId: 'ASC' },
    });
  }

  async findByRouteAndLoad(routePlanId: string, loadId: string): Promise<CargoPlacement[]> {
    return this.find({
      where: { routePlanId, loadId },
    });
  }

  async removeByLoad(routePlanId: string, loadId: string): Promise<void> {
    await this.delete({ routePlanId, loadId });
  }
}
