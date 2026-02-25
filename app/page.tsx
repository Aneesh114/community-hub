export default function Home() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-bold">Welcome to Community Hub</h1>
      <p className="mt-4 text-lg">
        A niche micro-blogging site with real-time brewing rooms and image sharing.
      </p>
      <div className="mt-8 space-x-4">
        <a href="/feed" className="text-blue-600 hover:underline">
          View Feed
        </a>
        <a href="/rooms" className="text-blue-600 hover:underline">
          Join Rooms
        </a>
      </div>
    </section>
  );
}
