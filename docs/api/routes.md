# Route Management API Documentation

## Overview

The Route Management API allows superadmin users to dynamically configure routing rules for the Cube proxy service. Routes determine how incoming requests are forwarded to backend services based on various matching criteria.

## Security

**All route management endpoints require superadmin authorization.** Only users with platform admin permissions can create, read, update, or delete routes.

## API Endpoints

### Create Route

Create a new routing rule.

**Endpoint:** `POST /api/routes`

**Authentication:** Required (Superadmin only)

**Request Body:**

```json
{
  "name": "my-service",
  "target_url": "http://backend:8080",
  "matchers": [
    {
      "condition": "path",
      "pattern": "/api/v1/.*",
      "is_regex": true
    }
  ],
  "priority": 10,
  "default_rule": false,
  "strip_prefix": "/api/v1"
}
```

**Response:** `201 Created`

```json
{
  "message": "route created successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid route configuration
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a superadmin
- `409 Conflict` - Route name already exists or conflicts with existing route

---

### Get Route

Retrieve a specific route by name.

**Endpoint:** `GET /api/routes/{name}`

**Authentication:** Required (Superadmin only)

**Response:** `200 OK`

```json
{
  "name": "my-service",
  "target_url": "http://backend:8080",
  "matchers": [
    {
      "condition": "path",
      "pattern": "/api/v1/.*",
      "is_regex": true
    }
  ],
  "priority": 10,
  "default_rule": false,
  "strip_prefix": "/api/v1"
}
```

**Error Responses:**

- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a superadmin
- `404 Not Found` - Route not found

---

### List Routes

List all configured routes.

**Endpoint:** `GET /api/routes`

**Authentication:** Required (Superadmin only)

**Response:** `200 OK`

```json
[
  {
    "name": "attestation",
    "target_url": "https://10.172.192.41:6193",
    "matchers": [
      {
        "condition": "path",
        "pattern": "/attestation/.*",
        "is_regex": true
      }
    ],
    "priority": 15,
    "default_rule": false,
    "strip_prefix": ""
  },
  {
    "name": "agent",
    "target_url": "https://10.172.192.41:6193",
    "matchers": [],
    "priority": 0,
    "default_rule": true,
    "strip_prefix": ""
  }
]
```

**Error Responses:**

- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a superadmin

---

### Update Route

Update an existing routing rule.

**Endpoint:** `PUT /api/routes/{name}`

**Authentication:** Required (Superadmin only)

**Request Body:**

```json
{
  "name": "my-service",
  "target_url": "http://backend:9090",
  "matchers": [
    {
      "condition": "path",
      "pattern": "/api/v2/.*",
      "is_regex": true
    }
  ],
  "priority": 20,
  "default_rule": false,
  "strip_prefix": "/api/v2"
}
```

**Response:** `200 OK`

```json
{
  "message": "route updated successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid route configuration
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a superadmin or attempting to modify system route
- `404 Not Found` - Route not found
- `409 Conflict` - Route conflicts with existing route

---

### Delete Route

Delete a routing rule.

**Endpoint:** `DELETE /api/routes/{name}`

**Authentication:** Required (Superadmin only)

**Response:** `200 OK`

```json
{
  "message": "route deleted successfully"
}
```

**Error Responses:**

- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a superadmin or attempting to delete system route
- `404 Not Found` - Route not found

---

## Route Configuration

### Route Fields

| Field          | Type    | Required    | Description                                                                              |
| -------------- | ------- | ----------- | ---------------------------------------------------------------------------------------- |
| `name`         | string  | Yes         | Unique identifier for the route (alphanumeric, hyphens, underscores only, max 255 chars) |
| `target_url`   | string  | Yes         | Backend service URL (must include scheme and host)                                       |
| `matchers`     | array   | Conditional | Array of matching conditions (required unless `default_rule` is true)                    |
| `priority`     | integer | No          | Route priority (0-1000, higher = checked first, default: 0)                              |
| `default_rule` | boolean | No          | If true, matches when no other routes match (default: false)                             |
| `strip_prefix` | string  | No          | Path prefix to remove before forwarding (must start with /)                              |

### Matcher Conditions

Routes can match requests based on various conditions:

#### Path Matching

```json
{
  "condition": "path",
  "pattern": "/api/.*",
  "is_regex": true
}
```

#### HTTP Method Matching

```json
{
  "condition": "method",
  "pattern": "POST",
  "is_regex": false
}
```

#### Header Matching

```json
{
  "condition": "header",
  "field": "Content-Type",
  "pattern": "application/json",
  "is_regex": false
}
```

#### Query Parameter Matching

```json
{
  "condition": "query_param",
  "field": "version",
  "pattern": "v2",
  "is_regex": false
}
```

#### Body Field Matching (JSON)

```json
{
  "condition": "body_field",
  "field": "user.role",
  "pattern": "admin",
  "is_regex": false
}
```

#### Body Regex Matching

```json
{
  "condition": "body_regex",
  "pattern": ".*error.*",
  "is_regex": true
}
```

### Validation Rules

1. **Route Name:**
   - Must be unique
   - Alphanumeric characters, hyphens, and underscores only
   - Maximum 255 characters
   - Cannot be empty

2. **Target URL:**
   - Must include scheme (http/https)
   - Must include host
   - Must be a valid URL format

3. **Priority:**
   - Must be between 0 and 1000
   - Higher priority routes are evaluated first

4. **Matchers:**
   - At least one matcher required (unless `default_rule` is true)
   - Regex patterns must be valid
   - Field-based matchers (header, query_param, body_field) must include `field`

5. **Default Rule:**
   - Only one default route allowed per system
   - Default routes don't require matchers

6. **Strip Prefix:**
   - Must start with `/` if specified
   - Removed from request path before forwarding

### System Routes

The following routes are protected and cannot be modified or deleted:

- `attestation` - Attestation service routes
- `health` - Health check routes

## Examples

### Example 1: Simple Path-Based Route

Route all requests starting with `/api/users` to a user service:

```bash
curl -X POST http://localhost:8900/api/routes \
  -H "Authorization: Bearer $SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "user-service",
    "target_url": "http://users:8080",
    "matchers": [
      {
        "condition": "path",
        "pattern": "/api/users/.*",
        "is_regex": true
      }
    ],
    "priority": 10,
    "strip_prefix": "/api"
  }'
```

### Example 2: Method and Path Matching

Route POST requests to `/api/data` to a write service:

```bash
curl -X POST http://localhost:8900/api/routes \
  -H "Authorization: Bearer $SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "data-write",
    "target_url": "http://write-service:8080",
    "matchers": [
      {
        "condition": "method",
        "pattern": "POST"
      },
      {
        "condition": "path",
        "pattern": "/api/data",
        "is_regex": false
      }
    ],
    "priority": 20
  }'
```

### Example 3: Default Route

Create a catch-all route for unmatched requests:

```bash
curl -X POST http://localhost:8900/api/routes \
  -H "Authorization: Bearer $SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "default-backend",
    "target_url": "http://default:8080",
    "default_rule": true,
    "priority": 0
  }'
```

## Configuration File Integration

Routes can be defined in `config.json` and will be loaded at startup. Database routes take precedence over config file routes with the same name.

Example `config.json`:

```json
{
  "router": {
    "routes": [
      {
        "name": "attestation",
        "target_url": "https://10.172.192.41:6193",
        "matchers": [
          {
            "condition": "path",
            "pattern": "/attestation/.*",
            "is_regex": true
          }
        ],
        "priority": 15,
        "strip_prefix": ""
      }
    ]
  }
}
```

## Troubleshooting

### Route Not Matching

1. Check route priority - higher priority routes are evaluated first
2. Verify matcher patterns are correct (especially regex patterns)
3. Check if another route with higher priority is matching first
4. Ensure the route is enabled and loaded (check logs)

### Validation Errors

- **"invalid route name"**: Name contains invalid characters or is too long
- **"invalid target URL"**: URL missing scheme or host
- **"route conflicts with existing route"**: Route name already exists
- **"only one default route is allowed"**: Another default route exists
- **"system route cannot be modified"**: Attempting to modify protected route
- **"invalid regex pattern"**: Regex pattern is malformed

### Performance Considerations

- Routes are evaluated in priority order (descending)
- Regex matching is slower than exact matching
- Body matching requires reading the entire request body
- Keep the number of routes reasonable (< 100 for best performance)
