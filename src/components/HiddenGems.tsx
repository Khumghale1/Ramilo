const hiddenGems = [
  {
    id: 1,
    name: 'Namchi Falls',
    location: 'Shivapuri National Park',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&q=80',
  },
  {
    id: 2,
    name: "Ama's Tea House",
    location: 'Budhanilkantha',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',
  },
  {
    id: 3,
    name: 'Keisar Library',
    location: 'Kantipath',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
  },
]

export default function HiddenGems() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hidden Gems</h2>
        <p className="text-gray-500 mb-8">
          Quiet corners and secret escapes known only to locals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hiddenGems.map((gem) => (
            <div
              key={gem.id}
              className="relative h-56 rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={gem.image}
                alt={gem.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-white font-semibold leading-tight">{gem.name}</h3>
                <p className="text-white/75 text-sm mt-0.5">{gem.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
