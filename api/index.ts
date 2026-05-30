import app from '../server';

export default async function handler(req: any, res: any) {
  try {
    // Let express handle the request
    await app(req, res);
  } catch (err: any) {
    console.error("Vercel Function Error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
}
