import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentRepository } from './repositories/document.repository';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './entities/document.entity';
import { DocumentCategory } from '../../common/enums';

@Injectable()
export class DocumentService {
  constructor(private readonly docRepo: DocumentRepository) {}

  async create(dto: CreateDocumentDto): Promise<Document> {
    const doc = this.docRepo.create(dto);
    return this.docRepo.save(doc);
  }

  async findOne(id: string): Promise<Document> {
    const doc = await this.docRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException(`Document ${id} not found`);
    return doc;
  }

  async findByEntity(category: DocumentCategory, entityId: string): Promise<Document[]> {
    switch (category) {
      case DocumentCategory.LOAD:
        return this.docRepo.findByLoad(entityId);
      case DocumentCategory.BROKER:
        return this.docRepo.findByBroker(entityId);
      case DocumentCategory.DRIVER:
        return this.docRepo.findByDriver(entityId);
      case DocumentCategory.VAN:
        return this.docRepo.findByVan(entityId);
      default:
        return this.docRepo.findByCategory(category);
    }
  }

  async remove(id: string): Promise<void> {
    const doc = await this.findOne(id);
    await this.docRepo.remove(doc);
  }
}
