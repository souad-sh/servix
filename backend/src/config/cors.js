export const corsOptions = {
  origin: process.env.FRONTEND_URL,   // http://localhost:5173
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};
