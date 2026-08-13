## Context

Distributors manage sub-clients. Adding a self-referential foreign key on the `Client` table allows assigning end-users to distributors without adding unnecessary complexity to the database.

## Goals / Non-Goals

**Goals:**
- Add `distributorId` self-relation to `Client` model in Prisma.
- Update `clientController.ts` to support `distributorId` in creation/update DTOs, and include `distributor` and `subClients` relations in JSON responses.
- Update `ClientsPage.tsx` to provide a distributor dropdown in create/edit modals and display distributor badges on client rows.
- Update `ClientDetailsModal.tsx` to display a **"Clientes Asignados"** tab when inspecting a distributor.

**Non-Goals:**
- Multi-tier multi-level network (MLM) hierarchies (only 1-level parent distributor → sub-client is required).

## Decisions

### Decision 1: Prisma Self-Relation
- **Model**:
  ```prisma
  model Client {
    id            String     @id @default(uuid())
    clientKey     String     @unique
    name          String
    phone         String
    role          ClientRole @default(CLIENTE)
    distributorId String?
    distributor   Client?    @relation("DistributorClients", fields: [distributorId], references: [id], onDelete: SetNull)
    subClients    Client[]   @relation("DistributorClients")
  }
  ```

### Decision 2: Backend Query Expansion
- In `getAll` and `getById`, include `distributor: { select: { id: true, name: true, phone: true } }` and `subClients: { include: { subscriptions: true } }`.

### Decision 3: Frontend Tab for Distributors
- In `ClientDetailsModal.tsx`, check if `isDistributor`. If true, render tab `subClients` showing assigned clients, their active accounts, and total debt.

## Risks / Trade-offs

- **[Database Push]** → Schema update requires running `npx prisma db push`.
