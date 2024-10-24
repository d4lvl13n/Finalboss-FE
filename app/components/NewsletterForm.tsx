'use client';

export default function NewsletterForm() {
  return (
    <form className="max-w-md mx-auto">
      <div className="flex">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-grow px-4 py-2 rounded-l-full text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <button
          type="submit"
          className="bg-yellow-400 text-black px-6 py-2 rounded-r-full font-semibold hover:bg-yellow-300 transition-colors"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}