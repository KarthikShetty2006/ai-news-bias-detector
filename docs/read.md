cd ml-service
venv\Scripts\activate
uvicorn app.main:app --reload

cd server
npm run dev

cd frontend
npm run dev