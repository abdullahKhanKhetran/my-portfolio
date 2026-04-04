"use client";

export default function TestimonialsSection({ motionSigned = 0, motionDirection = 1 }) {
  const testimonials = [
    {
      name: "Tech Startup Founder",
      company: "StartupX",
      quote:
        "Abdullah delivered a flawless mobile app that exceeded our expectations. His attention to detail and DevOps expertise saved us months of development time.",
    },
    {
      name: "Business Owner",
      company: "Alnoor Enterprises",
      quote:
        "The ERP system Abdullah built transformed our business operations completely. The vibrant UI made it easy for our team to adopt immediately.",
    },
    {
      name: "Project Manager",
      company: "Educational Platform",
      quote:
        "Working with Abdullah on the Class Mind platform was a pleasure. His full-stack expertise and responsive design approach are industry-leading.",
    },
  ];

  const contentShift = motionSigned * motionDirection * 10;

  return (
    <section className="py-20 px-4">
      <div style={{ transform: `translate3d(${contentShift}vw, 0, 0)` }} className="will-change-transform">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black dark:text-white">
        Testimonials
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-l-4 border-black dark:border-white"
          >
            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6 italic">
              "{testimonial.quote}"
            </p>
            <div>
              <p className="font-bold text-black dark:text-white">
                {testimonial.name}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {testimonial.company}
              </p>
            </div>
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500">
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
