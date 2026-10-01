// ALL business-specific content lives here. Edit this file to make a new salon's site.
const SALON = {
  name: "Elegant Nails and Spa",
  tagline: "You've earned it",
  address: "#11 - 2483 Main St, West Kelowna, BC V4T 2E8",
  phone: "250-452-9656",
  // Leave empty ("") to make the Book Now buttons call the phone number instead.
  bookingLink: "",
  instagram: "", // handle only, e.g. "elegantnails" (leave empty to hide)
  hours: ["Hours coming soon"], // or e.g. ["Mon–Fri: 9am–6pm", "Sat: 10am–5pm", "Sun: Closed"]
  // Optional per-service `icon`: "polish" | "gel" | "foot" | "wax" | "lash" | "sparkle".
  // If omitted, the icon is picked from the service name.
  services: [
    { name: "Gel nails", price: "$XX", description: "Long-lasting shine and colour." },
    { name: "Acrylic nails", price: "$XX", description: "Sculpted strength and length." },
    { name: "Pedicures", price: "$XX", description: "Soak, scrub and polish." },
    { name: "Waxing", price: "$XX", description: "Smooth, gentle hair removal." },
    { name: "Eyelash extensions", price: "$XX", description: "Full, natural-looking lashes." }
  ],
  // The three scroll-pinned "how it works" steps.
  steps: [
    { title: "Choose your service", text: "Browse the menu, pick what you love, and book in a tap." },
    { title: "Relax", text: "Sink into the chair while our team takes careful, beautiful care of every detail." },
    { title: "Leave glowing", text: "Walk out with a flawless finish that shines for weeks." }
  ],
  about: "Welcome to Elegant Nails and Spa, a relaxing space in West Kelowna where you can unwind and treat yourself. Our friendly team takes pride in careful, beautiful work.",
  accent: "#b76e79", // rose gold
  // Polish shades for the "pick your colour" row. Use {name, hex} (or just a hex string).
  colours: [
    { name: "Rose Gold", hex: "#b76e79" },
    { name: "Blush Petal", hex: "#f2b8c6" },
    { name: "Ballet Slipper", hex: "#f4d6d2" },
    { name: "Berry Kiss", hex: "#a8325e" },
    { name: "Classic Red", hex: "#c4283c" },
    { name: "Champagne", hex: "#e3c79a" },
    { name: "Lavender Haze", hex: "#bba6d6" },
    { name: "Midnight", hex: "#2e2a47" }
  ],
  // Gallery photos. Put image files in the /media folder and list them here, e.g.
  //   photos: ["nails-1.jpg", "nails-2.jpg"]   (bare names are looked up in media/)
  //   photos: [{ src: "media/set-a.jpg", alt: "Rose chrome set" }]
  // Leave empty ([]) to show soft gradient placeholders.
  photos: [],
  // Hero background video (muted, autoplaying, looping), e.g. "hero.mp4" from media/.
  // Leave empty ("") to show the animated polish-bottle illustration instead.
  heroVideo: "",
  heroPoster: "", // optional still image shown while the video loads
  demoBanner: "Sample design by Noor Al-Hayali — preview only, not the official website." // set to "" to remove
};
