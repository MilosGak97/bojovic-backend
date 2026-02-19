// ─── Load ───────────────────────────────────────────────

/**
 * Represents the lifecycle status of a freight load from creation through delivery.
 *
 * @example 'DRAFT'
 */
export enum LoadStatus {
  /** Load has been created but not yet published to the market. */
  DRAFT = 'DRAFT',
  /** Load is publicly visible and open for carrier offers. */
  PUBLISHED = 'PUBLISHED',
  /** Active price/terms negotiation is ongoing with one or more carriers. */
  NEGOTIATING = 'NEGOTIATING',
  /** A carrier has been confirmed and the load is reserved. */
  TAKEN = 'TAKEN',
  /** Cargo is being loaded onto the vehicle at the pickup point. */
  ON_BOARD = 'ON_BOARD',
  /** Vehicle is in transit between stops. */
  IN_TRANSIT = 'IN_TRANSIT',
  /** Cargo has been successfully delivered to the final destination. */
  DELIVERED = 'DELIVERED',
  /** Load has been cancelled and is no longer active. */
  CANCELED = 'CANCELED',
  /** Carrier has reviewed the load but has chosen not to bid. */
  NOT_INTERESTED = 'NOT_INTERESTED',
}

/**
 * Source freight board or channel where a load originated.
 *
 * @example 'TRANS_EU'
 */
export enum LoadBoardSource {
  /** Load came from the Trans.eu platform. */
  TRANS_EU = 'TRANS_EU',
  /** Load came from the Timocom platform. */
  TIMOCOM = 'TIMOCOM',
  /** Load was entered manually (not tied to a board). */
  MANUAL = 'MANUAL',
  /** Load came from another board/source not explicitly listed. */
  OTHER = 'OTHER',
}

/**
 * Indicates whether a route stop is a cargo pickup or a delivery point.
 *
 * @example 'PICKUP'
 */
export enum StopType {
  /** Cargo is collected from this location. */
  PICKUP = 'PICKUP',
  /** Cargo is dropped off at this location. */
  DELIVERY = 'DELIVERY',
}

/**
 * Describes the trailer/body type required or available for a load or vehicle.
 *
 * @example 'CURTAINSIDER'
 */
export enum BodyType {
  /** Tarpaulin-sided trailer with sliding curtains for side loading. */
  CURTAINSIDER = 'CURTAINSIDER',
  /** Fully enclosed rigid-sided box trailer. */
  BOX = 'BOX',
  /** Temperature-controlled (reefer) trailer. */
  REFRIGERATED = 'REFRIGERATED',
  /** Open platform trailer with no sides or roof. */
  FLATBED = 'FLATBED',
  /** High-volume curtainsider exceeding standard height limits. */
  MEGA = 'MEGA',
  /** Extra-long or extra-high combination trailer for bulky goods. */
  JUMBO = 'JUMBO',
  /** Tank trailer for liquid or gas cargo. */
  TANKER = 'TANKER',
  /** Trailer designed to carry ISO shipping containers. */
  CONTAINER = 'CONTAINER',
  /** Low-deck trailer for oversized or heavy machinery. */
  LOW_LOADER = 'LOW_LOADER',
  /** Any trailer type not covered by the above categories. */
  OTHER = 'OTHER',
}

// ─── Payment ────────────────────────────────────────────

/**
 * Tracks the billing and settlement state of a load payment.
 *
 * @example 'PENDING'
 */
export enum PaymentStatus {
  /** Payment has not yet been invoiced. */
  PENDING = 'PENDING',
  /** An invoice has been issued and is awaiting payment. */
  INVOICED = 'INVOICED',
  /** Payment has been received and settled. */
  PAID = 'PAID',
  /** Invoice due date has passed without payment. */
  OVERDUE = 'OVERDUE',
  /** Payment amount or terms are being contested. */
  DISPUTED = 'DISPUTED',
  /** Debt has been written off as uncollectable. */
  WRITTEN_OFF = 'WRITTEN_OFF',
}

/**
 * Defines the method by which a payment is made or expected.
 *
 * @example 'BANK_TRANSFER'
 */
export enum PaymentMethod {
  /** Payment sent directly between bank accounts. */
  BANK_TRANSFER = 'BANK_TRANSFER',
  /** Invoice sold to a factoring company for early liquidity. */
  FACTORING = 'FACTORING',
  /** Physical cash payment. */
  CASH = 'CASH',
  /** Any payment method not covered by the above options. */
  OTHER = 'OTHER',
}

/**
 * ISO 4217 currency codes supported for load pricing and invoicing.
 *
 * @example 'EUR'
 */
export enum Currency {
  /** Euro — primary currency of the Eurozone. */
  EUR = 'EUR',
  /** Polish Zloty. */
  PLN = 'PLN',
  /** Czech Koruna. */
  CZK = 'CZK',
  /** British Pound Sterling. */
  GBP = 'GBP',
  /** Swiss Franc. */
  CHF = 'CHF',
  /** United States Dollar. */
  USD = 'USD',
}

// ─── Broker ─────────────────────────────────────────────

/**
 * Indicates the assessed financial or operational risk level of a freight broker.
 *
 * @example 'LOW'
 */
export enum BrokerRiskLevel {
  /** Broker has an excellent payment history and no red flags. */
  LOW = 'LOW',
  /** Broker has minor issues but is generally considered reliable. */
  MEDIUM = 'MEDIUM',
  /** Broker has notable payment delays or compliance concerns. */
  HIGH = 'HIGH',
  /** Broker poses a serious risk; proceed with caution or avoid. */
  CRITICAL = 'CRITICAL',
  /** Broker has not yet been assessed for risk. */
  UNRATED = 'UNRATED',
}

/**
 * Defines the organisational role of a contact person within a broker company.
 *
 * @example 'DISPATCHER'
 */
export enum ContactRole {
  /** Responsible for day-to-day load assignment and driver coordination. */
  DISPATCHER = 'DISPATCHER',
  /** Supervisory or account management role. */
  MANAGER = 'MANAGER',
  /** Handles invoicing, payments, and financial queries. */
  ACCOUNTING = 'ACCOUNTING',
  /** Coordinates driver schedules and availability on the broker side. */
  DRIVER_COORDINATOR = 'DRIVER_COORDINATOR',
  /** Any contact role not covered by the above options. */
  OTHER = 'OTHER',
}

// ─── Route ──────────────────────────────────────────────

/**
 * Represents the operational state of a planned route.
 *
 * @example 'ACTIVE'
 */
export enum RouteStatus {
  /** Route is live and vehicles are assigned or in transit. */
  ACTIVE = 'ACTIVE',
  /** Route is being modelled or evaluated; not yet committed. */
  SIMULATION = 'SIMULATION',
  /** Route has been completed or retired and is kept for historical reference. */
  ARCHIVED = 'ARCHIVED',
  /** Route is under construction and not yet ready for activation. */
  DRAFT = 'DRAFT',
}

/**
 * Tracks the progress of a vehicle through an individual stop on a route.
 *
 * @example 'PENDING'
 */
export enum RouteStopStatus {
  /** Stop has not yet been started. */
  PENDING = 'PENDING',
  /** Vehicle is en route to this stop. */
  EN_ROUTE = 'EN_ROUTE',
  /** Vehicle has arrived at the stop location. */
  ARRIVED = 'ARRIVED',
  /** Cargo loading operation is in progress at this stop. */
  LOADING = 'LOADING',
  /** Cargo unloading operation is in progress at this stop. */
  UNLOADING = 'UNLOADING',
  /** All operations at this stop have been finished. */
  COMPLETED = 'COMPLETED',
  /** Stop was bypassed intentionally (e.g. cargo already picked up). */
  SKIPPED = 'SKIPPED',
}

// ─── Document ───────────────────────────────────────────

/**
 * Classifies the type of an uploaded or attached document.
 *
 * @example 'CMR'
 */
export enum DocumentType {
  /** Convention on the Contract for the International Carriage of Goods by Road waybill. */
  CMR = 'CMR',
  /** Commercial invoice issued for transport services. */
  INVOICE = 'INVOICE',
  /** Proof of Delivery signed by the consignee. */
  POD = 'POD',
  /** Cargo or vehicle insurance certificate. */
  INSURANCE = 'INSURANCE',
  /** Operator, driver, or vehicle licence document. */
  LICENSE = 'LICENSE',
  /** Freight/transport order confirmation from the broker or shipper. */
  FREIGHT_ORDER = 'FREIGHT_ORDER',
  /** Customs entry or export/import declaration form. */
  CUSTOMS_DECLARATION = 'CUSTOMS_DECLARATION',
  /** ADR certificate for the carriage of dangerous goods. */
  ADR_CERTIFICATE = 'ADR_CERTIFICATE',
  /** Any document type not covered by the above categories. */
  OTHER = 'OTHER',
}

/**
 * Groups documents by the entity they belong to within the system.
 *
 * @example 'LOAD'
 */
export enum DocumentCategory {
  /** Document is associated with a freight load. */
  LOAD = 'LOAD',
  /** Document is associated with a broker company or contact. */
  BROKER = 'BROKER',
  /** Document is associated with a driver. */
  DRIVER = 'DRIVER',
  /** Document is associated with a van or trailer. */
  VAN = 'VAN',
  /** Document is associated with the carrier company itself. */
  COMPANY = 'COMPANY',
}

// ─── Van / Driver ───────────────────────────────────────

/**
 * High-level vehicle class used for planning presets and quick filtering.
 *
 * @example 'VAN_3_5T'
 */
export enum VanType {
  /** Light truck class up to 3.5 tonnes. */
  VAN_3_5T = 'VAN_3_5T',
  /** Medium truck class around 7 tonnes. */
  TRUCK_7T = 'TRUCK_7T',
  /** Standard cargo van class. */
  CARGO_VAN = 'CARGO_VAN',
}

/**
 * Describes the current operational availability of a van or trailer.
 *
 * @example 'AVAILABLE'
 */
export enum VanStatus {
  /** Van is free and ready to be assigned to a route. */
  AVAILABLE = 'AVAILABLE',
  /** Van is currently assigned to and travelling on an active route. */
  ON_ROUTE = 'ON_ROUTE',
  /** Van is undergoing scheduled or unscheduled maintenance. */
  MAINTENANCE = 'MAINTENANCE',
  /** Van has been taken out of the active fleet (broken down, sold, etc.). */
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

/**
 * Describes the current duty state of a driver.
 *
 * @example 'AVAILABLE'
 */
export enum DriverStatus {
  /** Driver is free and ready to be assigned to a route. */
  AVAILABLE = 'AVAILABLE',
  /** Driver is actively operating on an assigned route. */
  ON_ROUTE = 'ON_ROUTE',
  /** Driver is taking a mandatory rest period (e.g. EU regulations). */
  REST = 'REST',
  /** Driver is not on duty (weekend, holiday, etc.). */
  OFF_DUTY = 'OFF_DUTY',
  /** Driver is on sick leave and unavailable. */
  SICK = 'SICK',
}

// ─── Dispatch ───────────────────────────────────────────

/**
 * Tracks the scheduling and execution state of a dispatch event.
 *
 * @example 'PLANNED'
 */
export enum DispatchStatus {
  /** Dispatch has been scheduled but no resources are assigned yet. */
  PLANNED = 'PLANNED',
  /** A driver and/or van have been assigned to the dispatch. */
  ASSIGNED = 'ASSIGNED',
  /** Dispatch is currently being executed (vehicle is on the road). */
  IN_PROGRESS = 'IN_PROGRESS',
  /** All stops have been serviced and the dispatch is finished. */
  COMPLETED = 'COMPLETED',
  /** Dispatch was cancelled before or during execution. */
  CANCELED = 'CANCELED',
}

// ─── Finance ───────────────────────────────────────────

/**
 * High-level accounting category for an expense record.
 *
 * @example 'FUEL'
 */
export enum ExpenseCategory {
  FUEL = 'FUEL',
  TOLL = 'TOLL',
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  PARKING = 'PARKING',
  INSURANCE = 'INSURANCE',
  LEASING = 'LEASING',
  PERMITS = 'PERMITS',
  OFFICE = 'OFFICE',
  SOFTWARE = 'SOFTWARE',
  SALARY = 'SALARY',
  PER_DIEM = 'PER_DIEM',
  OTHER = 'OTHER',
}

/**
 * Distinguishes fixed overhead from variable and trip-linked expenses.
 *
 * @example 'VARIABLE'
 */
export enum ExpenseType {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
  TRIP_LINKED = 'TRIP_LINKED',
}

/**
 * Payroll settlement state for a driver's monthly pay record.
 *
 * @example 'PENDING'
 */
export enum DriverPayStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}
