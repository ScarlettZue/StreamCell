## Context

User requested support for adding new profiles to existing services after account creation, alongside mobile UI redesign and Toast notifications.

## Profile Addition in Service Editing

### Frontend Button & Profile List State (`AccountsPage.tsx`)
```tsx
<div className="flex items-center justify-between mb-2.5">
  <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
    Editar Perfiles de la Cuenta ({editProfiles.length})
  </h4>

  <button
    type="button"
    onClick={() => {
      setEditProfiles([
        ...editProfiles,
        {
          profileName: `Perfil #${editProfiles.length + 1}`,
          hasPin: false,
          pin: '',
          isSold: false,
          clientId: '',
        },
      ]);
    }}
    className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
  >
    <Plus className="w-3.5 h-3.5" />
    <span>+ Agregar Perfil</span>
  </button>
</div>
```

### Backend Handling (`accountController.ts`)
```typescript
if (p.id) {
  // Update existing profile
} else {
  // Create brand new profile for this account
  const newProfile = await tx.accountProfile.create({
    data: {
      accountId: id,
      profileName: p.profileName || `Perfil #${idx + 1}`,
      hasPin: hasPinBool,
      pin: encryptedPin,
      status,
    },
  });
  // Handle sale & subscription creation if p.isSold && p.clientId
}
```
