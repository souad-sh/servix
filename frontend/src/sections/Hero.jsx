import heroImage from "../assets/hero.png"; // Replace with your background image

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content aligned to the left */}
      <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center text-white">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-2xl">
          Simplify{" "}
          <span className="text-blue-600">Fleet Management</span>
        </h1>

        <p className="mt-4 text-lg text-gray-200 max-w-lg">
          Track your vehicles, schedule maintenance, and keep your fleet running
          at peak performance — all in one easy-to-use platform.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <a
            href="#get-started"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
          <a
            href="#learn-more"
            className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
