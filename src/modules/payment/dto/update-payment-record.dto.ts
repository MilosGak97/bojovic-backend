import { PartialType } from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreatePaymentRecordDto } from './create-payment-record.dto';

/**
 * DTO for partially updating an existing payment record.
 *
 * All fields from {@link CreatePaymentRecordDto} are optional — include only
 * the fields you wish to change. Omitted fields are left unchanged.
 *
 * @example
 * // Mark an invoice number and set a 60-day payment term
 * {
 *   "invoiceNumber": "INV-2026-0001",
 *   "paymentTermDays": 60,
 *   "dueDate": "2026-03-16"
 * }
 */
@ApiExtraModels(CreatePaymentRecordDto)
export class UpdatePaymentRecordDto extends PartialType(CreatePaymentRecordDto) {}
