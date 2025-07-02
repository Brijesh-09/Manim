# 🧠 Promanim — AI-powered Code-to-Video Generation using Manim

**Promanim** is a full-stack AI-powered platform that converts natural language prompts into educational animations using [Manim](https://www.manim.community/). Built with a focus on learning, visualization, and automation, this system lets users chat with an AI to generate code and watch the resulting video — instantly.

---

## 🚀 How It Works

1. **User sends a prompt** (e.g. "Explain how RAM works").
2. **AI backend (OpenAI / LLM)** responds with:

   * Explanation
   * Python (Manim) code
3. **The Manim worker**:

   * Takes the code
   * Renders the video using `manim`
   * Uploads it to S3 (or any cloud storage)
4. **Frontend**:

   * Displays the prompt, code, and rendered video
   * Continuously polls for video readiness

---

## 🧩 Architecture Overview

```mermaid
graph TD
    A[Frontend - Next.js] -->|Send Prompt| B[Backend - Express]
    B -->|Store| C[PostgreSQL]
    B -->|Queue Job| D[Redis Queue]
    D -->|Consume & Render| E[Manim Worker (Python + Docker)]
    E -->|Upload Video| F[AWS S3]
    B -->|Check Status + Get URL| A
```

---

## 📚 Technologies Used

* **Frontend**: React (Next.js)
* **Backend**: Express.js
* **Database**: PostgreSQL
* **Queue**: Redis
* **Worker**: Python + Docker + Manim
* **Storage**: AWS S3
* **AI**: Gemini API (free)

---

# Backend setup
* [Backend Repo]()
cd primary-backend
npm install
npm run dev


# Frontend setup
cd ../frontend
npm install
npm run dev

# Redis setup (Docker)
docker run -p 6379:6379 --name redis -d redis

# Worker setup
docker build -t Promanim-worker .
docker run -it --env-file .env Promanim-worker
```

---

## 🎥 Sample Prompts Tested

| Prompt                 
| ---------------------- 
| Explain RAM |            
| Explain Cloud Computing |
| How does MCP work |        
| what is Load Balancer |       

---

## ⚡ Scaling Potential

| Component    | How to Scale                                                 |
| ------------ | ------------------------------------------------------------ |
| **Worker**   | Add multiple containers, autoscale with job load             |
| **Queue**    | Use Redis cluster or managed services (Upstash, Elasticache) |
| **Storage**  | Use S3 lifecycle rules, CDN (CloudFront)                     |
| **Backend**  | Deploy via ECS/Fargate or Railway.app                        |
| **Frontend** | Vercel or static S3 + CloudFront                             |

---

## 📈 Future Improvements

* 📚 Multi-step video generation for courses
* ⚛️ Template/styled animations
* 📹 Lottie/3D support via ManimGL

---

## 👨‍💼 Why This Project Exists

This project was created as a **showcase portfolio** to:

* Demonstrate end-to-end system design
* Combine AI + DevOps + fullstack engineering
* Impress recruiters with real production logic

If you're hiring for cloud, devtools, or AI infrastructure roles — let's talk!

---

## 📄 License

MIT — feel free to fork, clone, and contribute!

---

## 🙏 Acknowledgments

* [Manim Community](https://docs.manim.community/)
* [OpenAI](https://openai.com/)
* [Redis](https://redis.io/)
* [AWS S3](https://aws.amazon.com/s3/)
* [Docker](https://www.docker.com/)
