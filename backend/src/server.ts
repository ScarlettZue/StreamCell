import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[Streamcell Backend] Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`[Streamcell Backend] Zona Horaria configurada: ${process.env.TZ || 'America/Bogota'}`);
});
