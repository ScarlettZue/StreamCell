## ADDED Requirements

### Requirement: Vinculación de Clientes a un Distribuidor
The system MUST allow linking an end-user client to a registered distributor via an optional `distributorId` field, displaying the distributor association in user lists and profile details.

#### Scenario: Asignación de distribuidor durante la creación del cliente
- **WHEN** el usuario registra un nuevo cliente especificando un distribuidor en la lista desplegable
- **THEN** el sistema guarda el cliente enlazado al ID del distribuidor seleccionado

#### Scenario: Visualización del distribuidor en el listado de usuarios
- **WHEN** el usuario consulta la tabla principal de usuarios
- **THEN** las filas de los clientes finales muestran el nombre o etiqueta del distribuidor al que pertenecen

#### Scenario: Pestaña de Clientes Asignados en el modal del Distribuidor
- **WHEN** el usuario abre la ficha detallada de un usuario con rol Distribuidor
- **THEN** el modal incluye una pestaña "Clientes Asignados" mostrando el listado de clientes bajo su red, sus cuentas activas y su saldo acumulado
