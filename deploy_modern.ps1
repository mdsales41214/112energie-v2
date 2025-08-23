# =====================================================
# 112 ENERGIE V2 - MODERN ENTERPRISE WEBDEV STRUCTURE
# Best Practices 2024-2025 | Integrates Existing Setup
# =====================================================

$currentDir = "C:\Users\Erik\Desktop\112-energie-v1\112-energie 23-08-2025"
$newBaseDir = "C:\Users\Erik\Desktop\112-energie-v1\112-energie 23-08-2025\112V2AAA"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      112 ENERGIE V2 - MODERN ENTERPRISE STRUCTURE       ║" -ForegroundColor Cyan
Write-Host "║           WebDev Best Practices 2024-2025               ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Create base directory
if (!(Test-Path $newBaseDir)) {
    New-Item -ItemType Directory -Path $newBaseDir -Force | Out-Null
    Write-Host "[✓] Created base: 112V2AAA" -ForegroundColor Green
}

Set-Location $newBaseDir

# =====================================================
# MODERN STRUCTURE WITH EXISTING INTEGRATION
# =====================================================

Write-Host "[1/6] Creating Modern Web Development Structure..." -ForegroundColor Yellow

$modernStructure = @{
    # DEVELOPMENT - Modern separation
    "00_Development" = @(
        # Frontend - Modern React/Next.js structure
        "Frontend\main-app\src\components\common",
        "Frontend\main-app\src\components\features\energy",
        "Frontend\main-app\src\components\features\billing",
        "Frontend\main-app\src\components\features\dashboard",
        "Frontend\main-app\src\pages\api",
        "Frontend\main-app\src\pages\auth",
        "Frontend\main-app\src\pages\dashboard",
        "Frontend\main-app\src\layouts",
        "Frontend\main-app\src\hooks",
        "Frontend\main-app\src\utils",
        "Frontend\main-app\src\services\api",
        "Frontend\main-app\src\services\auth",
        "Frontend\main-app\src\store\slices",
        "Frontend\main-app\src\styles\components",
        "Frontend\main-app\src\styles\globals",
        "Frontend\main-app\src\assets\images",
        "Frontend\main-app\src\assets\fonts",
        "Frontend\main-app\src\assets\icons",
        "Frontend\main-app\public\static",
        "Frontend\main-app\tests\unit",
        "Frontend\main-app\tests\integration",
        "Frontend\main-app\tests\e2e",
        "Frontend\main-app\config",
        
        # Micro-frontends
        "Frontend\micro-services\customer-portal",
        "Frontend\micro-services\admin-panel",
        "Frontend\micro-services\partner-dashboard",
        
        # Mobile
        "Frontend\mobile\react-native\src",
        "Frontend\mobile\react-native\assets",
        "Frontend\mobile\react-native\tests",
        
        # Backend - Microservices architecture
        "Backend\services\auth-service\src",
        "Backend\services\auth-service\tests",
        "Backend\services\energy-service\src",
        "Backend\services\energy-service\tests",
        "Backend\services\billing-service\src",
        "Backend\services\billing-service\tests",
        "Backend\services\notification-service\src",
        "Backend\services\api-gateway\src",
        "Backend\services\api-gateway\config",
        "Backend\shared\middleware",
        "Backend\shared\utils",
        "Backend\shared\models",
        "Backend\database\migrations",
        "Backend\database\seeds",
        "Backend\database\schemas",
        
        # Infrastructure as Code
        "Infrastructure\terraform\environments\dev",
        "Infrastructure\terraform\environments\staging",
        "Infrastructure\terraform\environments\prod",
        "Infrastructure\terraform\modules",
        "Infrastructure\kubernetes\manifests",
        "Infrastructure\kubernetes\helm-charts",
        "Infrastructure\docker\services",
        "Infrastructure\ansible\playbooks",
        
        # CI/CD
        "DevOps\pipelines\github-actions",
        "DevOps\pipelines\azure-devops",
        "DevOps\scripts\deployment",
        "DevOps\scripts\testing",
        "DevOps\monitoring\grafana",
        "DevOps\monitoring\prometheus",
        
        # Design System
        "Design\ui-kit\components",
        "Design\ui-kit\tokens",
        "Design\ui-kit\patterns",
        "Design\mockups\desktop",
        "Design\mockups\mobile",
        "Design\brand\logos",
        "Design\brand\guidelines"
    )
}

# Create modern development structure
foreach ($mainFolder in $modernStructure.Keys) {
    foreach ($subPath in $modernStructure[$mainFolder]) {
        $fullPath = Join-Path $newBaseDir "$mainFolder\$subPath"
        if (!(Test-Path $fullPath)) {
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        }
    }
}
Write-Host "  ✓ Modern development structure created" -ForegroundColor Green

# =====================================================
# COPY EXISTING STRUCTURE (01-12 folders)
# =====================================================

Write-Host "[2/6] Migrating existing enterprise structure..." -ForegroundColor Yellow

$existingFolders = @(
    "01_Organization",
    "02_Operations", 
    "03_Technology",
    "04_Projects",
    "05_Products",
    "06_Clients",
    "07_Marketing",
    "08_Sales",
    "09_Documentation",
    "10_Resources",
    "11_Security",
    "12_Backup"
)

foreach ($folder in $existingFolders) {
    $source = Join-Path $currentDir $folder
    $dest = Join-Path $newBaseDir $folder
    
    if (Test-Path $source) {
        Write-Host "  → Copying $folder..." -ForegroundColor Gray
        Copy-Item -Path $source -Destination $dest -Recurse -Force
    }
}
Write-Host "  ✓ Existing structure migrated" -ForegroundColor Green

# =====================================================
# MIGRATE EXISTING WEB FILES TO NEW STRUCTURE
# =====================================================

Write-Host "[3/6] Migrating web assets to modern structure..." -ForegroundColor Yellow

# Copy existing web files to new structure
$migrations = @{
    "$currentDir\index.html" = "$newBaseDir\00_Development\Frontend\main-app\public\index.html"
    "$currentDir\sw.js" = "$newBaseDir\00_Development\Frontend\main-app\public\sw.js"
    "$currentDir\assets\css\style.css" = "$newBaseDir\00_Development\Frontend\main-app\src\styles\legacy\style.css"
    "$currentDir\assets\js\script.js" = "$newBaseDir\00_Development\Frontend\main-app\src\scripts\legacy\script.js"
}

foreach ($source in $migrations.Keys) {
    if (Test-Path $source) {
        $dest = $migrations[$source]
        $destDir = Split-Path $dest -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item -Path $source -Destination $dest -Force
        Write-Host "  → Migrated: $(Split-Path $source -Leaf)" -ForegroundColor Gray
    }
}
Write-Host "  ✓ Web assets migrated" -ForegroundColor Green

# =====================================================
# CREATE CONFIGURATION FILES
# =====================================================

Write-Host "[4/6] Creating configuration files..." -ForegroundColor Yellow

# package.json for main app
$packageJson = @'
{
  "name": "112-energie-platform",
  "version": "2.0.0",
  "description": "112 Energie - Smart Energy Platform",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write .",
    "storybook": "storybook dev -p 6006"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@reduxjs/toolkit": "^1.9.0",
    "axios": "^1.6.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "jest": "^29.7.0",
    "@storybook/react": "^7.5.0"
  }
}
'@
$packageJson | Out-File "$newBaseDir\00_Development\Frontend\main-app\package.json" -Encoding UTF8

# Docker Compose for development
$dockerCompose = @'
version: '3.8'

services:
  # Frontend
  frontend:
    build: ./00_Development/Frontend/main-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - ./00_Development/Frontend/main-app:/app
  
  # API Gateway
  api-gateway:
    build: ./00_Development/Backend/services/api-gateway
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
  
  # Auth Service
  auth-service:
    build: ./00_Development/Backend/services/auth-service
    ports:
      - "8081:8081"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
  
  # Energy Service
  energy-service:
    build: ./00_Development/Backend/services/energy-service
    ports:
      - "8082:8082"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
  
  # Database
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=energie_db
      - POSTGRES_USER=energie_user
      - POSTGRES_PASSWORD=secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
'@
$dockerCompose | Out-File "$newBaseDir\docker-compose.yml" -Encoding UTF8

# README for the new structure
$readmeContent = @'
# 112 Energie V2 - Modern Enterprise Platform

## 🏗️ Architecture Overview

### Frontend Structure
- **Main App**: Next.js 14 with TypeScript
- **Micro-frontends**: Customer Portal, Admin Panel, Partner Dashboard
- **Mobile**: React Native cross-platform app
- **Design System**: Shared UI components and tokens

### Backend Structure
- **Microservices**: Auth, Energy, Billing, Notifications
- **API Gateway**: Central routing and authentication
- **Database**: PostgreSQL with migrations
- **Cache**: Redis for performance

### DevOps & Infrastructure
- **CI/CD**: GitHub Actions / Azure DevOps
- **IaC**: Terraform for cloud resources
- **Containers**: Docker & Kubernetes
- **Monitoring**: Grafana + Prometheus

## 🚀 Quick Start

```bash
# Install dependencies
cd 00_Development/Frontend/main-app
npm install

# Run development environment
docker-compose up

# Run tests
npm test

# Build for production
npm run build
```

## 📁 Directory Structure

```
112V2AAA/
├── 00_Development/          # All development code
│   ├── Frontend/            # Client applications
│   ├── Backend/             # Server services
│   ├── Infrastructure/      # IaC and configs
│   ├── DevOps/             # CI/CD and monitoring
│   └── Design/             # UI/UX assets
├── 01_Organization/         # Company structure
├── 02_Operations/          # Business operations
├── 03_Technology/          # Tech documentation
├── 04_Projects/            # Project management
├── 05_Products/            # Product information
├── 06_Clients/             # Client data
├── 07_Marketing/           # Marketing materials
├── 08_Sales/               # Sales resources
├── 09_Documentation/       # All documentation
├── 10_Resources/           # Shared resources
├── 11_Security/            # Security policies
└── 12_Backup/              # Backup storage
```

## 🔧 Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL, Redis
- **Mobile**: React Native
- **DevOps**: Docker, Kubernetes, GitHub Actions
- **Cloud**: Azure / AWS
- **Monitoring**: Grafana, Prometheus
- **Testing**: Jest, Cypress, Storybook

## 📊 Development Workflow

1. **Feature Development**: Create branch from `develop`
2. **Testing**: Unit, Integration, E2E tests
3. **Code Review**: PR review process
4. **CI/CD**: Automated deployment to staging
5. **Production**: Manual approval for production

## 🔐 Environment Variables

Create `.env.local` files in each service directory:

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_AUTH_DOMAIN=auth.112energie.nl

# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

## 📞 Contact

- **Tech Lead**: tech@112energie.nl
- **DevOps**: devops@112energie.nl
- **Support**: support@112energie.nl
'@
$readmeContent | Out-File "$newBaseDir\README.md" -Encoding UTF8

Write-Host "  ✓ Configuration files created" -ForegroundColor Green

# =====================================================
# CREATE NAVIGATION HELPER
# =====================================================

Write-Host "[5/6] Creating navigation helper..." -ForegroundColor Yellow

$navV2 = @'
# 112 Energie V2 Navigation Helper
param([string]$to = "help")

$base = "C:\Users\Erik\Desktop\112-energie-v1\112-energie 23-08-2025\112V2AAA"

$locations = @{
    "home" = $base
    "dev" = "$base\00_Development"
    "frontend" = "$base\00_Development\Frontend\main-app"
    "backend" = "$base\00_Development\Backend\services"
    "infra" = "$base\00_Development\Infrastructure"
    "devops" = "$base\00_Development\DevOps"
    "org" = "$base\01_Organization"
    "ops" = "$base\02_Operations"
    "tech" = "$base\03_Technology"
    "projects" = "$base\04_Projects"
    "products" = "$base\05_Products"
    "clients" = "$base\06_Clients"
    "marketing" = "$base\07_Marketing"
    "sales" = "$base\08_Sales"
    "docs" = "$base\09_Documentation"
    "help" = "show"
}

if ($to -eq "help" -or $to -eq "show") {
    Write-Host ""
    Write-Host "112 ENERGIE V2 - Navigation" -ForegroundColor Cyan
    Write-Host "=============================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Development:" -ForegroundColor Yellow
    Write-Host "  dev      - Development root"
    Write-Host "  frontend - Frontend application"
    Write-Host "  backend  - Backend services"
    Write-Host "  infra    - Infrastructure code"
    Write-Host "  devops   - CI/CD & monitoring"
    Write-Host ""
    Write-Host "Business:" -ForegroundColor Yellow
    Write-Host "  org      - Organization"
    Write-Host "  ops      - Operations"
    Write-Host "  products - Products"
    Write-Host "  clients  - Clients"
    Write-Host "  marketing- Marketing"
    Write-Host "  sales    - Sales"
    Write-Host ""
    Write-Host "Other:" -ForegroundColor Yellow
    Write-Host "  tech     - Technology"
    Write-Host "  projects - Projects"
    Write-Host "  docs     - Documentation"
    Write-Host ""
} else {
    if ($locations.ContainsKey($to)) {
        if ($locations[$to] -ne "show") {
            Set-Location $locations[$to]
            Write-Host "📁 Navigated to: $to" -ForegroundColor Green
            Get-ChildItem -Directory | Select-Object -First 10 | Format-Table Name
        }
    } else {
        Write-Host "Unknown location. Use: .\nav.ps1 help" -ForegroundColor Red
    }
}
'@
$navV2 | Out-File "$newBaseDir\nav.ps1" -Encoding UTF8

Write-Host "  ✓ Navigation helper created" -ForegroundColor Green

# =====================================================
# CREATE DEVELOPMENT STARTER FILES
# =====================================================

Write-Host "[6/6] Creating starter files..." -ForegroundColor Yellow

# Create a Next.js page example
$nextPage = @'
import React from 'react';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

export default function Dashboard() {
  const [energyData, setEnergyData] = useState(null);

  useEffect(() => {
    // Fetch energy data
    fetchEnergyData();
  }, []);

  const fetchEnergyData = async () => {
    try {
      const response = await fetch('/api/energy/current');
      const data = await response.json();
      setEnergyData(data);
    } catch (error) {
      console.error('Error fetching energy data:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Energy Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Current Usage</h2>
            <p className="text-3xl font-bold text-green-600">
              {energyData?.currentUsage || '0'} kWh
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Monthly Savings</h2>
            <p className="text-3xl font-bold text-blue-600">
              €{energyData?.savings || '0'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">CO2 Reduction</h2>
            <p className="text-3xl font-bold text-purple-600">
              {energyData?.co2Reduction || '0'} kg
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
'@
$nextPage | Out-File "$newBaseDir\00_Development\Frontend\main-app\src\pages\dashboard\index.tsx" -Encoding UTF8

# Create API endpoint example
$apiEndpoint = @'
// Energy Service API Endpoint
import { Request, Response } from 'express';
import { EnergyModel } from '../models/energy.model';

export class EnergyController {
  async getCurrentUsage(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const usage = await EnergyModel.getCurrentUsage(userId);
      
      res.json({
        success: true,
        data: {
          currentUsage: usage.current,
          dailyAverage: usage.daily,
          monthlyTotal: usage.monthly,
          savings: usage.savings,
          co2Reduction: usage.co2Reduction
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch energy data'
      });
    }
  }
  
  async getHistoricalData(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.id;
      
      const history = await EnergyModel.getHistory(userId, startDate, endDate);
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch historical data'
      });
    }
  }
}
'@
$apiEndpoint | Out-File "$newBaseDir\00_Development\Backend\services\energy-service\src\controllers\energy.controller.ts" -Encoding UTF8

Write-Host "  ✓ Starter files created" -ForegroundColor Green

# =====================================================
# FINAL SUMMARY
# =====================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           MODERN STRUCTURE CREATED SUCCESSFULLY!         ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "  • Modern web development structure created" -ForegroundColor White
Write-Host "  • Existing enterprise structure integrated" -ForegroundColor White
Write-Host "  • Configuration files generated" -ForegroundColor White
Write-Host "  • Navigation helper installed" -ForegroundColor White
Write-Host "  • Docker setup ready" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Quick Start Commands:" -ForegroundColor Yellow
Write-Host "  cd $newBaseDir" -ForegroundColor Cyan
Write-Host "  .\nav.ps1 help              # Show navigation" -ForegroundColor White
Write-Host "  .\nav.ps1 frontend          # Go to frontend" -ForegroundColor White
Write-Host "  docker-compose up           # Start development" -ForegroundColor White
Write-Host "  code .                      # Open in VS Code" -ForegroundColor White
Write-Host ""

Write-Host "📁 Structure Location:" -ForegroundColor Yellow
Write-Host "  $newBaseDir" -ForegroundColor Cyan
Write-Host ""

# Show structure overview
Write-Host "📂 Created Structure Overview:" -ForegroundColor Yellow
Get-ChildItem $newBaseDir -Directory | Select-Object Name | Format-Table -AutoSize