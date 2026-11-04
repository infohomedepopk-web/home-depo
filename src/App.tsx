import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle, Minus, Plus, Search, ShoppingCart, Trash2, X } from 'lucide-react';

interface ProductVariant {
  name: string;
  weight: string;
  price: number;
  image: string;
}

type CategoryType = 'All Categories' | 'Building Chemicals' | 'Paints' | 'Hardware' | 'Windows Blinds' | 'Wall Decoration';
interface Product {
  id: string;
  title: string;
  category: Exclude<CategoryType, 'All Categories'>;
  description: string;
  features: string[];
  image: string;
  variants?: ProductVariant[];
  priceType: 'fixed' | 'ask_price';
  basePrice?: number;
  badge?: string;
  specs?: { label: string; value: string }[];
}
interface CartItem {
  id: string;
  productId: string;
  title: string;
  variantName?: string;
  price: number;
  image: string;
  quantity: number;
}
interface StoreHistoryState {
  homeDepo: true;
  category: CategoryType;
  search: string;
  productId?: string;
}

const WHATSAPP = 'https://wa.me/923421234789';
const asset = (path: string) => `${import.meta.env.BASE_URL || './'}${path.replace(/^\//, '')}`;
const categories: CategoryType[] = ['All Categories', 'Building Chemicals', 'Paints', 'Hardware', 'Windows Blinds', 'Wall Decoration'];
const chemicalImage = asset('/assets/building-chemicals.jpg');
const products: Product[] = [
  {
    id: 'rakson-sealant', title: 'RAKSON Anti-Leakage Sealant', category: 'Building Chemicals', priceType: 'fixed', basePrice: 1900, badge: 'Waterproofing', image: chemicalImage,
    description: 'A multipurpose sealant for common household waterproofing and leakage repair applications. Confirm the suitable surface and application method with the product label before use.',
    features: ['For selected leakage and sealing applications', 'Check surface compatibility before applying', 'Follow the package instructions'],
    variants: [
      { name: '300g Jar', weight: '300g', price: 950, image: asset('/assets/rakson-sealant-300g.jpg') },
      { name: '1 Kg Bucket', weight: '1kg', price: 1900, image: asset('/assets/rakson-sealant-1kg.jpg') },
      { name: '4 Kg Bucket', weight: '4kg', price: 6800, image: asset('/assets/rakson-sealant-4kg.jpg') },
      { name: '16 Kg Drum', weight: '16kg', price: 24500, image: asset('/assets/rakson-sealant-16kg.jpg') }
    ]
  },
  {
    id: 'rakson-sbr-chemical', title: 'RAKSON SBR Construction Chemical', category: 'Building Chemicals', priceType: 'fixed', basePrice: 1250, badge: 'Bonding & Repair', image: asset('/assets/rakson-sbr-1-litter-1250.jpg'),
    description: 'RAKSON SBR additive for construction, repair, and bonding work. Refer to the product label or contact the seller for the recommended mix ratio and application guidance.',
    features: ['For construction and repair applications', 'Can be used in cement-based work as directed on label', 'Ask for mix ratios and surface preparation guidance'],
    variants: [
      { name: '1 Litre Pack', weight: '1L', price: 1250, image: asset('/assets/rakson-sbr-1-litter-1250.jpg') },
      { name: '5 Litres Pack', weight: '5L', price: 5850, image: asset('/assets/rakson-sbr-5 litter-5850.jpg') }
    ]
  },
  {
    id: 'rakson-roof-coat', title: 'RAKSON Roof Coat 7000 Series', category: 'Building Chemicals', priceType: 'fixed', basePrice: 950, badge: 'Roof Coating', image: asset('/assets/rakson-roof-coat-1kg.png'),
    description: 'A roof coating sold for waterproofing and heat-protection applications. Check the current product label for suitable surfaces, coverage, preparation, and application instructions.',
    features: ['Roof coating for exterior applications', 'Check label for surface preparation and coats', 'Coverage depends on surface and application'],
    variants: [
      { name: '1 Kg Jar', weight: '1kg', price: 950, image: asset('/assets/rakson-roof-coat-1kg.png') },
      { name: '4.5 Kg Bucket', weight: '4.5kg', price: 3450, image: asset('/assets/rakson-roof-coat-4-5kg.png') },
      { name: '18 Kg Drum', weight: '18kg', price: 13500, image: asset('/assets/rakson-roof-coat-18kg.png') }
    ]
  },
  {
    id: 'rakson-elasto-50', title: 'RAKSON ELASTO-50 Flexible Polymer Membrane', category: 'Building Chemicals', priceType: 'fixed', basePrice: 1350, badge: 'New Product', image: chemicalImage,
    description: 'RAKSON ELASTO-50 is described on its packaging as a flexible polymer membrane for roofs, exterior walls, and concrete, intended to help waterproof and protect surfaces. The label also describes an ultra-soft finish and easy application. Use only as directed on the container; coverage, preparation, number of coats, and drying time are not specified here and should be confirmed with the seller or product label.',
    features: ['Label identifies it as a flexible polymer membrane', 'For roofs, exterior walls, and concrete, as stated on the label', 'Packaging highlights a soft finish and easy application', 'Use package directions for surface preparation and application'],
    specs: [
      { label: 'Product type', value: 'Flexible polymer membrane (per product label)' },
      { label: 'Labelled applications', value: 'Roofs, exterior walls, and concrete' },
      { label: 'Shade shown', value: '1008 Cameo' },
      { label: '1 L pack', value: 'PKR 1,350' },
      { label: '4 L pack', value: 'PKR 4,800' },
      { label: '16 L pack', value: 'PKR 18,500' },
      { label: 'Coverage / application', value: 'Confirm on the container or with the seller' }
    ],
    variants: [
      { name: '1 Litre - Cameo 1008', weight: '1L', price: 1350, image: chemicalImage },
      { name: '4 Litre - Cameo 1008', weight: '4L', price: 4800, image: chemicalImage },
      { name: '16 Litre - Cameo 1008', weight: '16L', price: 18500, image: chemicalImage }
    ]
  },
  {
    id: 'rakson-wall-emulsion', title: 'RAKSON Super Wall Emulsion (Interior Matt)', category: 'Paints', priceType: 'ask_price', badge: 'Matt Finish', image: asset('/assets/rakson-wall-emulsion.jpg'),
    description: 'Interior wall emulsion paint. Ask the seller for available shades, pack sizes, coverage, and current price.',
    features: ['Interior matt finish', 'Ask for current shades and pack sizes']
  },
  {
    id: 'wall-putty', title: 'Wall Putty', category: 'Paints', priceType: 'ask_price', badge: 'Surface Preparation', image: chemicalImage,
    description: 'Wall putty for surface preparation before painting. Ask the seller to confirm suitable use, pack size, and application instructions.',
    features: ['For wall surface preparation', 'Follow the product label for application']
  },
  {
    id: 'hardware-door-handle', title: 'Modern Door Handle', category: 'Hardware', priceType: 'ask_price', badge: 'Door Hardware', image: asset('/assets/hardware-door-handle.jpg'),
    description: 'Modern door handle. Contact us for finish, measurements, compatibility, and current price.', features: ['Ask for finish and fitting details']
  },
  {
    id: 'hardware-door-hinge', title: 'Heavy Duty Door Hinges', category: 'Hardware', priceType: 'ask_price', badge: 'Door Hardware', image: asset('/assets/hardware-door-hinge.jpg'),
    description: 'Door hinges for home and renovation projects. Contact us to confirm material, size, and availability.', features: ['Ask for hinge size and material details']
  },
  {
    id: 'curtains-luxury', title: 'Luxury Sheer Curtains', category: 'Windows Blinds', priceType: 'ask_price', badge: 'Custom Stitching', image: asset('/assets/curtains-sheer.jpg'),
    description: 'Sheer curtains with custom measurement and stitching options. Ask for fabric choices and a quote.', features: ['Custom measurements available on request', 'Ask for fabric and stitching options']
  },
  {
    id: 'window-blinds-wooden', title: 'Wooden Venetian Window Blinds', category: 'Windows Blinds', priceType: 'ask_price', badge: 'Made to Measure', image: asset('/assets/blinds-wooden.jpg'),
    description: 'Wood-look Venetian blinds. Contact us with window measurements for available finishes and pricing.', features: ['Made-to-measure quote available', 'Ask for finish and installation details']
  },
  {
    id: 'window-blinds-zebra', title: 'Zebra Day & Night Roller Blinds', category: 'Windows Blinds', priceType: 'ask_price', badge: 'Roller Blinds', image: asset('/assets/blinds-zebra.jpg'),
    description: 'Day-and-night style roller blinds. Contact us with window measurements for a quote.', features: ['Ask for measurements and available fabrics']
  },
  {
    id: 'wall-decoration-tree', title: 'Geometric Tree Metal Wall Art', category: 'Wall Decoration', priceType: 'ask_price', badge: 'Wall Decor', image: asset('/assets/wall-art-tree.jpg'),
    description: 'Decorative metal wall art for home interiors. Ask for dimensions, finish, and current price.', features: ['Ask for size and finish options']
  },
  {
    id: 'wall-decoration-honeycomb', title: 'Geometric Metal Wall Sculpture', category: 'Wall Decoration', priceType: 'ask_price', badge: 'Wall Decor', image: asset('/assets/wall-art-geometric.jpg'),
    description: 'Geometric metal wall decor. Contact us for dimensions, finish, and availability.', features: ['Ask for size and finish options']
  }
];

const homeState: StoreHistoryState = { homeDepo: true, category: 'All Categories', search: '' };
const toHistoryState = (category: CategoryType, search: string, productId?: string): StoreHistoryState => ({ homeDepo: true, category, search, ...(productId ? { productId } : {}) });

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({ 'rakson-sealant': 1, 'rakson-elasto-50': 0 });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Keep category and product views in browser history so Back returns one view at a time.
  useEffect(() => {
    window.history.replaceState(homeState, '', window.location.href);
    window.history.pushState(homeState, '', window.location.href);
    const restoreView = (event: PopStateEvent) => {
      const state = event.state as StoreHistoryState | null;
      setSelectedCategory(state?.homeDepo ? state.category : 'All Categories');
      setSearchQuery(state?.homeDepo ? state.search : '');
      setSelectedProduct(state?.homeDepo && state.productId ? products.find((item) => item.id === state.productId) ?? null : null);
      setIsCartOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', restoreView);
    return () => window.removeEventListener('popstate', restoreView);
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => (selectedCategory === 'All Categories' || product.category === selectedCategory) && (!query || `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(query)));
  }, [selectedCategory, searchQuery]);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = (category: CategoryType, search = '', productId?: string) => {
    setSelectedCategory(category);
    setSearchQuery(search);
    setSelectedProduct(productId ? products.find((item) => item.id === productId) ?? null : null);
    window.history.pushState(toHistoryState(category, search, productId), '', window.location.href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openProduct = (product: Product) => navigate(selectedCategory, searchQuery, product.id);
  const goBack = () => {
    if (selectedProduct || selectedCategory !== 'All Categories' || searchQuery) {
      window.history.back();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const closeProduct = () => {
    if (selectedProduct) window.history.back();
    else setSelectedProduct(null);
  };
  const askOnWhatsApp = (product: Product, variant?: ProductVariant) => {
    const details = variant ? ` (${variant.name}, PKR ${variant.price.toLocaleString()})` : '';
    const message = encodeURIComponent(`Hello HOME DEPO! I am interested in ${product.title}${details}. Please confirm current availability, product instructions/specifications, and delivery charges.`);
    window.open(`${WHATSAPP}?text=${message}`, '_blank', 'noopener,noreferrer');
  };
  const addToCart = (product: Product, index = selectedVariants[product.id] ?? 0) => {
    const variant = product.variants?.[index];
    const id = variant ? `${product.id}-${variant.weight}` : product.id;
    setCart((items) => {
      const existing = items.find((item) => item.id === id);
      return existing ? items.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { id, productId: product.id, title: product.title, variantName: variant?.name, price: variant?.price ?? product.basePrice ?? 0, image: variant?.image ?? product.image, quantity: 1 }];
    });
  };
  const setVariant = (productId: string, index: number) => setSelectedVariants((values) => ({ ...values, [productId]: index }));
  const changeQuantity = (id: string, change: number) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0));

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-gray-900 flex flex-col font-sans">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
          <button onClick={() => navigate('All Categories')} className="font-black text-xl sm:text-2xl text-[#0B3D26]">HOME DEPO</button>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input aria-label="Search products" value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); window.history.replaceState(toHistoryState(selectedCategory, event.target.value, selectedProduct?.id), '', window.location.href); }} placeholder="Search products..." className="w-full pl-9 pr-3 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm" />
          </div>
          <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 rounded-lg bg-[#0B3D26] text-white px-3 py-2"><ShoppingCart className="w-4 h-4" />Cart{itemCount > 0 ? ` (${itemCount})` : ''}</button>
          <nav aria-label="Product categories" className="w-full flex gap-2 overflow-x-auto py-1">
            {categories.map((category) => <button key={category} onClick={() => navigate(category)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${selectedCategory === category ? 'bg-[#0B3D26] text-white' : 'bg-gray-100 text-gray-700'}`}>{category}</button>)}
          </nav>
        </div>
      </header>

      <section className="bg-[#0B3D26] text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {selectedCategory === 'All Categories' ? <>
            <p className="text-emerald-300 text-sm font-bold">HOME DEPO · HOME IMPROVEMENT</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">Products for your home and renovation</h1>
            <p className="text-emerald-100 mt-3 max-w-2xl">Browse building chemicals, paints, hardware, blinds, and wall decor. Select a department to view its products.</p>
          </> : <div className="flex items-center gap-3"><button onClick={goBack} className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm font-bold"><ArrowLeft className="w-4 h-4" />Back</button><div><p className="text-emerald-300 text-xs font-bold">DEPARTMENT</p><h1 className="text-2xl sm:text-3xl font-extrabold">{selectedCategory}</h1></div></div>}
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div><p className="text-xs font-bold uppercase text-emerald-700">{selectedCategory} · {filteredProducts.length} products</p><h2 className="text-2xl font-extrabold text-[#0B3D26]">{selectedCategory === 'All Categories' ? 'Shop products' : selectedCategory}</h2></div>
          {(selectedCategory !== 'All Categories' || searchQuery) && <button onClick={goBack} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm font-semibold"><ArrowLeft className="w-4 h-4" />Back</button>}
        </div>
        {filteredProducts.length === 0 ? <p className="rounded-xl bg-white border p-8 text-center text-gray-600">No products found. Try another search or category.</p> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const index = selectedVariants[product.id] ?? 0;
            const variant = product.variants?.[index];
            return <article key={product.id} className="rounded-xl border bg-white overflow-hidden shadow-sm flex flex-col">
              <button onClick={() => openProduct(product)} className="relative aspect-square bg-gray-100"><img src={variant?.image ?? product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" /><span className="absolute left-2 top-2 rounded bg-[#0B3D26] px-2 py-1 text-[10px] font-bold text-white">{product.badge}</span></button>
              <div className="p-3 flex flex-col flex-1"><p className="text-[10px] font-bold uppercase text-emerald-700">{product.category}</p><button onClick={() => openProduct(product)} className="text-left font-bold text-sm mt-1">{product.title}</button><p className="text-xs text-gray-600 mt-2 line-clamp-3">{product.description}</p>
                {product.variants && <div className="flex flex-wrap gap-1 mt-3">{product.variants.map((item, variantIndex) => <button key={item.weight} onClick={() => setVariant(product.id, variantIndex)} className={`rounded border px-2 py-1 text-[10px] ${index === variantIndex ? 'bg-[#0B3D26] text-white' : 'bg-white'}`}>{item.weight}</button>)}</div>}
                <div className="mt-auto pt-3"><p className="font-extrabold text-[#0B3D26] mb-2">{product.priceType === 'fixed' ? `PKR ${(variant?.price ?? product.basePrice ?? 0).toLocaleString()}` : 'Ask for price'}</p>{product.priceType === 'fixed' ? <button onClick={() => addToCart(product)} className="w-full rounded-lg bg-[#0B3D26] text-white py-2 text-xs font-bold">Add to cart</button> : <button onClick={() => askOnWhatsApp(product)} className="w-full rounded-lg bg-emerald-50 text-[#0B3D26] py-2 text-xs font-bold">Ask on WhatsApp</button>}</div>
              </div>
            </article>;
          })}
        </div>}
      </main>

      <footer className="bg-[#0B3D26] text-emerald-100 py-6 text-center text-sm">HOME DEPO · Customer care and orders: +92 342 1234789</footer>

      {selectedProduct && <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-3 sm:p-6 flex items-center justify-center" onKeyDown={(event) => { if (event.key === 'Escape') closeProduct(); }}>
        <button aria-label="Close product details" className="absolute inset-0 w-full h-full cursor-default" onClick={closeProduct} />
        <section role="dialog" aria-modal="true" aria-labelledby="product-title" className="relative z-10 bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6">
          <div className="flex justify-between gap-3 items-start"><button onClick={closeProduct} className="inline-flex items-center gap-2 text-sm font-bold text-[#0B3D26]"><ArrowLeft className="w-4 h-4" />Back to products</button><button onClick={closeProduct} aria-label="Close" className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
          <div className="grid sm:grid-cols-2 gap-5 mt-4"><img src={selectedProduct.variants?.[selectedVariants[selectedProduct.id] ?? 0]?.image ?? selectedProduct.image} alt={selectedProduct.title} className="w-full aspect-square object-cover rounded-xl bg-gray-100" />
            <div><p className="text-xs uppercase font-bold text-emerald-700">{selectedProduct.category}</p><h2 id="product-title" className="text-xl font-extrabold text-[#0B3D26] mt-1">{selectedProduct.title}</h2><p className="text-sm text-gray-700 mt-3 leading-relaxed">{selectedProduct.description}</p>
              <div className="mt-4"><h3 className="text-xs uppercase font-bold text-gray-500 mb-2">Key details</h3>{selectedProduct.features.map((feature) => <p key={feature} className="flex gap-2 text-sm py-1"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />{feature}</p>)}</div>
              {selectedProduct.specs && <dl className="mt-4 border-t pt-3 space-y-2">{selectedProduct.specs.map((spec) => <div key={spec.label} className="flex gap-3 justify-between text-xs"><dt className="font-bold text-gray-600">{spec.label}</dt><dd className="text-right">{spec.value}</dd></div>)}</dl>}
              {selectedProduct.variants && <div className="mt-4 space-y-2">{selectedProduct.variants.map((variant, index) => <button key={variant.weight} onClick={() => setVariant(selectedProduct.id, index)} className={`w-full rounded-lg border p-2 flex justify-between text-sm ${index === (selectedVariants[selectedProduct.id] ?? 0) ? 'border-emerald-700 bg-emerald-50' : ''}`}><span>{variant.name}</span><b>PKR {variant.price.toLocaleString()}</b></button>)}</div>}
              <div className="mt-5 flex gap-2">{selectedProduct.priceType === 'fixed' && <button onClick={() => { addToCart(selectedProduct); closeProduct(); }} className="flex-1 rounded-lg bg-[#0B3D26] text-white py-2.5 text-sm font-bold">Add to cart</button>}<button onClick={() => askOnWhatsApp(selectedProduct, selectedProduct.variants?.[selectedVariants[selectedProduct.id] ?? 0])} className="flex-1 rounded-lg bg-[#25D366] text-white py-2.5 text-sm font-bold inline-flex justify-center items-center gap-2"><MessageCircle className="w-4 h-4" />WhatsApp</button></div>
            </div>
          </div>
        </section>
      </div>}

      {isCartOpen && <div className="fixed inset-0 z-50 bg-black/50 flex justify-end" onClick={() => setIsCartOpen(false)}><aside className="bg-white w-full max-w-md h-full p-4 flex flex-col" onClick={(event) => event.stopPropagation()}><div className="flex justify-between items-center border-b pb-3"><h2 className="font-bold text-lg">Your Cart ({itemCount})</h2><button onClick={() => setIsCartOpen(false)} aria-label="Close cart"><X /></button></div><div className="flex-1 overflow-y-auto py-3 space-y-3">{cart.length === 0 ? <p className="text-center text-gray-500 mt-10">Your cart is empty.</p> : cart.map((item) => <div key={item.id} className="flex gap-3 items-center border rounded-lg p-2"><img src={item.image} alt="" className="w-14 h-14 object-cover rounded" /><div className="flex-1"><p className="font-semibold text-sm">{item.title}</p><p className="text-xs text-gray-500">{item.variantName} · PKR {item.price.toLocaleString()}</p><div className="flex items-center gap-2 mt-1"><button aria-label="Decrease quantity" onClick={() => changeQuantity(item.id, -1)}><Minus className="w-4 h-4" /></button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={() => changeQuantity(item.id, 1)}><Plus className="w-4 h-4" /></button><button aria-label="Remove item" onClick={() => setCart((items) => items.filter((entry) => entry.id !== item.id))}><Trash2 className="w-4 h-4 text-red-600" /></button></div></div></div>)}</div><div className="border-t pt-3"><p className="font-bold mb-3">Subtotal: PKR {total.toLocaleString()}</p><button disabled={!cart.length} onClick={() => { const order = cart.map((item) => `${item.title}${item.variantName ? ` (${item.variantName})` : ''} x${item.quantity} - PKR ${(item.price * item.quantity).toLocaleString()}`).join('\n'); window.open(`${WHATSAPP}?text=${encodeURIComponent(`HOME DEPO order inquiry:\n${order}\nSubtotal: PKR ${total.toLocaleString()}\nPlease confirm delivery charges.`)}`, '_blank', 'noopener,noreferrer'); }} className="w-full rounded-lg bg-[#25D366] text-white py-3 font-bold disabled:opacity-50">Order via WhatsApp</button></div></aside></div>}
    </div>
  );
}
