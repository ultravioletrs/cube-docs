---
id: overview
title: UI Concepts Overview
sidebar_position: 1
---

The Cube AI user interface provides a web-based environment for interacting with
large language models, managing domains, and performing user and
domain-scoped operations.

This section gives a high-level overview of the Cube AI UI structure and common
user workflows.

---

## UI Structure

The Cube AI UI is organized around a few core concepts:

- **Authentication** – users log in using their credentials
- **Domains** – isolated workspaces that define context and scope
- **Navigation** – access to domain-specific features through the UI menu
- **Actions** – user and domain operations performed through the interface

All user interactions occur either before selecting a domain (authentication)
or within the context of an active domain.

---

## Authentication Flow

Users begin by accessing the Cube AI login screen.

After successful authentication:

- The user is redirected to the dashboard
- Available domains are displayed
- The user selects or creates a domain to continue

Account-related actions such as sign up, verification, password reset, and
profile management are documented in:

👉 **UI → User Actions**

---

## Domain-Centric Navigation

Once a domain is opened, the UI switches into **domain context**.

Within this context:

- All visible resources belong to the active domain
- Available actions depend on the user’s role in that domain
- Models and services are scoped to the domain

Switching domains updates the entire UI context accordingly.

For more details, see:
👉 **UI → Domains**

---

## Common User Workflows

Typical workflows in the Cube AI UI include:

- Logging in and selecting a domain
- Creating and managing domains
- Interacting with models through the chat interface
- Switching models within a domain
- Managing users and roles (if permitted)
- Viewing system and security-related events

Each workflow is documented in its respective section of the UI documentation.

---

## Roles and Permissions

Access to UI features is controlled by role-based permissions.

Depending on their assigned role, users may be able to:

- Create or manage domains
- Invite or manage other users
- Access administrative or security features

Role definitions and permissions are covered in:

👉 **Security & Access → Roles and Access Control**

---

## Security and Auditing

Cube AI provides visibility into security-relevant actions through audit logs.

Audit logs help track:

- User activity
- Domain-level changes
- Security-sensitive operations

For details, see:
👉 **Security & Access → Audit Logs**

---

## Developer-Focused UI Documentation

This section focuses on **user-facing UI behavior**.

Developer-oriented documentation related to UI integration and customization,
such as the Chat UI, is available in:

👉 **Developer Guide → Chat UI**

---

## Next Steps

To continue exploring the Cube AI UI:

- Start with **UI → Domains** to understand domain workflows
- Review **UI → User Actions** for account-related operations
- Explore **Security & Access** for roles and auditing features
