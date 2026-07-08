# GRAPHS Project Implementation Plan

## Overview

Implement a graphing benchmarking application with backend (NestJS + Prisma + MySQL) and frontend (Angular 21) to compare three charting libraries (ECharts, Highcharts, SciChart) displaying analogic and all-or-nothing signals from flower series data.

**Key Decisions from User:**
- Flower types: Generic names (Rose, Tulip, Daisy, Lily, Orchid, Sunflower, Violet, Lavender, Poppy, Jasmine)
- Seed: POST /seed endpoint (manual trigger)
- Chart display: All three libraries simultaneously side-by-side
- Data volume: Client decides (frontend can request pagination/aggregation)
- Quality handling: Display all with different colors
- Threshold logic: Strictly greater than (value > threshold → 1, else 0)

---

## Phase 1: Project Setup & Infrastructure ✅ COMPLETED
**Goal:** Establish project structure, Docker environment, and database schema.

**Completion Date:** 2026-07-07

### Tasks

#### 1.1 Project Structure
- [x] Create root directory: `graphs/`
- [x] Initialize monorepo structure (optional) or separate backend/frontend folders
- [x] Create `docker-compose.yml` with MySQL service
- [x] Create Dockerfile for backend (NestJS)
- [x] Create Dockerfile for frontend (Angular 21)

#### 1.2 Backend Setup
- [x] Initialize NestJS project: `graphs-api/`
- [x] Install dependencies: `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`, `prisma`, `@prisma/client`, `mysql2`, `class-validator`, `class-transformer`, `@nestjs/swagger`, `@nestjs/config`
- [x] Configure TypeScript, ESLint, Prettier
- [x] Set up Prisma with MySQL connection

#### 1.3 Database Schema
- [x] Define Prisma schema (`prisma/schema.prisma`):
  ```prisma
  enum FlowerType {
    ROSE
    TULIP
    DAISY
    LILY
    ORCHID
    SUNFLOWER
    VIOLET
    LAVENDER
    POPPY
    JASMINE
  }
  
  enum Quality {
    GOOD
    DEGRADED
    ERROR
  }
  
  model Serie {
    id          Int       @id @default(autoincrement())
    type        FlowerType @unique
    description String    @db.VarChar(256)
    points      Point[]
    createdAt   DateTime  @default(now()) @db.Timestamp(6)
    updatedAt   DateTime  @updatedAt @db.Timestamp(6)
    @@map("series")
  }
  
  model Point {
    id           Int      @id @default(autoincrement())
    serieId      Int
    serie       Serie    @relation(fields: [serieId], references: [id], onDelete: Cascade)
    creationDate DateTime @db.Timestamp(6)
    value        Decimal  @db.Decimal(10, 5)
    quality      Quality
    @@map("points")
    @@index([serieId])
    @@index([creationDate])
    @@index([quality])
  }
  ```
- [x] Run Prisma migration to create database tables
- [x] Create `.env` for database connection string
- [x] Create `prisma.config.ts` for Prisma 7 configuration

#### 1.4 Frontend Setup
- [x] Initialize Angular 21 project: `graphs-front/`
- [x] Install dependencies: `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router`, `@ngrx/signals`, `@ngrx/entity`, `rxjs`, `echarts`, `highcharts`, `scichart`
- [x] Install dev dependencies: `vitest`, `@analogjs/vitest-angular`, `@analogjs/platform`, `@analogjs/vite-plugin-angular`, `vite`, `vite-tsconfig-paths`, `jsdom`
- [x] Configure Vite + Angular with @analogjs
- [x] Set up proxy configuration for API calls

#### 1.5 Docker Configuration
- [x] `docker-compose.yml` with MySQL, API, and Frontend services
- [x] `docker-compose.override.yml` for development
- [x] Dockerfile for API (multi-stage build)
- [x] Dockerfile for Frontend (multi-stage with Vite + Nginx)

#### 1.6 Testing Configuration
- [x] Backend: Vitest configured with TypeScript ESLint
- [x] Frontend: Vitest configured with @analogjs/vitest-angular
- [x] Test setup files created for both projects
- [x] Backend: 3 test passing (app.controller.spec.ts)

#### 1.7 Lint & Format Configuration
- [x] Backend: ESLint (flat config) + Prettier configured
- [x] Frontend: ESLint (flat config) + Prettier configured
- [x] Both projects pass lint and format:check

#### 1.8 Project Configuration
- [x] Root `.gitignore` configured
- [x] `.env.example` created with all environment variables

### Checkpoint 1: Infrastructure Ready ✅
**Verification:**
- [x] Project structure created
- [x] Docker Compose configuration working
- [x] Database schema defined (Prisma 7)
- [x] Backend builds successfully
- [x] Frontend builds successfully
- [x] Backend tests pass (3 tests)
- [x] Frontend Vitest configuration verified
- [x] Both projects pass lint and format checks
- [x] Root .gitignore configured

**Deliverables:**
- Complete project structure (`graphs/`, `graphs-api/`, `graphs-front/`)
- Docker Compose setup with MySQL, API, Frontend
- Prisma schema with Series and Points models
- Backend: NestJS with Prisma, ConfigModule, health endpoints
- Frontend: Angular 21 with Vite, Vitest, chart libraries
- ESLint + Prettier for both projects
- Root .gitignore

---

## Phase 2: Backend Core Implementation ✅ COMPLETED
**Goal:** Implement repository pattern, DTOs, mappers, and base entities.

**Completion Date:** 2026-07-08

### Tasks

#### 2.1 Entity Definitions
- [x] Create `src/series/entities/serie.entity.ts`
- [x] Create `src/points/entities/point.entity.ts`
- [x] Define TypeScript enums matching Prisma enums in `src/common/enums/`

#### 2.2 Repository Layer
- [x] Create `src/series/repositories/series.repository.ts` (PrismaService injected)
- [x] Create `src/points/repositories/points.repository.ts`
- [x] Implement CRUD operations for Series
- [x] Implement CRUD operations for Points with date range filtering

#### 2.3 DTOs and Mappers
- [x] **Request DTOs:**
  - `CreateSerieDto`, `UpdateSerieDto`
  - `CreatePointDto`, `UpdatePointDto`
  - `PointsQueryDto` (startDate, endDate, serieIds[], qualityFilter?[])
  - `SeedDto` (count: number = 1000000, months: number = 1)
- [x] **Response DTOs:**
  - `SerieResponseDto`
  - `PointResponseDto`
- [x] Create mapper utility functions:
  - `SerieMapper: Serie → SerieResponseDto`
  - `PointMapper: Point → PointResponseDto`

#### 2.4 Prisma Service
- [x] Extend PrismaClient with custom methods if needed
- [x] Set up PrismaModule as global module (already completed in Phase 1)

### Checkpoint 2: Backend Core Ready ✅
**Verification:**
- [x] Unit tests for mappers pass (6 tests for each mapper)
- [x] Repository methods can be called (build successful)
- [x] DTOs properly validate with class-validator (24 DTO tests)

---

## Phase 3: Backend API & Seed Implementation ✅ COMPLETED
**Goal:** Implement controllers, seed endpoint, and configure API documentation.

**Completion Date:** 2026-07-08

### Tasks

#### 3.1 Controllers
- [x] Create `SeriesController`:
  - `GET /series` - list all series
  - `GET /series/:id` - get one serie
  - `POST /series` - create serie
  - `PUT /series/:id` - update serie
  - `DELETE /series/:id` - delete serie
- [x] Create `PointsController`:
  - `GET /points` - query points with filters (startDate, endDate, serieIds)
  - `GET /points/:id` - get one point
  - `POST /points` - create point
  - `PUT /points/:id` - update point
  - `DELETE /points/:id` - delete point
  - Support pagination: `?skip=0&take=100`
  - Support date range: `?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z`

#### 3.2 Seed Endpoint
- [x] Create `SeedService` with data generation logic:
  - Generates 1,000,000 points distributed evenly across 10 flower series
  - Creates sine wave pattern with noise for realistic analog values
  - Random quality assignment (GOOD, DEGRADED, ERROR)
  - Time-based distribution across specified timeframe
- [x] Create `SeedController`:
  - `POST /seed` - generates 1,000,000 points (configurable count and months)
  - `DELETE /seed` - clear all points

#### 3.3 API Documentation
- [x] Configured Swagger with `@nestjs/swagger` package
- [x] Added OpenAPI decorators to all controllers:
  - `@ApiTags()` for endpoint grouping
  - `@ApiOperation()` for endpoint descriptions
  - `@ApiResponse()` for response schemas
  - `@ApiBody()`, `@ApiParam()`, `@ApiQuery()` for parameter documentation
- [x] Swagger UI accessible at `/api`

### Checkpoint 3: Backend API Ready ✅
**Verification:**
- [x] All CRUD endpoints implemented with proper HTTP methods
- [x] Seed endpoint generates realistic test data
- [x] Points query with date range and filters implemented
- [x] Swagger documentation configured and accessible
- [x] Unit tests for all controllers pass (21 tests)
- [x] Project builds successfully

---

## Phase 4: Frontend Setup & Shared Services ✅ COMPLETED
**Goal:** Set up Angular project with store pattern, HTTP client, and shared UI components.

**Completion Date:** 2026-07-08

### Tasks

#### 4.1 Project Structure
- [x] Created organized folder structure (`core/`, `shared/`, `pages/`)
- [x] Set up core module with models, services, stores, utilities
- [x] Set up shared module with reusable components
- [x] Created pages module for feature pages

#### 4.2 Models/Interfaces
- [x] Created TypeScript enums for `FlowerType` with labels and colors
- [x] Created TypeScript enums for `Quality` with labels and colors
- [x] Defined interfaces for `Serie`, `Point`, `SeedRequest/Response`
- [x] Created comprehensive model types for API request/response

#### 4.3 HTTP Client Services
- [x] Implemented `BaseApiService` with common HTTP methods
- [x] Created `SeriesApiService` with CRUD operations and mapping
- [x] Created `PointsApiService` with filtering and pagination support
- [x] Created `SeedApiService` for database seeding and clearing
- [x] Configured API base URL and environment settings

#### 4.4 NgRx SignalStore
- [x] Implemented `SeriesStore` with CRUD, selection, filtering
- [x] Implemented `PointsStore` with query building, pagination, filtering by date/series/quality
- [x] Implemented `SeedStore` for database seeding operations
- [x] Integrated stores with API services using rxMethod
- [x] Added state management for loading, error, and data states

#### 4.5 Reusable UI Components
- [x] Created `DatePickerComponent` for date/time inputs
- [x] Created `CheckboxComponent` for boolean selection
- [x] Created `DropdownComponent` for single selection from options
- [x] Created `ButtonComponent` with variants (primary, secondary, success, danger, outline, ghost) and sizes
- [x] Added proper styling, accessibility, and state management

#### 4.6 Chart Library Setup
- [x] Created `BaseChartComponent` with common chart configuration and data preparation
- [x] Implemented `EchartsChartComponent` with line/bar/scatter support, zoom, pan, tooltips
- [x] Implemented `HighchartsChartComponent` with responsive charts, zooming, tooltips
- [x] Implemented `ScichartChartComponent` with datetime axes, zoom/pan modifiers
- [x] Added quality-based coloring for data points
- [x] Implemented consistent color schemes across all chart libraries

#### 4.7 Shared Utilities
- [x] Created `DateUtils` for date formatting, parsing, manipulation
- [x] Created `DataUtils` for filtering, transformation, all-or-nothing conversion
- [x] Added helper functions for data grouping, sampling, aggregation

#### 4.8 Pages Implementation
- [x] Created `AnalogicPage` (Page 1) with:
  - Date range selection (start/end date)
  - Flower types checkboxes for multi-selection
  - Seed database button
  - Clear data button
  - Three simultaneous charts (ECharts, Highcharts, SciChart)
  - Statistics display (points loaded, series selected)
- [x] Created `AllOrNothingPage` (Page 2) with:
  - Date range selection
  - Flower type dropdown for single selection
  - Threshold input field
  - Quality filters checkboxes
  - Three simultaneous charts with all-or-nothing signal transformation
  - Statistics display (points processed, above/below threshold)

#### 4.9 Routing & App Configuration
- [x] Configured Angular routing with lazy loading support
- [x] Added navigation between pages
- [x] Updated app component with header, navigation, and footer
- [x] Configured HttpClientModule and dependency injection

#### 4.10 Testing
- [x] Created unit tests for `DateUtils` (11 tests)
- [x] Created unit tests for `DataUtils` (14 tests)
- [x] Created unit tests for `FlowerType` enum (3 tests)
- [x] All 28 tests passing

### Checkpoint 4: Frontend Foundation Ready ✅
**Verification:**
- [x] Angular project builds successfully with Vite
- [x] All chart libraries integrated and functional
- [x] HTTP client services properly configured
- [x] SignalStore state management working
- [x] UI components reusable and styled
- [x] Pages functional with forms and charts
- [x] Unit tests passing (28 tests)
- [x] Navigation between pages working

**Deliverables:**
- Complete frontend project structure
- TypeScript models and interfaces
- HTTP client services for all API endpoints
- NgRx SignalStore for state management
- Reusable UI components library
- Chart components for all three libraries
- Two functional pages with forms and charts
- Unit tests for utilities

---

## Phase 5: Frontend Page 1 - Simple Analogic
**Goal:** Implement the first page with form and three simultaneous charts.

### Checkpoint 5: Page 1 Complete

---

## Phase 6: Frontend Page 2 - All-or-Nothing
**Goal:** Implement the second page with different form and transformed data.

### Checkpoint 6: Page 2 Complete

---

## Phase 7: Testing & Polish
**Goal:** Comprehensive testing, performance optimization, and final polish.

### Checkpoint 7: Production Ready

---

## Progress Summary

| Phase | Status | Completion Date |
|-------|--------|-----------------|
| Phase 1 | ✅ COMPLETED | 2026-07-07 |
| Phase 2 | ✅ COMPLETED | 2026-07-08 |
| Phase 3 | ✅ COMPLETED | 2026-07-08 |
| Phase 4 | ✅ COMPLETED | 2026-07-08 |
| Phase 5 | ⏳ PENDING | - |
| Phase 6 | ⏳ PENDING | - |
| Phase 7 | ⏳ PENDING | - |

---

## Timeline Estimate

| Phase | Estimated Duration |
|-------|-------------------|
| Phase 1 | 1-2 days |
| Phase 2 | 2-3 days |
| Phase 3 | 2-3 days |
| Phase 4 | 2-3 days |
| Phase 5 | 2-3 days |
| Phase 6 | 1-2 days |
| Phase 7 | 2-3 days |
| **Total** | **12-19 days** |

---

## Next Steps

**Phase 1, 2, 3 & 4 are COMPLETE!**

**Phase 4 Summary:**
- Created comprehensive frontend project structure with core, shared, features, pages modules
- Implemented TypeScript interfaces/models for Series, Points, Quality, FlowerType, and Seed
- Built HTTP Client Services (BaseApiService, SeriesApiService, PointsApiService, SeedApiService) with proper request/response handling
- Set up NgRx SignalStore for state management (SeriesStore, PointsStore, SeedStore) with CRUD operations, filtering, pagination
- Created reusable UI components (DatePicker, Checkbox, Dropdown, Button) with proper styling and accessibility
- Configured chart library components (ECharts, Highcharts, SciChart) with base chart component supporting analogic and all-or-nothing signals
- Implemented shared utilities (DateUtils, DataUtils) for date formatting, filtering, transformation
- Created Page 1 (Simple Analogic) with date range selection, flower type checkboxes, seed functionality, and three chart displays
- Created Page 2 (All-or-Nothing) with flower dropdown, threshold input, quality filters, and three chart displays
- Updated routing and app configuration with proper navigation

**Frontend Status:** ✅ Build successful, functionality implemented, ready for testing

Starting **Phase 5: Testing & Polish** (Comprehensive testing, performance optimization)

---

*Plan created: 2026-07-07*
*Last updated: 2026-07-08*
*Phase 1 completed: 2026-07-07
*Phase 2 completed: 2026-07-08
*Phase 3 completed: 2026-07-08
*Phase 4 completed: 2026-07-08
