# Community Hub

Niche micro-blogging platform with real‑time "Brewing Rooms" chat, built with Next.js, MongoDB, and Socket.io. Features include:

- User registration / login (JWT-based auth)
- Follow/unfollow system (many‑to‑many relationship)
- Create posts with optional image uploads (Cloudinary)
- Real‑time chat rooms powered by WebSockets

## Getting Started

1. **Clone repository** and open workspace.
2. Create a `.env.local` file (see sample below):

```env
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="a_long_random_secret"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

3. Install dependencies:

```bash
npm install
```

4. Run development server:

```bash
npm run dev
```

5. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/models` — Mongoose schemas for User, Post, Room, Message
- `/pages/api` — REST and WebSocket endpoints
- `/app` — React components and routes (app router)

## Notes

- Socket.io is initialized in `pages/api/socket.ts` and reused across requests.
- Client-side token is stored in `localStorage` after login.
- Image uploads are handled via Cloudinary with a helper at `/api/upload`.

Feel free to extend with profiles, notifications, or a UI polish!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
