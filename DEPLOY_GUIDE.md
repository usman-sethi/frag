# Deployment Guide

I have securely separated your project into two distinct folders: `frontend` and `backend`. This resolves the `FUNCTION_IN` timeouts you were experiencing on Vercel as Vercel is not optimized for long-running Express/MongoDB applications.

## 1. Deploying the Frontend (Vercel)

1. Go to Vercel and import your repository.
2. Under **Framework Preset**, choose **Vite**.
3. Under **Root Directory**, click "Edit" and select the `frontend` folder.
4. Add an Environment Variable called `VITE_API_BASE_URL` and set its value to your deployed backend's URL (e.g., `https://my-backend.onrender.com`).
5. Click **Deploy**.

## 2. Deploying the Backend (Render or Railway)

1. Go to [Render](https://render.com) and create a new **Web Service**.
2. Connect your Git repository.
3. Under **Root Directory**, set it to `backend`.
4. The Build Command should be: `npm install && npm run build`
5. The Start Command should be: `npm start`
6. Add your Environment Variables (copy them over from your `.env` file, like your MongoDB `uri` and `JWT_SECRET`).
7. Click **Deploy**.

*Note*: Ensure that CORS is correctly set up. I have already added the `cors` module to the backend which will automatically handle cross-origin requests from your frontend.
