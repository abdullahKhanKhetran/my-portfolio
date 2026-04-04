"use client";

export default function ContactSection({ motionSigned = 0, motionDirection = -1 }) {
  const contentShift = motionSigned * motionDirection * 9;

  return (
    <section
      id="contact"
      className="py-20 px-4 text-white dark:text-black"
    >
      <div
        style={{ transform: `translate3d(${contentShift}vw, 0, 0)` }}
        className="max-w-2xl mx-auto text-center will-change-transform"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>

        <p className="text-lg text-gray-300 dark:text-gray-700 mb-12">
          I'm always interested in hearing about new projects and opportunities.
          Feel free to reach out!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href="mailto:abdullahkhitran2005@gmail.com"
            className="px-8 py-3 bg-white dark:bg-black text-black dark:text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
          >
            Send Email
          </a>
          <a
            href="https://www.linkedin.com/in/abdullah-khan-845607362/"
            className="px-8 py-3 border-2 border-white dark:border-black text-white dark:text-black font-semibold rounded-lg hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Connect on LinkedIn
          </a>
        </div>

        <div className="space-y-4 text-gray-300 dark:text-gray-700">
          <p className="text-sm">
            Email: <span className="font-semibold">abdullahkhitran2005@gmail.com</span>
          </p>
          <p className="text-sm">
            Location: <span className="font-semibold">Pakistan</span>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 dark:border-gray-300">
          <p className="text-sm text-gray-400 dark:text-gray-600">
            © {new Date().getFullYear()} Abdullah - Full Stack Developer. All rights
            reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
