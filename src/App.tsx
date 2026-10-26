import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Check,
  ShieldCheck,
  Truck,
  PhoneCall,
  Sparkles,
  Eye,
  ArrowRight,
  MessageCircle,
  PackageCheck,
  CheckCircle2,
  Layers,
  Paintbrush,
  Wrench,
  Grid,
  ChevronDown
} from 'lucide-react';

// Types
export interface ProductVariant {
  name: string;
  weight: string;
  price: number; // in PKR
  image: string;
}

export interface Product {
  id: string;
  title: string;
  category: 'Building Chemicals' | 'Paints' | 'Hardware' | 'Curtains & Blinds' | 'Wall Decoration';
  priceType: 'fixed' | 'ask_price';
  basePrice?: number; // for fixed
  variants?: ProductVariant[];
  selectedVariantIndex?: number;
  image?: string; // empty if photo coming soon
  badge?: string;
  description: string;
  features: string[];
  specs?: { label: string; value: string }[];
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  category: string;
  variantName?: string;
  price: number;
  image?: string;
  quantity: number;
}

const WHATSAPP_NUMBER = '923421234789';
const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const CATEGORIES = [
  'All Categories',
  'Building Chemicals',
  'Paints',
  'Hardware',
  'Curtains & Blinds',
  'Wall Decoration'
] as const;

type CategoryType = typeof CATEGORIES[number];

// Helper to resolve relative asset URLs for GitHub Pages, custom domains, and subdirectories
export const getAssetUrl = (path?: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || './';
  return `${base}${clean}`;
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'rakson-sealant',
    title: 'RAKSON Anti-Leakage Sealant',
    category: 'Building Chemicals',
    priceType: 'fixed',
    basePrice: 1900,
    badge: '100% Powerful',
    image: getAssetUrl('/assets/building-chemicals.jpg'),
    description: '100% powerful multi-purpose waterproof & anti-leaking bonding agent. Penetrates deep into cracks and stops water seepage, roof leaks, bathroom dampness, and tank leakages permanently.',
    features: [
      '100% Powerful Anti-Leakage Formula',
      'Stops Roof Seepage & Bathroom Dampness',
      'UV & Weather Proof for Pakistan Climate',
      'Easy Brush & Roller Application'
    ],
    variants: [
      { name: '300g Jar', weight: '300g', price: 950, image: getAssetUrl('/assets/rakson-sealant-300g.jpg') },
      { name: '1 Kg Bucket', weight: '1kg', price: 1900, image: getAssetUrl('/assets/rakson-sealant-1kg.jpg') },
      { name: '4 Kg Bucket', weight: '4kg', price: 6800, image: getAssetUrl('/assets/rakson-sealant-4kg.jpg') },
      { name: '16 Kg Drum', weight: '16kg', price: 24500, image: getAssetUrl('/assets/rakson-sealant-16kg.jpg') }
    ]
  },
  {
    id: 'rakson-roof-coat-7000',
    title: 'RAKSON Roof Coat (Water Proof & Heat Proof Coating - 7000 Series)',
    category: 'Building Chemicals',
    priceType: 'fixed',
    basePrice: 950,
    badge: 'Heat & Water Proof',
    image: getAssetUrl('/assets/rakson-roof-coat-1kg.png'),
    description: '100% Powerfull Water Proof & Heat Proof 7000 Coating. Acts as a leakage sealer, water resistant barrier, heat block, and solar light resistor. Long lasting rubber sealant agent for roofs and terraces.',
    features: [
      'Dual Action: Water Proof & Heat Proof Barrier',
      'Solar Light Resistor & Thermal Heat Block',
      'Crack-Bridging Elastic Liquid Rubber',
      'Tested for Pakistan Summer Extremes'
    ],
    variants: [
      { name: '1 Kg Jar (Retail Rs 950)', weight: '1kg', price: 950, image: getAssetUrl('/assets/rakson-roof-coat-1kg.png') },
      { name: '4.5 Kg Bucket (Retail Rs 3,450)', weight: '4.5kg', price: 3450, image: getAssetUrl('/assets/rakson-roof-coat-4-5kg.png') },
      { name: '18 Kg Drum (Retail Rs 23,500)', weight: '18kg', price: 23500, image: getAssetUrl('/assets/rakson-roof-coat-18kg.png') }
    ]
  },
  {
    id: 'roof-coat-rakson',
    title: 'RAKSON Super Wall Emulsion (Interior Matt Finish)',
    category: 'Paints',
    priceType: 'ask_price',
    badge: 'Smooth Matt',
    image: getAssetUrl('/assets/rakson-wall-emulsion.jpg'),
    description: 'Premium interior paint providing a rich, smooth matt finish for living rooms and bedrooms. Exceptional scrub resistance and stain-repellent formula.',
    features: [
      'Velvety Smooth Luxury Matt Texture',
      'High Coverage & Low Odor Formulation',
      'Anti-Fungal & Washable Surface',
      'Available in All Modern Pastel Shades'
    ]
  },
  {
    id: 'wall-putty',
    title: 'Wall Putty',
    category: 'Paints',
    priceType: 'ask_price',
    badge: 'Base Coat',
    image: '',
    description: 'Ultra-fine water-resistant polymer wall putty for smooth exterior and interior surface finishing before paint application. Fills hairline cracks and provides a pristine, flat surface.',
    features: [
      'High Binding Strength with Plaster',
      'Resistant to Moisture & Efflorescence',
      'Silky Smooth Finish for Gloss/Matt Paints',
      'Available in 20kg & 40kg Bags'
    ]
  },
  {
    id: 'hardware-door-handle',
    title: 'Modern Stainless Steel Door Handle',
    category: 'Hardware',
    priceType: 'ask_price',
    badge: 'SUS 304 Grade',
    image: getAssetUrl('/assets/hardware-door-handle.jpg'),
    description: 'Architectural brushed satin nickel ergonomic lever door handle. Built for solid core interior, bedroom, and main entrance doors with smooth spring action.',
    features: [
      'SUS 304 Grade Corrosion-Resistant Metal',
      'Ergonomic Minimalist Square-Round Rosette',
      'Tested for Over 200,000 Open-Close Cycles',
      'Includes Spindle, Screws & Keyhole Escutcheon'
    ]
  },
  {
    id: 'hardware-door-hinge',
    title: 'Solid Brass Heavy Duty Door Hinges',
    category: 'Hardware',
    priceType: 'ask_price',
    badge: 'Heavy Duty',
    image: getAssetUrl('/assets/hardware-door-hinge.jpg'),
    description: 'Solid brass ball-bearing butt door hinges with precision counter-sunk screw holes. Silent, smooth door swing for heavy solid wood doors.',
    features: [
      '100% Solid Brass Casting',
      'Dual Stainless Steel Ball Bearings',
      'No Creaking or Door Sagging',
      'Supplied with Matching Solid Brass Screws'
    ]
  },
  {
    id: 'curtains-luxury',
    title: 'Curtains (Luxury Sheer Linen)',
    category: 'Curtains & Blinds',
    priceType: 'ask_price',
    badge: 'Custom Stitched',
    image: getAssetUrl('/assets/curtains-sheer.jpg'),
    description: 'Premium sheer drapery and custom stitched designer curtains. Crafted from breathable woven fabrics with elegant bottom borders to soften natural sunlight in living rooms and bedrooms.',
    features: [
      'Custom Measurements & Stitching Available',
      'Fade-Resistant Premium Linen Fabric',
      'Grommet / Eyelet & Rod Pocket Options',
      'Soft Sunlight Filtering & Privacy'
    ]
  },
  {
    id: 'window-blinds-wooden',
    title: 'Wooden Venetian Window Blinds',
    category: 'Curtains & Blinds',
    priceType: 'ask_price',
    badge: 'Natural Wood',
    image: getAssetUrl('/assets/blinds-wooden.jpg'),
    description: 'Custom-fit Wooden Venetian Blinds for modern Pakistani homes and executive offices. Rich walnut/teak grain slats with precision light angle cords.',
    features: [
      'Precision Slat Tilt Light Control',
      'Natural Teak Wood Grain Finish',
      'Heavy Duty Aluminum Track & Cord System',
      'Thermal & Glare Reduction'
    ]
  },
  {
    id: 'window-blinds-zebra',
    title: 'Zebra Day & Night Roller Blinds',
    category: 'Curtains & Blinds',
    priceType: 'ask_price',
    badge: 'Modern Roller',
    image: getAssetUrl('/assets/blinds-zebra.jpg'),
    description: 'Dual layer fabric Zebra roller blinds allowing flexible transition between filtered sunlight and total nighttime privacy.',
    features: [
      'Alternating Sheer and Dim-Out Horizontal Stripes',
      'Smooth Ball-Chain Clutch Control',
      'Easy Clean Dust-Resistant Polyester Fabric',
      'Made-to-Measure Window Fitting'
    ]
  },
  {
    id: 'wall-decoration-tree',
    title: 'Geometric Tree 3D Metal Wall Art',
    category: 'Wall Decoration',
    priceType: 'ask_price',
    badge: 'Artisan Crafted',
    image: getAssetUrl('/assets/wall-art-tree.jpg'),
    description: 'Statement laser-cut 3D geometric tree wall art. Features contemporary tree canopy designs in brushed antique gold and matte bronze finish.',
    features: [
      'Handcrafted Architectural Metalwork',
      'Rust-Proof Powder Coated Electrostatic Finish',
      'Ready to Hang with Built-in Standoff Spacers',
      'Creates Stunning 3D Shadow Depth on Walls'
    ]
  },
  {
    id: 'wall-decoration-honeycomb',
    title: 'Hexagonal Honeycomb Metal Sculpture',
    category: 'Wall Decoration',
    priceType: 'ask_price',
    badge: 'Modern Luxury',
    image: getAssetUrl('/assets/wall-art-geometric.jpg'),
    description: 'Sculptural 3D interconnected hexagonal grid wall decor. Contemporary geometric centerpiece for feature walls, lounges, and entry halls.',
    features: [
      'Multi-Dimensional Wireframe Architecture',
      'Gold Brass Joint Accents on Matte Charcoal Rods',
      'Floating Wall Bracket Included',
      'Corrosion Protected Finish'
    ]
  }
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({
    'rakson-sealant': 1,
    'rakson-roof-coat-7000': 0
  });
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerCity, setCustomerCity] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return INITIAL_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All Categories' || product.category === selectedCategory;

      const matchesSearch =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleVariantChange = (productId: string, variantIndex: number) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantIndex }));
  };

  const addToCart = (product: Product, variantIndex?: number) => {
    const vIndex = variantIndex !== undefined ? variantIndex : (selectedVariants[product.id] ?? 0);
    const variant = product.variants ? product.variants[vIndex] : undefined;
    const price = variant ? variant.price : (product.basePrice ?? 0);
    const itemImage = variant ? variant.image : product.image;
    const itemId = variant ? `${product.id}-${variant.weight}` : product.id;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          title: product.title,
          category: product.category,
          variantName: variant ? variant.name : undefined,
          price,
          image: itemImage,
          quantity: 1
        }
      ];
    });

    showToast(`Added ${product.title} ${variant ? `(${variant.weight})` : ''} to Cart!`);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const totalCartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    let message = `*HOME DEPO - NEW ORDER INQUIRY*\n`;
    message += `_An Online Store For Your Home Improvement_\n\n`;
    message += `*ORDER ITEMS:*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.title}*\n`;
      if (item.variantName) message += `   Size/Variant: ${item.variantName}\n`;
      message += `   Qty: ${item.quantity} x PKR ${item.price.toLocaleString()} = PKR ${(item.price * item.quantity).toLocaleString()}\n`;
    });

    message += `\n*TOTAL AMOUNT:* PKR ${cartTotal.toLocaleString()} + Delivery\n\n`;

    if (customerName || customerPhone || customerCity || customerAddress) {
      message += `*CUSTOMER DETAILS:*\n`;
      if (customerName) message += `• Name: ${customerName}\n`;
      if (customerPhone) message += `• Phone: ${customerPhone}\n`;
      if (customerCity) message += `• City: ${customerCity}\n`;
      if (customerAddress) message += `• Address: ${customerAddress}\n`;
    }

    message += `\nPlease confirm availability and delivery charges to my address. Thank you!`;
    const encoded = encodeURIComponent(message);
    window.open(`${WHATSAPP_BASE_URL}?text=${encoded}`, '_blank');
  };

  const handleAskPrice = (product: Product) => {
    const message = `Hello HOME DEPO team! I am interested in *${product.title}* from your *${product.category}* section. Could you please share the current price, specifications, and delivery details?`;
    const encoded = encodeURIComponent(message);
    window.open(`${WHATSAPP_BASE_URL}?text=${encoded}`, '_blank');
  };

  const handleDirectWhatsAppOrder = (product: Product, variant?: ProductVariant) => {
    const size = variant ? ` (${variant.weight})` : '';
    const priceText = variant ? ` at PKR ${variant.price.toLocaleString()}` : '';
    const message = `Hello HOME DEPO! I would like to order *${product.title}${size}*${priceText}. Please share delivery time and payment process.`;
    const encoded = encodeURIComponent(message);
    window.open(`${WHATSAPP_BASE_URL}?text=${encoded}`, '_blank');
  };

  const selectCategoryAndScroll = (cat: CategoryType) => {
    setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-gray-900 flex flex-col font-sans">
      <div className="bg-[#0B3D26] text-emerald-100 text-xs sm:text-sm py-2 px-4 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#13A163] animate-pulse"></span>
            <span className="font-medium">Pakistan-wide Delivery | Original RAKSON Sealants, Paints & Home Decor</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-xs text-emerald-200">
            <a href="https://wa.me/923421234789" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center space-x-1">
              <MessageCircle className="w-3.5 h-3.5 text-[#13A163]" />
              <span>WhatsApp: +92 342 1234789</span>
            </a>
            <span>•</span>
            <span>Delivery: 2-4 Days</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none group" onClick={() => { setSelectedCategory('All Categories'); setSearchQuery(''); }}>
              <div className="h-10 sm:h-12 w-auto overflow-hidden rounded-lg shadow-xs border border-gray-300/80 bg-[#181c1f] p-0.5 shrink-0 flex items-center">
                <img src={getAssetUrl('/assets/logo-home-depo')} alt="HOME DEPO Logo" className="h-full w-auto object-contain transition group-hover:scale-105" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-[#0B3D26] leading-none">HOME DEPO</span>
                <span className="text-[9px] sm:text-[11px] font-semibold text-[#13A163] tracking-wide uppercase mt-0.5">An Online Store For Your Home Improvement</span>
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-md relative">
              <input type="text" placeholder="Search chemicals, paints, hardware, blinds, decor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-9 py-2 rounded-full border border-gray-300 bg-gray-50/70 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#13A163] focus:border-transparent" />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <a href={WHATSAPP_BASE_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 text-[#0B3D26] text-xs font-semibold hover:bg-emerald-100 transition border border-emerald-200">
                <MessageCircle className="w-4 h-4 text-[#13A163]" />
                <span>Quick WhatsApp</span>
              </a>

              <button onClick={() => setIsCartOpen(true)} className="relative flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-[#0B3D26] text-white hover:bg-[#072818] transition shadow-xs cursor-pointer" aria-label="Open Cart">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Cart</span>
                {totalCartCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-extrabold bg-[#13A163] text-white rounded-full">{totalCartCount}</span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-2.5 md:hidden relative">
            <input type="text" placeholder="Search RAKSON, roof coat, blinds, hinges..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#13A163]" />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#0B3D26]/5 border-t border-gray-200 overflow-x-auto scrollbar-none py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 min-w-max">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button key={cat} onClick={() => selectCategoryAndScroll(cat)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${isActive ? 'bg-[#0B3D26] text-white shadow-xs scale-102 ring-2 ring-[#13A163]/50' : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-[#0B3D26] border border-gray-200'}`}>
                  {cat === 'All Categories' && <span>✨</span>}
                  {cat === 'Building Chemicals' && <span>🧪</span>}
                  {cat === 'Paints' && <span>🎨</span>}
                  {cat === 'Hardware' && <span>🔧</span>}
                  {cat === 'Curtains & Blinds' && <span>🪟</span>}
                  {cat === 'Wall Decoration' && <span>🖼️</span>}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <section className="relative bg-[#0B3D26] text-white overflow-hidden py-10 sm:py-14 transition-all duration-300">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#13A163_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#13A163]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#13A163]/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCategory === 'All Categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#13A163]/25 border border-[#13A163]/40 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Your One-Stop Home Depot</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">HOME DEPO - An Online Store For Your Home Improvement</h1>
                <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">An easy way to approach household items through online. From building chemicals and paints to kitchen accessories and interior decor - delivered to your doorstep.</p>

                <div className="pt-2">
                  <div className="text-xs text-emerald-300 font-semibold mb-2">Browse By Department:</div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => selectCategoryAndScroll('Building Chemicals')} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium border border-white/10 transition cursor-pointer">🧪 Building Chemicals</button>
                    <button onClick={() => selectCategoryAndScroll('Paints')} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium border border-white/10 transition cursor-pointer">🎨 Paints & Roof Coat</button>
                    <button onClick={() => selectCategoryAndScroll('Hardware')} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium border border-white/10 transition cursor-pointer">🔧 Door Hardware</button>
                    <button onClick={() => selectCategoryAndScroll('Curtains & Blinds')} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium border border-white/10 transition cursor-pointer">🪟 Curtains & Blinds</button>
                    <button onClick={() => selectCategoryAndScroll('Wall Decoration')} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium border border-white/10 transition cursor-pointer">🖼️ Wall Art</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-xs"><ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /><span>100% Genuine Brands</span></div>
                  <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-xs"><Truck className="w-4 h-4 text-emerald-400 shrink-0" /><span>All Pakistan Delivery</span></div>
                  <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-xs col-span-2 sm:col-span-1"><PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" /><span>WhatsApp Order Support</span></div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-white/95 text-gray-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/30 backdrop-blur-sm">
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-16/10 mb-4 group shadow-md">
                    <img src={getAssetUrl('/assets/home-depo-hero-banner.jpg')} alt="HOME DEPO Luxury Home Improvement Showcase" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <div className="text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">Interior & Exterior Renovation</span>
                        <h4 className="font-bold text-sm sm:text-base leading-tight">Chemicals • Paints • Hardware • Blinds • Decor</h4>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <button onClick={() => selectCategoryAndScroll('Building Chemicals')} className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0B3D26] font-bold border border-emerald-200 transition cursor-pointer"><div className="text-base">🧪</div><div className="text-[10px] mt-0.5">Sealants</div></button>
                    <button onClick={() => selectCategoryAndScroll('Paints')} className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0B3D26] font-bold border border-emerald-200 transition cursor-pointer"><div className="text-base">🎨</div><div className="text-[10px] mt-0.5">Roof Coat</div></button>
                    <button onClick={() => selectCategoryAndScroll('Curtains & Blinds')} className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0B3D26] font-bold border border-emerald-200 transition cursor-pointer"><div className="text-base">🪟</div><div className="text-[10px] mt-0.5">Blinds</div></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <main id="products-section" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-gray-200 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-[#13A163] tracking-wider">
              <span>{selectedCategory} Products</span>
              <span>•</span>
              <span>{filteredProducts.length} Items Listed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3D26] mt-1">{selectedCategory === 'All Categories' ? 'All Home Improvement Products' : selectedCategory}</h2>
          </div>

          <div className="text-xs text-gray-500 flex items-center space-x-2">
            <PackageCheck className="w-4 h-4 text-[#13A163]" />
            <span>Select sizes or click Ask Price for instant WhatsApp quote</span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No products found</h3>
            <p className="text-sm text-gray-500 mt-1">Try clearing your search query or selecting another category.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); }} className="mt-4 px-4 py-2 bg-[#0B3D26] text-white rounded-lg text-xs font-semibold cursor-pointer">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => {
              const currentVariantIdx = selectedVariants[product.id] ?? 0;
              const activeVariant = product.variants ? product.variants[currentVariantIdx] : undefined;
              const displayImage = activeVariant?.image || product.image;
              const hasImage = Boolean(displayImage && displayImage.trim() !== '');

              return (
                <div key={product.id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
                  <div onClick={() => setSelectedProduct(product)} className="relative aspect-square w-full overflow-hidden cursor-pointer select-none">
                    {hasImage ? (
                      <img src={displayImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full bg-[#E8F8F0] border-2 border-dashed border-[#13A163]/30 flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-[#13A163] mb-2 shadow-xs"><Sparkles className="w-6 h-6" /></div>
                        <span className="text-xs sm:text-sm font-bold text-[#0B3D26]">Photo coming soon</span>
                        <span className="text-[10px] text-[#13A163] mt-0.5 font-medium">Quality Assured • Ask details</span>
                      </div>
                    )}

                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-[#0B3D26] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">{product.badge}</span>
                    )}

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 text-[#0B3D26] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1"><Eye className="w-3.5 h-3.5" /><span>Quick View</span></span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#13A163] uppercase tracking-wider">{product.category}</span>
                      <h3 onClick={() => setSelectedProduct(product)} className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 line-clamp-2 hover:text-[#0B3D26] cursor-pointer">{product.title}</h3>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>

                      {product.variants && product.variants.length > 0 && (
                        <div className="mt-2.5">
                          <div className="text-[10px] text-gray-500 font-semibold mb-1">Available Sizes:</div>
                          <div className={`grid ${product.variants.length > 3 ? 'grid-cols-2' : 'grid-cols-3'} gap-1`}>
                            {product.variants.map((v, idx) => {
                              const isSelected = idx === currentVariantIdx;
                              return (
                                <button key={v.weight} onClick={(e) => { e.stopPropagation(); handleVariantChange(product.id, idx); }} className={`px-1.5 py-1 text-[10px] font-bold rounded border transition text-center cursor-pointer ${isSelected ? 'bg-[#0B3D26] text-white border-[#0B3D26]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50'}`}>
                                  {v.weight}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        {product.priceType === 'fixed' ? (
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase font-medium">Price in PKR</span>
                            <span className="text-sm sm:text-base font-extrabold text-[#0B3D26]">PKR {(activeVariant?.price ?? product.basePrice ?? 0).toLocaleString()}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase font-medium">Pricing</span>
                            <span className="text-xs sm:text-sm font-bold text-[#13A163]">Ask Price</span>
                          </div>
                        )}
                      </div>

                      {product.priceType === 'fixed' ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => addToCart(product, currentVariantIdx)} className="flex-1 py-2 px-2 rounded-lg bg-[#0B3D26] hover:bg-[#072818] text-white text-[11px] sm:text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer">
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                          <button onClick={() => handleDirectWhatsAppOrder(product, activeVariant)} className="p-2 rounded-lg bg-emerald-50 text-[#0B3D26] hover:bg-emerald-100 transition border border-emerald-200" title="Order directly via WhatsApp">
                            <MessageCircle className="w-3.5 h-3.5 text-[#13A163]" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleAskPrice(product)} className="w-full py-2 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0B3D26] text-[11px] sm:text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer">
                          <MessageCircle className="w-3.5 h-3.5 text-[#13A163]" />
                          <span>Ask on WhatsApp</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <a href={WHATSAPP_BASE_URL} target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 z-40 flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl transition duration-200 transform hover:scale-105" aria-label="Contact us on WhatsApp">
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="font-bold text-xs sm:text-sm tracking-wide hidden sm:inline">Order on WhatsApp</span>
      </a>

      <footer className="bg-[#0B3D26] text-white border-t border-emerald-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-12 sm:h-14 w-auto overflow-hidden rounded-xl shadow-md border border-white/20 bg-[#161a1d] p-1 shrink-0 flex items-center">
                  <img src={getAssetUrl('/assets/logo-home-depo')} alt="HOME DEPO Logo" className="h-full w-auto object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">HOME DEPO</span>
                  <span className="text-[10px] sm:text-xs text-emerald-300 font-semibold tracking-wide uppercase mt-1">An Online Store For Your Home Improvement</span>
                </div>
              </div>
              <p className="text-xs text-emerald-300/80 max-w-md leading-relaxed">An easy way to approach household items through online. From building chemicals and paints to kitchen accessories and interior decor - delivered to your doorstep.</p>
              <div className="pt-2 text-xs text-emerald-200 flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#13A163]" />
                <span>Customer Care & Orders: +92 342 1234789</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3">Departments</h4>
              <ul className="space-y-1.5 text-xs text-emerald-100/80">
                {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                  <li key={c}><button onClick={() => selectCategoryAndScroll(c)} className="hover:text-white transition cursor-pointer">{c}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3">Order & Support</h4>
              <p className="text-xs text-emerald-200/80 mb-3 leading-relaxed">Need help with RAKSON Sealant or custom blinds measurements? Talk directly with our team.</p>
              <a href={WHATSAPP_BASE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1.5 bg-[#13A163] hover:bg-[#0f8b54] text-white text-xs font-bold px-3 py-2 rounded-lg transition">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp +92 342 1234789</span>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/60 gap-2">
            <p>© {new Date().getFullYear()} HOME DEPO. All rights reserved.</p>
            <p>Delivery across Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan & Nationwide.</p>
          </div>
        </div>
      </footer>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-4 bg-[#0B3D26] text-white flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="h-7 w-auto overflow-hidden rounded bg-[#181c1f] border border-white/20 p-0.5 shrink-0 flex items-center">
                    <img src={getAssetUrl('/assets/logo-home-depo')} alt="Logo" className="h-full w-auto object-contain" />
                  </div>
                  <h3 className="font-bold text-base">Your Cart ({totalCartCount})</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition" aria-label="Close cart">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="font-bold text-gray-700">Your cart is empty</p>
                    <p className="text-xs text-gray-400 mt-1">Explore our departments and add items like RAKSON Sealant or Roof Coat!</p>
                    <button onClick={() => setIsCartOpen(false)} className="mt-4 px-4 py-2 bg-[#0B3D26] text-white text-xs font-bold rounded-lg cursor-pointer">Browse Products</button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-emerald-50 text-[9px] text-[#13A163] font-bold p-1 text-center flex items-center justify-center">No Photo</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                        {item.variantName && <p className="text-[11px] text-[#13A163] font-semibold">{item.variantName}</p>}
                        <p className="text-xs font-extrabold text-[#0B3D26] mt-0.5">PKR {item.price.toLocaleString()}</p>

                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center border border-gray-300 rounded bg-white">
                            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-0.5 text-gray-600 hover:text-black cursor-pointer"><Minus className="w-3 h-3" /></button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-0.5 text-gray-600 hover:text-black cursor-pointer"><Plus className="w-3 h-3" /></button>
                          </div>

                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-1" title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>

                      <div className="text-right"><span className="text-xs font-bold text-gray-800">PKR {(item.price * item.quantity).toLocaleString()}</span></div>
                    </div>
                  ))
                )}

                {cart.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-xs font-bold text-gray-800 mb-2">Delivery Details (for WhatsApp Order):</h4>
                    <div className="space-y-2 text-xs">
                      <input type="text" placeholder="Your Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13A163]" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="tel" placeholder="Phone / WhatsApp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13A163]" />
                        <input type="text" placeholder="City (e.g. Lahore)" value={customerCity} onChange={(e) => setCustomerCity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13A163]" />
                      </div>
                      <input type="text" placeholder="Delivery Street Address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13A163]" />
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-extrabold text-[#0B3D26] text-base">PKR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Shipping Charges</span>
                    <span className="text-[#13A163] font-semibold">Calculated on WhatsApp</span>
                  </div>

                  <button onClick={handleWhatsAppCheckout} className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>Send Order via WhatsApp</span>
                  </button>

                  <p className="text-[10px] text-center text-gray-500">Opens WhatsApp with your items, selected sizes & address pre-filled.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setSelectedProduct(null)} />

          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100" aria-label="Close modal"><X className="w-5 h-5" /></button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                  {(() => {
                    const vIdx = selectedVariants[selectedProduct.id] ?? 0;
                    const vImg = selectedProduct.variants?.[vIdx]?.image || selectedProduct.image;
                    if (vImg) return <img src={vImg} alt={selectedProduct.title} className="w-full h-full object-cover" />;
                    return (
                      <div className="w-full h-full bg-[#E8F8F0] flex flex-col items-center justify-center p-4 text-center">
                        <Sparkles className="w-8 h-8 text-[#13A163] mb-2" />
                        <span className="font-bold text-sm text-[#0B3D26]">Photo coming soon</span>
                        <span className="text-xs text-[#13A163]">Mint placeholder</span>
                      </div>
                    );
                  })()}
                </div>

                {selectedProduct.variants && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {selectedProduct.variants.map((v, idx) => {
                      const isSelected = (selectedVariants[selectedProduct.id] ?? 0) === idx;
                      return (
                        <button key={v.weight} onClick={() => handleVariantChange(selectedProduct.id, idx)} className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${isSelected ? 'border-[#13A163] ring-2 ring-[#13A163]/30' : 'border-gray-200 opacity-60'}`}>
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#13A163] uppercase tracking-wider">{selectedProduct.category}</span>
                  <h3 className="text-xl font-extrabold text-[#0B3D26] mt-1">{selectedProduct.title}</h3>

                  <div className="mt-2">
                    {selectedProduct.priceType === 'fixed' ? (
                      <div className="text-2xl font-black text-[#0B3D26]">PKR {(selectedProduct.variants?.[selectedVariants[selectedProduct.id] ?? 0]?.price ?? selectedProduct.basePrice ?? 0).toLocaleString()}</div>
                    ) : (
                      <div className="text-lg font-bold text-[#13A163]">Ask Price / Request Quote</div>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 mt-3 leading-relaxed">{selectedProduct.description}</p>

                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-gray-500 tracking-wider">Key Highlights:</span>
                    {selectedProduct.features.map((f, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#13A163] shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {selectedProduct.variants && (
                    <div className="mt-4">
                      <label className="text-xs font-bold text-gray-700 block mb-1.5">Available Sizes / Packing:</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {selectedProduct.variants.map((v, idx) => {
                          const isSel = (selectedVariants[selectedProduct.id] ?? 0) === idx;
                          return (
                            <button key={v.weight} onClick={() => handleVariantChange(selectedProduct.id, idx)} className={`p-2 rounded-lg text-xs font-bold border transition text-left cursor-pointer ${isSel ? 'bg-[#0B3D26] text-white border-[#0B3D26]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50'}`}>
                              <div>{v.name}</div>
                              <div className={`text-[10px] ${isSel ? 'text-emerald-300' : 'text-gray-500'}`}>PKR {v.price.toLocaleString()}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                  {selectedProduct.priceType === 'fixed' ? (
                    <>
                      <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="flex-1 py-2.5 rounded-xl bg-[#0B3D26] hover:bg-[#072818] text-white text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                      <button onClick={() => { const vIdx = selectedVariants[selectedProduct.id] ?? 0; handleDirectWhatsAppOrder(selectedProduct, selectedProduct.variants?.[vIdx]); }} className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer">
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Order on WhatsApp</span>
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleAskPrice(selectedProduct)} className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Ask Price on WhatsApp</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#0B3D26] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
