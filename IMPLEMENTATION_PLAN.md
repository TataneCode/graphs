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

## Phase 2: Backend Core Implementation
**Goal:** Implement repository pattern, DTOs, mappers, and base entities.

### Tasks

#### 2.1 Entity Definitions
- [ ] Create `src/series/entities/serie.entity.ts`
- [ ] Create `src/points/entities/point.entity.ts`
- [ ] Define TypeScript enums matching Prisma enums

#### 2.2 Repository Layer
- [ ] Create `src/series/repositories/series.repository.ts` (PrismaService injected)
- [ ] Create `src/points/repositories/points.repository.ts`
- [ ] Implement CRUD operations for Series
- [ ] Implement CRUD operations for Points with date range filtering

#### 2.3 DTOs and Mappers
- [ ] **Request DTOs:**
  - `CreateSerieDto`, `UpdateSerieDto`
  - `CreatePointDto`, `UpdatePointDto`
  - `PointsQueryDto` (startDate, endDate, serieIds[], qualityFilter?[])
  - `SeedDto` (count: number = 1000000, months: number = 1)
- [ ] **Response DTOs:**
  - `SerieResponseDto`
  - `PointResponseDto`
- [ ] Create mapper utility functions:
  - `SerieMapper: Serie → SerieResponseDto`
  - `PointMapper: Point → PointResponseDto`

#### 2.4 Prisma Service
- [ ] Extend PrismaClient with custom methods if needed
- [ ] Set up PrismaModule as global module

### Checkpoint 2: Backend Core Ready
**Verification:**
- [ ] Unit tests for mappers pass
- [ ] Repository methods can be called (manual test in container)
- [ ] DTOs properly validate with class-validator

---

## Phase 3: Backend API & Seed Implementation
**Goal:** Implement controllers, seed endpoint, and configure Scalar.

### Tasks

#### 3.1 Controllers
- [ ] Create `SeriesController`:
  - `GET /series` - list all series
  - `GET /series/:id` - get one serie
  - `POST /series` - create serie
  - `PUT /series/:id` - update serie
  - `DELETE /series/:id` - delete serie
- [ ] Create `PointsController`:
  - `GET /points` - query points with filters (startDate, endDate, serieIds)
  - `GET /points/:id` - get one point
  - `POST /points` - create point
  - `PUT /points/:id` - update point
  - `DELETE /points/:id` - delete point
  - Support pagination: `?skip=0&take=100`
  - Support date range: `?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z`

#### 3.2 Seed Endpoint
- [ ] Create `SeedController`:
  - `POST /seed` - generates 1,000,000 points
  - `DELETE /seed` - clear all points

#### 3.3 API Documentation
- [ ] Install and configure Scalar
- [ ] Add OpenAPI decorators to all controllers

### Checkpoint 3: Backend API Ready
**Verification:**
- [ ] All CRUD endpoints work (test with curl/Postman)
- [ ] Seed endpoint generates 1M points successfully
- [ ] Points query with date range returns correct data
- [ ] Scalar docs accessible at `/docs`

---

## Phase 4: Frontend Setup & Shared Services
**Goal:** Set up Angular project with store pattern, HTTP client, and shared UI components.

### Tasks

#### 4.1 Project Structure
#### 4.2 Models/Interfaces
#### 4.3 HTTP Client Services
#### 4.4 NgRx SignalStore
#### 4.5 Reusable UI Components
#### 4.6 Chart Library Setup
#### 4.7 Shared Utilities

### Checkpoint 4: Frontend Foundation Ready

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
| Phase 2 | ⏳ PENDING | - |
| Phase 3 | ⏳ PENDING | - |
| Phase 4 | ⏳ PENDING | - |
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

**Phase 1 is COMPLETE!**

Starting **Phase 2: Backend Core Implementation** (entities, repositories, DTOs, mappers)

---

*Plan created: 2026-07-07*
*Last updated: 2026-07-07*
*Phase 1 completed: 2026-07-07*
