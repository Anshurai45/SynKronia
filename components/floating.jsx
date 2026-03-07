/* eslint-disable @next/next/no-img-element */
"use client";

export default function FloatingEvents() {
  const events = [
    {
      title: "Music",
      image: "/events/music.jpg",
      class: "top-10 left-10",
    },
    {
      title: "Tech",
      image: "/events/tech.jpg",
      class: "top-20 right-10",
    },
    {
      title: "Sports",
      image: "/events/sports.jpg",
      class: "bottom-20 left-16",
    },
    {
      title: "Art",
      image: "/events/art.jpg",
      class: "bottom-10 right-20",
    },
    {
      title: "Startup",
      image: "/events/startup.jpg",
      class: "top-1/2 left-0",
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {events.map((event, index) => (
        <div
          key={index}
          className={`absolute ${event.class} w-24 h-24 rounded-full border-4 border-green-400 overflow-hidden shadow-lg`}
        >
          <img src={event.image} className="w-full h-full object-cover" />

          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded">
            {event.title}
          </span>
        </div>
      ))}
    </div>
  );
}
