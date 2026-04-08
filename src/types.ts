export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  color: string;
  platform: 'Flipkart' | 'Amazon' | 'Myntra' | 'Ajio' | 'Nykaa';
  sourceUrl: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "OVERSIZED GRAPHIC TEE",
    price: 1299,
    category: "Streetwear",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
    description: "Trending oversized graphic tee with urban aesthetics.",
    color: "#ff4e00",
    platform: "Myntra",
    sourceUrl: "https://www.myntra.com/tshirts/oversized-graphic-tee/123456/buy"
  },
  {
    id: "2",
    name: "CARGO UTILITY PANTS",
    price: 2499,
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
    description: "Multi-pocket utility cargo pants for the techwear look.",
    color: "#00ff00",
    platform: "Ajio",
    sourceUrl: "https://www.ajio.com/men-cargo-pants/p/461234567_olive"
  },
  {
    id: "3",
    name: "PUFFER VEST 2.0",
    price: 3999,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
    description: "Lightweight insulated puffer vest for layering.",
    color: "#00e5ff",
    platform: "Amazon",
    sourceUrl: "https://www.amazon.in/dp/B07X123456"
  },
  {
    id: "4",
    name: "CHUNKY PLATFORM SNEAKERS",
    price: 5499,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    description: "Bold chunky sneakers with platform soles.",
    color: "#ff00ff",
    platform: "Flipkart",
    sourceUrl: "https://www.flipkart.com/sneakers/p/itm123456789"
  },
  {
    id: "5",
    name: "MINIMALIST TOTE BAG",
    price: 899,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1544816153-12ad5d7133a2?auto=format&fit=crop&q=80&w=800",
    description: "Clean aesthetic tote bag for daily essentials.",
    color: "#ffffff",
    platform: "Nykaa",
    sourceUrl: "https://www.nykaa.com/accessories/tote-bag/p/987654"
  },
  {
    id: "6",
    name: "VINTAGE DENIM JACKET",
    price: 3299,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&q=80&w=800",
    description: "Classic oversized denim jacket with distressed finish.",
    color: "#4a90e2",
    platform: "Myntra",
    sourceUrl: "https://www.myntra.com/jackets/denim-jacket/654321/buy"
  },
  {
    id: "7",
    name: "URBAN BEANIE",
    price: 499,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
    description: "Soft knit beanie for the perfect street style.",
    color: "#000000",
    platform: "Ajio",
    sourceUrl: "https://www.ajio.com/accessories-beanie/p/469876543_black"
  },
  {
    id: "8",
    name: "RETRO SUNGLASSES",
    price: 1599,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767390-a7335958beba?auto=format&fit=crop&q=80&w=800",
    description: "90s inspired retro sunglasses with tinted lenses.",
    color: "#ffcc00",
    platform: "Nykaa",
    sourceUrl: "https://www.nykaa.com/accessories/sunglasses/p/123987"
  }
];
