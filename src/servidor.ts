import app, { connectDB } from './app';

const PORT = process.env.PORT || 3001;

// Ruta de prueba
app.get('/nueva', (_req, res) => {
    console.log('API health check - OK');

    res.status(200).json({
        status: 'success',
        message: 'API is working correctly'
    });
});

// Iniciar servidor
const iniciarServidor = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error);
        process.exit(1);
    }
};

iniciarServidor();