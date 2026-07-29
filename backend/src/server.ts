import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend Streamcell ejecutándose en http://localhost:${PORT}`);
  console.log(`⏱️ Zona Horaria configurada: ${process.env.TZ || 'America/Bogota'}`);
});
