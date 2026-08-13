import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Streamcell Backend] Servidor ejecutándose en http://0.0.0.0:${PORT}`);
  console.log(`[Streamcell Backend] Zona Horaria configurada: ${process.env.TZ || 'America/Bogota'}`);
});
