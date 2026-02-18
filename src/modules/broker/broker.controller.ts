import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BrokerService } from './broker.service';
import { CreateBrokerCompanyDto } from './dto/create-broker-company.dto';
import { UpdateBrokerCompanyDto } from './dto/update-broker-company.dto';
import { BrokerCompany } from './entities/broker-company.entity';

@ApiTags('Brokers')
@Controller('brokers')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a broker company',
    description:
      'Registers a new freight broker company on the platform. A trust profile is automatically created for the company upon registration. The taxId must be unique across all broker companies.',
  })
  @ApiResponse({
    status: 201,
    description: 'Broker company successfully created.',
    type: BrokerCompany,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — one or more request body fields are invalid or missing.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict — a broker company with the provided taxId already exists.',
  })
  create(@Body() dto: CreateBrokerCompanyDto) {
    return this.brokerService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List or search broker companies',
    description:
      'Returns all broker companies when no query parameter is supplied. When the optional `search` query parameter is provided, performs a case-insensitive full-text search across company name, legal name, tax ID, city, and country fields.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Free-text search term to filter broker companies. Matches against company name, legal name, tax ID, city, and country.',
    example: 'Müller',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Array of broker companies matching the query (or all companies if no search term).',
    type: [BrokerCompany],
  })
  findAll(@Query('search') search?: string) {
    if (search) return this.brokerService.search(search);
    return this.brokerService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single broker company by ID',
    description:
      'Returns the full broker company record including its contacts and trust profile, identified by UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier (UUID v4) of the broker company to retrieve.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Broker company record with related contacts and trust profile.',
    type: BrokerCompany,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request — the supplied `id` is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found — no broker company exists with the given ID.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.brokerService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a broker company',
    description:
      'Partially updates a broker company identified by UUID. Only the fields supplied in the request body are modified; omitted fields retain their current values.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier (UUID v4) of the broker company to update.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Broker company successfully updated. Returns the updated record.',
    type: BrokerCompany,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request — the supplied `id` is not a valid UUID, or one or more body fields are invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found — no broker company exists with the given ID.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict — the updated taxId conflicts with an existing broker company.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBrokerCompanyDto,
  ) {
    return this.brokerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a broker company',
    description:
      'Permanently removes a broker company and all its associated contacts and trust profile from the platform. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier (UUID v4) of the broker company to delete.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    format: 'uuid',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Broker company successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request — the supplied `id` is not a valid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found — no broker company exists with the given ID.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brokerService.remove(id);
  }
}
