async function testApiUpdate() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@streamcell.com',
        password: 'Streamcell2026*',
      }),
    });

    const loginData: any = await loginRes.json();
    console.log('Login respuesta:', loginData);
    const token = loginData.data.token;

    // 2. Obtener cliente CLI-0004
    const getRes = await fetch('http://localhost:4000/api/v1/clients?search=CLI-0004', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const getData: any = await getRes.json();
    const client = getData.data[0];
    console.log('Cliente en la base de datos:', client);

    // 3. Hacer PUT
    const putRes = await fetch(`http://localhost:4000/api/v1/clients/${client.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: client.name,
        phone: '3126622931',
      }),
    });

    const putData: any = await putRes.json();
    console.log('Resultado PUT API:', putData);
  } catch (err: any) {
    console.error('Error en API:', err);
  }
}

testApiUpdate();
