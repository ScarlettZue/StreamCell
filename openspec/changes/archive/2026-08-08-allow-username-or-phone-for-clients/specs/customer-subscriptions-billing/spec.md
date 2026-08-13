# customer-subscriptions-billing Specification (Delta)

## MODIFIED Requirements

### Requirement: Registro de Clientes con ID Consecutivo CLI-XXXX
The system MUST automatically generate a consecutive ID with format CLI-XXXX (e.g. CLI-0001) for each new customer, allow storing either a numeric phone number or a WhatsApp username (`@usuario`), allow searching by Name or Phone/Username, and hide the CLI-XXXX ID from the main list table UI.

#### Scenario: Creación exitosa de un cliente con número de celular
- **WHEN** el usuario registra un nuevo cliente especificando nombre y número móvil
- **THEN** el sistema asigna el siguiente ID consecutivo CLI-XXXX, procesa el número celular y retorna el cliente registrado

#### Scenario: Creación exitosa de un cliente con usuario de WhatsApp (@usuario)
- **WHEN** el usuario registra un nuevo cliente especificando nombre y un usuario de WhatsApp como `@tony_stream`
- **THEN** el sistema valida y guarda el usuario de WhatsApp asignando el ID consecutivo `CLI-XXXX`

#### Scenario: Búsqueda de cliente por Nombre o Celular/@Usuario sin ID visible
- **WHEN** el usuario consulta o busca en el listado principal de clientes
- **THEN** la interfaz filtra por Nombre o Celular/@Usuario sin mostrar la columna visual del ID CLI-XXXX ni saldos deudores en la tabla principal
