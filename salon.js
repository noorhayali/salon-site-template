// ALL business-specific content lives here. Edit this file to make a new salon's site.
const SALON = {
  name: "Elegant Nails and Spa",
  tagline: "You've earned it",
  address: "#11 - 2483 Main St, West Kelowna, BC V4T 2E8",
  phone: "250-452-9656",
  email: "", // optional; adds an Email option to the booking sheet
  // Optional online booking page. If set, "Book online" is the first option in the booking sheet.
  // Every Book button opens the sheet, which also offers Call / Text / Email when that data exists.
  bookingLink: "",
  instagram: "", // handle only, e.g. "elegantnails" (leave empty to hide)
  hours: ["Hours coming soon"], // or e.g. ["Mon–Fri: 9am–6pm", "Sat: 10am–5pm", "Sun: Closed"]
  // The single source of truth for the menu: it drives both the "Services" cards and the
  // "Choose your treatment" picker. Each category has a name, an `icon` and its services.
  // `icon` is a built-in name ("polish" | "gel" | "foot" | "wax" | "lash" | "sparkle")
  // or your own inline SVG string, e.g. '<svg viewBox="0 0 48 48">…</svg>'.
  // `price` is shown as written, so "$50" or "Ask for pricing" both work.
  serviceCategories: [
    {
      name: "Nails", icon: "polish",
      services: [
        { name: "Acrylic Full Set", price: "$50" },
        { name: "Acrylic White Fill", price: "$45" },
        { name: "Gel Full Set", price: "$60" },
        { name: "Gel Clear Fill", price: "$50" },
        { name: "Gel White Fill", price: "$55" },
        { name: "Solar Full Set White French", price: "$60" },
        { name: "Solar Full Set Clear", price: "$55" },
        { name: "Solar Clear Fill", price: "$45" },
        { name: "Solar Color & White Fill", price: "$50" },
        { name: "Shellac Gel Color", price: "$30" },
        { name: "Shellac Gel French", price: "$40" },
        { name: "Color Change", price: "$10" }
      ]
    },
    {
      name: "Spa", icon: "foot",
      services: [
        { name: "Manicure", price: "$25" },
        { name: "Pedicure", price: "$40" },
        { name: "Pedi & Mani", price: "$55" },
        { name: "Kids Pedi & Mani", price: "$35" },
        { name: "Paraffin Wax Hands", price: "$10" },
        { name: "Paraffin Wax Feet", price: "$15" }
      ]
    },
    {
      name: "Waxing", icon: "wax",
      services: [
        { name: "Eyebrows", price: "$10" },
        { name: "Upper Lip", price: "$7" },
        { name: "Chin", price: "$8" },
        { name: "Under Arm", price: "$18" },
        { name: "Half Leg", price: "$30" }
      ]
    },
    {
      name: "Lashes", icon: "lash",
      services: [
        { name: "Eyelash Extensions", price: "Ask for pricing" }
      ]
    }
  ],
  // The three scroll-pinned "how it works" steps.
  steps: [
    { title: "Choose your service", text: "Browse the menu, pick what you love, and book in a tap." },
    { title: "Relax", text: "Sink into the chair while our team takes careful, beautiful care of every detail." },
    { title: "Leave glowing", text: "Walk out with a flawless finish that shines for weeks." }
  ],
  about: "Welcome to Elegant Nails and Spa, a relaxing space in West Kelowna where you can unwind and treat yourself. Our friendly team takes pride in careful, beautiful work.",
  accent: "#b76e79", // rose gold
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
