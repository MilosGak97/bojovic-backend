import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { DocumentCategory } from '../../../common/enums';

@Injectable()
export class DocumentRepository extends Repository<Document> {
  constructor(private dataSource: DataSource) {
    super(Document, dataSource.createEntityManager());
  }

  async findByLoad(loadId: string): Promise<Document[]> {
    return this.find({ where: { loadId }, order: { createdAt: 'DESC' } });
  }

  async findByBroker(brokerId: string): Promise<Document[]> {
    return this.find({ where: { brokerId }, order: { createdAt: 'DESC' } });
  }

  async findByDriver(driverId: string): Promise<Document[]> {
    return this.find({ where: { driverId }, order: { createdAt: 'DESC' } });
  }

  async findByVan(vanId: string): Promise<Document[]> {
    return this.find({ where: { vanId }, order: { createdAt: 'DESC' } });
  }

  async findByCategory(category: DocumentCategory): Promise<Document[]> {
    return this.find({ where: { category }, order: { createdAt: 'DESC' } });
  }
}
