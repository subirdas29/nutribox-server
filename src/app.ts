import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    
    origin: 'https://nutribox-client.vercel.app',
    // origin: 'http://localhost:5173',
    
    credentials: true,
  }),
);

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send({
    status: true,
    message: 'Server Live',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
