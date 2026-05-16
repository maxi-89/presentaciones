# Guía de Infraestructura para Servicios Tecnológicos

> Soluciones profesionales de bajo costo para un equipo de desarrollo web y mobile ágil.

---

## Índice

- [Criterios de Selección](#criterios-de-selección)
- [Resumen de Costos](#resumen-de-costos)
- [1. Dominio y DNS](#1-dominio-y-dns)
- [2. Gestor de Versiones](#2-gestor-de-versiones)
- [3. CI/CD](#3-cicd)
- [4. Servicios Cloud](#4-servicios-cloud)
  - [4.1 Frontend — a definir](#41-frontend--proveedor-a-definir)
  - [4.2 Backend — a definir](#42-backend--proveedor-a-definir)
  - [4.3 Base de Datos — AWS DynamoDB](#43-base-de-datos--aws-dynamodb)
- [5. Email Corporativo](#5-email-corporativo)
- [6. Email Transaccional](#6-email-transaccional)
- [7. Documentación](#7-documentación)
- [8. Gestión de Proyectos](#8-gestión-de-proyectos)
- [9. Monitoreo y Observabilidad](#9-monitoreo-y-observabilidad)
- [10. Comunicación del Equipo](#10-comunicación-del-equipo)
- [11. Licencias de IA](#11-licencias-de-ia)
- [Secuencia de Setup Inicial](#secuencia-de-setup-inicial)
- [Integraciones Recomendadas](#integraciones-recomendadas)

---

## Criterios de Selección

- **Bajo costo de mantenimiento**: preferir free tiers generosos y planes que escalen con el uso real.
- **Integración nativa**: las herramientas deben conectarse entre sí sin fricciones.
- **Orientado a equipos ágiles**: soporte para GitOps, despliegues automáticos y gestión ligera de tareas.
- **Sin vendor lock-in crítico**: priorizar estándares abiertos (Git, Docker, OpenAPI).
- **Escalable**: crecer del plan gratuito al pago sin migrar de plataforma.

---

## Resumen de Costos

Estimación para un equipo de hasta 5 personas al inicio:

| Herramienta                  | Propósito | Plan recomendado | Costo/mes |
|------------------------------|---|---|---|
| GitHub                       | Repositorios + CI/CD + Boards | Free / Team $4/usuario | $0–$20 |
| Google Workspace             | Email corporativo + Drive + Docs | Business Starter, 1–2 usuarios | $7–$14 |
| _Cloud (frontend + backend)_ | Frontend + Backend | _a definir_ | _TBD_ |
| AWS DynamoDB                 | Base de datos | Free tier (25 GB) | $0 |
| Sentry                       | Monitoreo de errores | Free (5.000 errores/mes) | $0 |
| Whatsapp                     | Comunicación | Free tier | $0 |
| **Subtotal infraestructura** | | | **~$14–$39/mes** |
| Claude Pro                   | IA chat + Claude Code CLI | $20/usuario | $100 |
| **Total estimado con IA**    | | | **~$114–$139/mes** |


---

## 1. Dominio y DNS

### Herramienta: [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)


**Pasos:**
1. Registrar el dominio de la empresa desde **Registrar → Register Domains** (~$10/año para `.com`)
2. Registrar el dominio del producto desde **Registrar → Register Domains** (~$10/año para `.com`)
3. Activar **SSL/TLS → Full (strict)**
4. Habilitar **Email Routing**

**Convención de subdominios:**

| Subdominio | Propósito |
|---|---|
| `www.tuempresa.com` | Sitio principal / landing |
| `app.tuempresa.com` | Aplicación web de clientes |
| `api.tuempresa.com` | API backend |
| `docs.tuempresa.com` | Documentación pública |
| `status.tuempresa.com` | Página de estado del servicio |

---

## 2. Gestor de Versiones

### Herramienta: [GitHub](https://github.com)

GitHub es el estándar de facto para equipos ágiles. El plan Free cubre la mayoría de las necesidades iniciales.

**Plan Free incluye:**
- Repositorios públicos y privados ilimitados
- 3 colaboradores en repos privados (Team desbloquea ilimitados)
- GitHub Actions: 2.000 minutos/mes gratuitos
- GitHub Packages: 500 MB de almacenamiento
- GitHub Projects (tablero de tareas ligero)
- Dependabot (alertas de seguridad)

**Configuración de la organización:**

1. Crear una **GitHub Organization** (gratis) con el nombre de la empresa
2. Crear repositorios bajo la organización, no bajo cuentas personales
3. Definir equipos con permisos diferenciados:
   - `@org/maintainers` → acceso de escritura a todos los repos
   - `@org/developers` → acceso de escritura a repos asignados
   - `@org/clients` → acceso de lectura a repos específicos (si aplica)

**Convención de repositorios:**

```
org/
├── {proyecto}-web          # Frontend web (Next.js)
├── {proyecto}-mobile       # App mobile (React Native / Flutter)
├── {proyecto}-api          # Backend (NestJS)
├── {proyecto}-infra        # Infraestructura como código (Terraform / CDK)
└── docs                    # Documentación interna del equipo
```

**Convención de ramas:**

| Rama | Propósito | Entorno |
|---|---|---|
| `main` | Producción | `app.tuempresa.com` |
| `develop` | Integración continua | `dev.tuempresa.com` |
| `feature/<ticket>-desc` | Nueva funcionalidad | Preview automático |
| `fix/<ticket>-desc` | Corrección de bug | Preview automático |

**Protecciones de rama recomendadas para `main`:**
- Require pull request reviews (mínimo 1 aprobación)
- Require status checks to pass (CI verde)
- No direct pushes

---

## 3. CI/CD

### Herramienta: [GitHub Actions](https://github.com/features/actions)

GitHub Actions se integra de forma nativa con el repositorio. Los workflows viven en `.github/workflows/`.

**Workflows mínimos recomendados:**

```
.github/workflows/
├── ci.yml          # Lint + tests en cada PR
├── deploy-dev.yml  # Deploy automático a develop
└── deploy-prod.yml # Deploy a producción en merge a main
```

**Ejemplo de `ci.yml` básico:**

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
```

**Secretos de CI** — gestionar desde `Settings → Secrets and variables → Actions`:

| Secret | Descripción |
|---|---|
| `CLOUD_DEPLOY_TOKEN` | Token de deploy del proveedor cloud elegido (frontend + backend) |
| `AWS_ACCESS_KEY_ID` | Credencial de acceso a AWS DynamoDB |
| `AWS_SECRET_ACCESS_KEY` | Credencial secreta de AWS DynamoDB |
| `SENTRY_AUTH_TOKEN` | Subida de source maps a Sentry |

---

## 4. Servicios Cloud

El stack cloud se divide en tres capas: frontend, backend y base de datos.

### 4.1 Frontend — _proveedor a definir_

> **Pendiente:** el proveedor de frontend y backend debe ser el mismo (ver 4.2). Una vez definido, completar esta sección.

**Requisitos mínimos del proveedor:**
- Soporte nativo para Next.js (App Router, Server Components, Server Actions)
- Preview deployments por cada PR
- Variables de entorno por entorno (`development`, `preview`, `production`)
- Dominio custom con SSL automático (`app.tuempresa.com`)
- Deploy automático desde GitHub

### 4.2 Backend — _proveedor a definir_

> **Pendiente:** frontend (4.1) y backend (4.2) usarán el **mismo proveedor cloud**. Definir antes de iniciar el setup de infraestructura.

**Requisitos mínimos del proveedor:**
- Deploy de contenedores Node.js (NestJS) desde GitHub
- Variables de entorno gestionadas desde panel o CLI
- Dominio custom (`api.tuempresa.com`)
- Acceso a secretos para credenciales de AWS DynamoDB

**Opciones candidatas (evaluar):**

| Proveedor | Frontend Next.js | Backend NestJS | Costo base | Notas |
|---|---|---|---|---|
| [Vercel](https://vercel.com) + [Railway](https://railway.app) | Nativo | Contenedor | $0–$5/mes | Los más simples; proveedores distintos |
| [Render](https://render.com) | Static/SSR | Web Service | $0–$7/mes | Un solo proveedor, misma plataforma |
| [Fly.io](https://fly.io) | Contenedor | Contenedor | $0–$5/mes | Un solo proveedor, más control |
| [AWS Amplify](https://aws.amazon.com/amplify/) + [ECS](https://aws.amazon.com/ecs/) | Nativo Next.js | Contenedor | $0–$10/mes | Mismo ecosistema que DynamoDB |

### 4.3 Base de Datos — [AWS DynamoDB](https://aws.amazon.com/dynamodb/)

DynamoDB es la base de datos NoSQL gestionada de AWS. Consistente con el stack definido en los estándares del proyecto (single-table design).

**Free tier incluye (permanente):**
- 25 GB de almacenamiento
- 25 unidades de lectura y escritura provisionadas
- 200 millones de solicitudes/mes en on-demand

**Por qué DynamoDB:**
- Serverless — sin servidores que gestionar ni escalar
- Latencia de un dígito en milisegundos a cualquier escala
- Single-table design reduce costos y simplifica queries
- Integración nativa con el resto del ecosistema AWS si se escala

**Configuración:**
1. Crear cuenta AWS y habilitar MFA en la cuenta root
2. Crear usuario IAM con permisos mínimos (`AmazonDynamoDBFullAccess` para el backend)
3. Crear tabla principal con el nombre `{proyecto}-{entorno}` (ej. `miapp-prod`)
4. Generar `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` y agregarlos como variables de entorno en el proveedor cloud del backend
5. Configurar región: `us-east-1` (menor latencia y costo)

## 5. Email Corporativo

### Herramienta: [Google Workspace](https://workspace.google.com) — 1 a 2 cuentas

Google Workspace provee email corporativo con dominio propio, integrado con Drive, Meet y Calendar. Para el inicio se recomienda **1 cuenta de administrador + 1 cuenta operativa**, escalando según el equipo crezca.

**Plan recomendado: Business Starter ($7/usuario/mes)**
- Email corporativo con dominio propio (`@tuempresa.com`)
- 30 GB de almacenamiento por usuario
- Google Meet, Drive, Docs, Sheets, Calendar

**Configuración inicial (2 cuentas):**

| Cuenta | Buzón | Uso |
|---|---|---|
| Admin / Tech Lead | `nombre@tuempresa.com` | Administración del workspace, acceso total |
| Operativa | `hola@tuempresa.com` | Contacto general, ventas, soporte |

**Aliases configurables sobre esas 2 cuentas:**

| Alias | Redirige a | Uso |
|---|---|---|
| `soporte@tuempresa.com` | cuenta operativa | Soporte técnico a clientes |
| `facturacion@tuempresa.com` | cuenta admin | Comprobantes y facturas |
| `noreply@tuempresa.com` | cuenta admin | Envío de emails transaccionales |

**Configuración DNS (en Cloudflare):**
1. Agregar registros MX de Google (`aspmx.l.google.com` y variantes)
2. Agregar registro SPF: `v=spf1 include:_spf.google.com ~all`
3. Configurar DKIM desde `Google Workspace Admin → Apps → Gmail → Autenticar email`

---

## 6. Email Transaccional

> **Pendiente:** definir proveedor de email transaccional (emails automáticos del sistema: bienvenida, recupero de contraseña, notificaciones). Opciones candidatas: [Resend](https://resend.com) (free 3.000 emails/mes), [SendGrid](https://sendgrid.com) (free 100 emails/día).

**Requisitos mínimos:**
- Dominio verificado con registros SPF/DKIM propios (separado del email corporativo)
- SDK compatible con Node.js / NestJS
- Soporte para plantillas HTML

---

## 7. Documentación

### Herramienta: Google Workspace + GitHub Wiki

La documentación se divide en dos capas complementarias:

**Google Workspace (Drive + Docs)** — documentación operativa y de negocio:
- Propuestas, contratos y documentos de cliente
- Planillas de costos, presupuestos y seguimiento financiero
- Minutas de reuniones y decisiones de producto
- Onboarding de nuevos integrantes (proceso, accesos)

**GitHub Wiki** — documentación técnica viva, coubicada con el código:
- Arquitectura del sistema y decisiones de diseño (ADRs)
- Guías de setup local y onboarding técnico
- Convenciones de código y estándares del proyecto
- Runbooks de operaciones y troubleshooting

**Estructura recomendada del GitHub Wiki:**

```
Wiki: {proyecto}-api / {proyecto}-web
├── Home
├── Architecture
│   ├── Overview
│   ├── Data Model
│   └── ADRs (Architecture Decision Records)
├── Development
│   ├── Local Setup
│   ├── Environment Variables
│   └── Testing Strategy
└── Operations
    ├── Deploy Process
    └── Runbooks
```

**Por qué esta combinación:**
- Google Docs para contenido no técnico que comparten todos (incluso clientes)
- GitHub Wiki para contenido técnico vivo, revisado en PRs y versionado junto al código
- Evita fragmentar la documentación en demasiadas herramientas

---

## 8. Gestión de Proyectos

### Herramienta: [GitHub Projects (Boards)](https://docs.github.com/en/issues/planning-and-tracking-with-projects)

GitHub Projects es la herramienta de gestión integrada directamente en GitHub. Al vivir junto al código, elimina la fricción de sincronizar issues con herramientas externas.

**Incluido en GitHub Free y Team:**
- Tableros Kanban y vistas de tabla/roadmap
- Issues y milestones ilimitados
- Automatizaciones nativas (mover tarjeta al abrir/cerrar PR)
- Integración directa con commits, PRs y branches

**Estructura de proyecto recomendada:**

```
GitHub Organization: TuEmpresa
├── Project: Producto — {Cliente A}
│   ├── View: Board (Kanban)
│   ├── View: Backlog (Table)
│   └── View: Roadmap (Timeline)
└── Project: Infraestructura
    └── View: Board
```

**Convención de estados (columnas del board):**

| Estado | Significado |
|---|---|
| `Backlog` | Issue identificado, sin priorizar |
| `Todo` | Priorizado para el sprint actual |
| `In Progress` | En desarrollo |
| `In Review` | PR abierto, esperando revisión |
| `Done` | Mergeado y deployado |
| `Cancelled` | Descartado |

**Convención de etiquetas:**

| Etiqueta | Uso |
|---|---|
| `bug` | Error en producción |
| `feature` | Nueva funcionalidad |
| `tech-debt` | Deuda técnica |
| `blocked` | Bloqueado por un tercero |
| `client-{nombre}` | Asociado a un cliente específico |

**Integración GitHub Issues ↔ PRs:**
1. Al abrir un PR, referenciar el issue: `Closes #42`
2. GitHub mueve automáticamente el issue a `Done` al mergear
3. Vincular el PR al Project Board desde la barra lateral del PR

**Configuración inicial:**
1. Ir a `github.com/orgs/{org}/projects` → New project
2. Seleccionar template **Board**
3. Agregar campos custom: `Priority`, `Client`, `Estimate`
4. Configurar automatización: `Item closed → set status Done`

---

## 9. Monitoreo y Observabilidad

### 9.1 Errores — [Sentry](https://sentry.io)

Captura errores en tiempo real desde frontend, backend y mobile.

**Free tier:** 5.000 errores/mes, 10.000 eventos de performance.

**Integración con NestJS:**
```typescript
// main.ts
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: process.env['SENTRY_DSN'] });
```

**Integración con Next.js:**
```bash
npx @sentry/wizard@latest -i nextjs
```

### 9.2 Uptime — [Better Uptime](https://betteruptime.com) o [UptimeRobot](https://uptimerobot.com)

Monitoreo de disponibilidad con alertas por email/Slack.

**Free tier de UptimeRobot:** 50 monitores, chequeos cada 5 minutos.

**Monitors mínimos:**

| URL | Tipo |
|---|---|
| `https://tuempresa.com` | HTTPS |
| `https://api.tuempresa.com/health` | HTTPS |
| `https://app.tuempresa.com` | HTTPS |


## 10. Comunicación del Equipo

### Herramienta: [WhatsApp](https://www.whatsapp.com)

WhatsApp es el canal principal de comunicación del equipo. Sin costo, sin fricción de onboarding y disponible en todos los dispositivos.

**Estructura de grupos recomendada:**

| Grupo | Participantes | Propósito |
|---|---|---|
| `{Empresa} — Equipo` | Todo el equipo | Comunicación general, decisiones, avisos |
| `{Empresa} — {Cliente A}` | Equipo + cliente | Comunicación directa con cada cliente |
| `{Empresa} — Deploys` | Equipo técnico | Notificaciones manuales de deploy y alertas |

**Buenas prácticas:**
- Usar el grupo de equipo para decisiones que requieren registro (complementar con nota en Google Docs cuando sea necesario)
- Mantener un grupo separado por cliente para evitar mezclar contextos
- Las alertas automáticas de Sentry y uptime llegan por email (cuenta Google Workspace); WhatsApp es para comunicación humana

---

## 11. Licencias de IA

Las herramientas de IA se dividen en dos capas complementarias:

- **Asistente de código en el IDE**: autocompletado, generación y refactor inline mientras se escribe código.
- **IA conversacional**: razonamiento, arquitectura, debugging conceptual, revisión de PRs, investigación técnica.

Ambas capas son necesarias — se complementan, no se reemplazan.

---

### Stack recomendado para 5 personas

| Herramienta | Capa | Plan | Costo/mes (×5) |
|---|---|---|---|
| [Claude Pro](https://claude.ai/upgrade) | IA conversacional + Claude Code CLI | $20/usuario | $100 |
| **Total** | | | **$100/mes** (~$20/persona) |

---

### Por qué Claude Pro

**Claude Pro** cubre dos usos complementarios:
1. `claude.ai` — chat web para razonamiento, arquitectura, revisión de código y debugging complejo.
2. `claude` CLI — Claude Code para operar directamente sobre el repositorio desde la terminal.

Para un equipo de desarrollo web/mobile ágil, **Claude Pro es la opción de mejor relación costo/capacidad**. Escalar a Claude Max solo cuando 2–3 integrantes usen Claude Code de forma intensiva (refactors grandes, generación masiva de tests).

---

### Herramienta por rol

| Rol | Claude Pro | Notas |
|---|---|---|
| Tech Lead | ✓ | Chat + Claude Code para arquitectura y revisión de PRs |
| Backend Dev | ✓ | Claude Code para refactors y análisis de arquitectura |
| Frontend Dev | ✓ | Chat para debugging y Claude Code para generación de componentes |
| Mobile Dev | ✓ | Chat para diseño de APIs y debugging |
| QA / DevOps | ✓ | Claude Code para generar tests y scripts de CI |

---

### Comparativa de asistentes de código en IDE

| Herramienta | Free tier | Pro | Modelos usados | IDE |
|---|---|---|---|---|
| GitHub Copilot | No | $10–$19/usuario | GPT-4o, Claude 3.5 Sonnet | Todos |
| Cursor | 2 semanas trial | $20/usuario | GPT-4o, Claude 3.7, Gemini | Propio (fork de VS Code) |
| Windsurf | Sí (generoso) | $15/usuario | GPT-4o, Claude 3.5 | Propio + extensión VS Code |
| Cline (VS Code) | Sí (API propia) | Pay-per-use | Cualquier API | VS Code |

> **Recomendación**: Copilot Business si el equipo ya usa VS Code o JetBrains y quiere la integración más madura con GitHub. Cursor si prefiere el IDE todo-en-uno más potente. Windsurf si el presupuesto es la prioridad.

---

### Comparativa de IA conversacional

| Herramienta | Plan | Costo/mes | Mejor para |
|---|---|---|---|
| **Claude Pro** | Pro | $20/usuario | Razonamiento largo, arquitectura, Claude Code CLI |
| Claude Max | Max | $100/usuario | Uso intensivo de Claude Code (5× más uso) |
| ChatGPT Team | Team | $25/usuario | Equipos que ya usan el ecosistema OpenAI |
| Perplexity Pro | Pro | $20/usuario | Investigación técnica con fuentes verificadas |
| Gemini Advanced | Business | $22/usuario | Integración con Google Workspace |

> Para un equipo de desarrollo web/mobile ágil, **Claude Pro es la opción de mejor relación costo/capacidad**. Escalar a Claude Max solo cuando 2–3 integrantes usen Claude Code de forma intensiva (refactors grandes, generación de tests masivos).

---

### Claude Code — uso en el equipo

Claude Code es la CLI de Anthropic que opera directamente sobre el repositorio. Requiere una suscripción Claude Pro o Max activa.

**Casos de uso de alto valor:**

| Tarea | Comando ejemplo |
|---|---|
| Explorar y entender una codebase nueva | `claude "explain the architecture of this project"` |
| Generar tests para un módulo | `claude "write unit tests for src/modules/foo/foo.service.ts"` |
| Refactor con contexto completo | `claude "refactor FooService to use the repository pattern"` |
| Revisar un PR antes de mergearlo | `claude "review the changes in this PR for security issues"` |
| Debugging con contexto de stack trace | Pegar el error + `claude "fix this"` |

**Buenas prácticas de uso en equipo:**
- Mantener un `CLAUDE.md` en cada repositorio con las convenciones del proyecto (ya incluido en este stack).
- Usar `/memory` para guardar contexto recurrente del proyecto.
- No commitear archivos generados sin revisión humana — toda salida de IA es un borrador.
- Documentar en el PR si se usó IA para generar partes del código.

---

## Secuencia de Setup Inicial

Seguir este orden para evitar dependencias rotas:

```
Semana 1 — Identidad, Accesos y IA
─────────────────────────────────────────────────────
 [ ] 1. Registrar dominios en Cloudflare Registrar (empresa + producto)
 [ ] 2. Crear organización en GitHub
 [ ] 3. Crear Google Workspace (1–2 cuentas) y configurar DNS en Cloudflare (MX, SPF, DKIM)
 [ ] 4. Invitar al equipo a GitHub
 [ ] 5. Activar Claude Pro para cada integrante (claude.ai/upgrade)
 [ ] 6. Instalar Claude Code CLI: npm install -g @anthropic-ai/claude-code
 [ ] 7. Agregar CLAUDE.md en cada repositorio con convenciones del proyecto

Semana 2 — Código e Infraestructura
─────────────────────────────────────────────────────
 [ ] 8.  Decidir proveedor cloud para frontend + backend (ver sección 4.1 / 4.2)
 [ ] 9.  Crear repositorios bajo la organización de GitHub
 [ ] 10. Configurar protecciones de rama en `main`
 [ ] 11. Configurar workflows de CI/CD en GitHub Actions
 [ ] 12. Conectar repos al proveedor cloud elegido (frontend + backend)
 [ ] 13. Crear cuenta AWS, habilitar MFA y crear usuario IAM con permisos DynamoDB
 [ ] 14. Crear tabla DynamoDB principal (`{proyecto}-prod` y `{proyecto}-dev`)
 [ ] 15. Agregar credenciales AWS (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) en el proveedor cloud del backend

Semana 3 — Observabilidad y Documentación
─────────────────────────────────────────────────────
 [ ] 16. Crear proyectos en Sentry e integrar en frontend y backend
 [ ] 17. Configurar monitores de uptime en UptimeRobot
 [ ] 18. Inicializar GitHub Wiki en el repositorio principal con estructura de arquitectura
 [ ] 19. Crear carpeta compartida en Google Drive para documentación operativa

Semana 4 — Gestión y Flujo de Trabajo
─────────────────────────────────────────────────────
 [ ] 20. Crear GitHub Project (Board) bajo la organización
 [ ] 21. Configurar columnas, campos custom y automatizaciones del board
 [ ] 22. Documentar onboarding técnico en GitHub Wiki
 [ ] 23. Primer deploy completo: frontend + backend → proveedor cloud elegido, DB → DynamoDB
```

---

## Integraciones Recomendadas

El siguiente diagrama muestra cómo se conectan las herramientas:

```
GitHub ───────────────────────────────────────────────────────────┐
  │  push/PR                                                       │
  ▼                                                                │
GitHub Actions ──── deploy ──── [cloud] frontend (app.*)          │
  │                   └──────── [cloud] backend (api.*)           │
  │                                    │                          │
  │                             AWS DynamoDB                      │
  │                                                               │
  └── notificación por email ─────────────────────────────────── ► Google Workspace
                                                                   │
Sentry ─────── error alert ──────────────────────────────────────┘
UptimeRobot ─── downtime alert ──────────────────────────────────► email (Google Workspace)

GitHub Projects ◄──── auto-link ────── GitHub Issues / PRs

Cloudflare ──── DNS ──────────────── [cloud] frontend (app.*)
              ├── DNS ──────────────── [cloud] backend (api.*)
              └── MX / SPF / DKIM ──── Google Workspace (mail)
```

---

## Notas sobre Escalabilidad

Cuando el equipo o la carga crezcan, estos son los saltos naturales de cada herramienta:

| Herramienta | Trigger para escalar | Siguiente plan |
|---|---|---|
| GitHub Free → Team | +3 colaboradores en repos privados | $4/usuario |
| Google Workspace Business Starter → Standard | +2 TB storage o necesidad de audit log | $14/usuario |
| AWS DynamoDB Free → On-Demand | Superar 25 GB o 25 WCU/RCU provisionadas | Pay-per-use |
| Cloud frontend/backend (definir al elegir proveedor) | Superar límites del free tier | Según proveedor |
| Sentry Free → Team | +5.000 errores/mes | $26/mes |
| Claude Pro → Max | Uso intensivo de Claude Code (refactors grandes, generación masiva de tests) | $100/usuario |
