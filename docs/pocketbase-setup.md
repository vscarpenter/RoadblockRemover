# PocketBase Collection Setup

This document describes the PocketBase collections required for the Roadblock Remover application.

## Prerequisites

- PocketBase instance running at the URL configured in `.env.local`
- Admin access to the PocketBase dashboard (`/_/`)

## Collection: `roadblocks`

### Fields

| Field             | Type    | Configuration                                                 |
| ----------------- | ------- | ------------------------------------------------------------- |
| `category`        | Select  | Values: `CI/CD`, `DX`, `Process`, `Tooling`, `Culture`. Required. |
| `severity`        | Select  | Values: `Low`, `Med`, `High`, `Critical`. Required.           |
| `title`           | Text    | Max length: 100. Required.                                    |
| `description`     | Editor  | Required.                                                     |
| `estimated_waste` | Number  | Min: 0. Required.                                             |
| `status`          | Select  | Values: `Open`, `In Progress`, `Resolved`, `Closed`. Default: `Open`. Required. |
| `resolver_id`     | Relation| Collection: `users`. Optional. Single.                        |
| `resolution_note` | Text    | Optional.                                                     |

### API Rules

| Action       | Rule                          |
| ------------ | ----------------------------- |
| List/Search  | `@request.auth.id != ""`      |
| View         | `@request.auth.id != ""`      |
| Create       | `@request.auth.id != ""`      |
| Update       | `@request.auth.id != ""`      |
| Delete       | `@request.auth.id != ""`      |

### Anonymity

**CRITICAL**: Do NOT add a `created_by` relation field. The absence of this field is the anonymity guarantee. PocketBase does not automatically associate the creating user with a record unless you explicitly add a relation field.

**Residual risk**: PocketBase admin request logs may contain the authenticated user's ID alongside the request. Consider:
- Periodically clearing request logs in PocketBase admin
- Restricting admin panel access
- In a future version, adding a PocketBase hook to strip user identifiers from `roadblocks` create-request logs

## Collection: `subscriptions`

### Fields

| Field          | Type     | Configuration                              |
| -------------- | -------- | ------------------------------------------ |
| `user_id`      | Relation | Collection: `users`. Required. Single.     |
| `roadblock_id` | Relation | Collection: `roadblocks`. Required. Single.|

### API Rules

| Action       | Rule                              |
| ------------ | --------------------------------- |
| List/Search  | `user_id = @request.auth.id`      |
| View         | `user_id = @request.auth.id`      |
| Create       | `@request.auth.id != ""`          |
| Update       | `user_id = @request.auth.id`      |
| Delete       | `user_id = @request.auth.id`      |

### Indexes

Add a unique index on `(user_id, roadblock_id)` to prevent duplicate subscriptions.

## Setup Steps

1. Navigate to PocketBase admin panel at `{POCKETBASE_URL}/_/`
2. Create the `roadblocks` collection with the fields above
3. Set the API rules for `roadblocks`
4. Create the `subscriptions` collection with the fields above
5. Set the API rules for `subscriptions`
6. Add the unique index on `subscriptions`
7. Ensure the `users` collection has email/password auth enabled

## CORS Configuration

If deploying the frontend to a different domain than PocketBase, ensure PocketBase allows cross-origin requests from the frontend domain. This is typically handled in PocketBase settings or via a reverse proxy.
