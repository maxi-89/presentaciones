# Data Model

<!-- Document the DynamoDB single-table design for this project. -->
<!-- Update this file whenever the table schema changes. -->

## Table Overview

| Property | Value |
|---|---|
| Table name | `{service-name}-{stage}` |
| Partition key | `PK` (String) |
| Sort key | `SK` (String) |
| Billing mode | PAY_PER_REQUEST |

## Access Patterns

<!-- List the queries this table must support. Design the key schema around these. -->
<!-- Example: -->
<!-- - Get entity by ID -->
<!-- - List all entities of type X -->
<!-- - Get all Y belonging to entity X -->

| Access Pattern | Index | PK | SK |
|---|---|---|---|
| — | — | — | — |

## Entity Definitions

<!-- One section per entity stored in the table. -->
<!-- Use the format below for each entity. -->

---

### {EntityName}

**Key pattern**

| Key | Value |
|---|---|
| PK | `ENTITY#<id>` |
| SK | `ENTITY#<id>` |

**Attributes**

| Attribute | Type | Description |
|---|---|---|
| `PK` | String | Partition key |
| `SK` | String | Sort key |
| `entityType` | String | Always `"ENTITY"` |
| `id` | String | UUID |
| `createdAt` | String | ISO 8601 timestamp |

**Example item**

```json
{
  "PK": "ENTITY#abc123",
  "SK": "ENTITY#abc123",
  "entityType": "ENTITY",
  "id": "abc123",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Global Secondary Indexes (GSIs)

<!-- Add one section per GSI if needed. -->
<!-- Only add GSIs when a required access pattern cannot be served by the primary key. -->

| GSI Name | PK | SK | Projected Attributes |
|---|---|---|---|
| — | — | — | — |

## Key Design Conventions

- Key prefixes use uppercase entity type followed by `#` — e.g. `USER#`, `ORDER#`
- All entities include an `entityType` attribute for filtering
- Timestamps use ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- IDs are UUIDs (v4)
- Table name is always read from `process.env.DYNAMODB_TABLE`
