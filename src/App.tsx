import { StoreProvider, useStore } from './store';
import { AuthProvider } from './lib/authContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import {
  CustomerReviews,
  FeaturedCollections,
  FlashSale,
  InstagramFeed,
  LimitedEditionBanner,
  Marquee,
  Newsletter,
  PremiumCategories,
  ProductRow,
} from './components/HomeSections';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import {
  AboutPage,
  AccountPage,
  CollectionPage,
  CollectionsPage,
  ContactPage,
  RecentlyViewed,
  TrackPage,
  WishlistPage,
} from './pages/MiscPages';
import {
  ForgotPasswordPage,
  ProfilePage,
  ProtectedRoute,
  SignInPage,
  SignUpPage,
} from './pages/AuthPages';

function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedCollections />
      <ProductRow id="new-arrivals" eyebrow="Just landed" title="New Arrivals" subtitle="The latest additions to the Parvej wardrobe." filter={(p) => p.tags.includes('new')} cta={{ label: 'Shop all', route: { name: 'shop' } }} />
      <ProductRow id="trending" eyebrow="Loved this week" title="Trending Now" filter={(p) => p.tags.includes('trending')} cta={{ label: 'Shop all', route: { name: 'shop' } }} />
      <LimitedEditionBanner />
      <ProductRow id="best-sellers" eyebrow="Client favorites" title="Best Sellers" subtitle="The pieces our customers return to again and again." filter={(p) => p.tags.includes('bestseller')} cta={{ label: 'Shop all', route: { name: 'shop' } }} />
      <FlashSale />
      <PremiumCategories />
      <CustomerReviews />
      <InstagramFeed />
      <Newsletter />
      <RecentlyViewed />
    </>
  );
}

function Router() {
  const { route } = useStore();
  switch (route.name) {
    case 'home': return <HomePage />;
    case 'shop': return <ShopPage initialCategory={route.category} initialGender={route.gender} />;
    case 'product': return <ProductPage id={route.id} />;
    case 'collections': return <CollectionsPage />;
    case 'collection': return <CollectionPage id={route.id} />;
    case 'about': return <AboutPage />;
    case 'contact': return <ContactPage />;
    case 'checkout': return <CheckoutPage />;
    case 'account': return <AccountPage />;
    case 'wishlist': return <WishlistPage />;
    case 'track': return <TrackPage />;
    case 'signin': return <SignInPage />;
    case 'signup': return <SignUpPage />;
    case 'forgot': return <ForgotPasswordPage />;
    case 'profile': return <ProtectedRoute><ProfilePage /></ProtectedRoute>;
    default: return <HomePage />;
  }
}

function Shell() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 text-ink-900 dark:text-white">
      <Navbar />
      <main key={useStore().route.name} className="animate-fade-in">
        <Router />
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <FloatingWidgets />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;
