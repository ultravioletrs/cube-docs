---
id: roles-and-access-control
title: Roles and Access Control
sidebar_position: 1
---

Cube AI uses role-based access control (RBAC) to manage what users can see and do
within a domain. Roles define permissions at the domain level and ensure that
actions are performed only by authorized users.

---

## Role-Based Access Control Overview

Access control in Cube AI is **domain-scoped**.

This means that:
- Users can belong to one or more domains
- A user may have different roles in different domains
- Permissions apply only within the currently active domain

Roles determine which UI features and actions are available to a user.

---

## Roles in Cube AI

Cube AI provides a set of predefined roles that control access to domain features.

While the exact role names and permissions may vary depending on deployment and
configuration, roles typically differentiate between:

- **Administrative users** – users with elevated permissions
- **Standard users** – users with access to core functionality
- **Restricted users** – users with limited or read-only access

---

## Common Permissions

Roles may control access to actions such as:

- Creating or managing domains
- Inviting or managing domain members
- Assigning or changing user roles
- Accessing administrative UI sections
- Viewing or managing security-related information
- Interacting with models and chat interfaces

Not all users have access to all features. The UI dynamically reflects the
permissions granted by the user’s role.

---

## Domain Membership

Users must be members of a domain to access its resources.

Within a domain:
- Each user is assigned a specific role
- Role assignments apply only to that domain
- Removing a user from a domain immediately revokes domain access

Domain membership and role assignments are managed through the Cube AI UI by users
with sufficient permissions.

---

## UI Behavior Based on Roles

The Cube AI UI adapts based on the active user’s role.

Depending on permissions:
- Certain navigation items may be hidden
- Some actions may be disabled or unavailable
- Administrative sections may only be visible to authorized users

This ensures that users only interact with features they are allowed to access.

---

## Role Changes

When a user’s role is updated:
- The change takes effect immediately
- UI visibility and available actions are updated accordingly
- No page reload may be required, depending on the UI state

Role changes affect only the selected domain.

---

## Access Control and Security

Role-based access control helps enforce security boundaries by:
- Limiting access to sensitive operations
- Reducing the risk of accidental or unauthorized changes
- Ensuring clear separation of responsibilities within a domain

RBAC works together with other Cube AI security mechanisms, such as authentication
and auditing, to provide a controlled and observable environment.

---

## Auditing and Role-Related Events

Changes to domain membership and roles may be recorded as security-relevant events.

For details on how such events are tracked, see:
👉 **Security & Access → Audit Logs**

---

## Next Steps

To understand how access-related actions are monitored, continue with:
👉 **Security & Access → Audit Logs**

For domain workflows, see:
👉 **UI → Domains**
