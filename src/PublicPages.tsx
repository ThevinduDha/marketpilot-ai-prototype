import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Camera, Check, CircleDollarSign, LayoutDashboard, ListChecks, LockKeyhole, Package, Search, Sparkles, Store, Tags } from 'lucide-react'
import { Link } from 'react-router-dom'
import { monthlyRevenue, RevenueChart } from './Dashboard'
import { money, sampleProducts } from './demo'
import { Brand, DemoBadge, ProductPhoto } from './ui'

const featureCards = [
  { title: 'AI product intelligence', text: 'Review suggested product attributes, confirm the material, and identify photos that would help a buyer decide.', icon: Sparkles, color: 'violet' },
  { title: 'Marketplace research & pricing', text: 'Compare sample Etsy and eBay listings, assess demand and feedback, and explore a price range based on your costs.', icon: Tags, color: 'blue' },
  { title: 'Listing automation', text: 'See how listing titles and descriptions could be drafted for each marketplace, with a seller review before simulated publishing.', icon: ListChecks, color: 'green' },
]

const steps = [
  { title: 'Add your product', text: 'Enter a few details, including materials, dimensions, and manufacturing cost.', icon: Camera },
  { title: 'Explore AI insights', text: 'Review simulated market comparisons, demand signals, and buyer feedback.', icon: Sparkles },
  { title: 'Set a selling price', text: 'Compare the suggested price range and decide which channels fit the product.', icon: Tags },
  { title: 'Review and publish', text: 'Approve the proposed listing and see how demo publishing would work.', icon: Store },
]

function DashboardPreview() {
  return (
    <Link to="/dashboard" className="landing-preview" aria-label="Open the seller dashboard demo">
      <div className="preview-window"><span><i /><i /><i /></span><span>MarketPilot AI / Overview</span><ArrowUpRight size={15} /></div>
      <div className="preview-layout">
        <div className="preview-sidebar" aria-hidden="true">
          <div className="preview-brand"><span className="brand-mark"><BarChart3 size={14} /></span><strong>MarketPilot AI</strong></div>
          <div className="preview-workspace">WORKSPACE</div>
          <div className="selected"><LayoutDashboard size={12} /> Overview</div>
          <div><Package size={12} /> My Products</div>
          <div><Sparkles size={12} /> AI Analysis</div>
          <div><Search size={12} /> Market Research</div>
          <div><ListChecks size={12} /> Listings</div>
        </div>
        <div className="preview-content">
          <div className="preview-title"><strong>Overview</strong><DemoBadge /></div>
          <div className="preview-kpis">
            <div><span><Package size={12} /> Products</span><strong>4</strong></div>
            <div><span><Store size={12} /> Active listings</span><strong>4</strong></div>
            <div><span><CircleDollarSign size={12} /> Demo revenue</span><strong>{money(monthlyRevenue, false)}</strong></div>
          </div>
          <div className="preview-chart-card">
            <div><strong>Revenue performance</strong><span>Last 30 days</span></div>
            <div className="preview-chart"><RevenueChart preview /></div>
          </div>
          <div className="preview-recent">
            <strong>Recent products</strong>
            <div>{sampleProducts.slice(0, 2).map((product) => <div key={product.id}><ProductPhoto product={product} /><span>{product.name}</span><strong>{money(product.price, false)}</strong></div>)}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function Landing() {
  return (
    <div className="landing" id="top">
      <header className="public-header">
        <div className="public-container header-content">
          <Brand />
          <nav className="public-nav" aria-label="Website navigation"><a href="#features">Features</a><a href="#how-it-works">How It Works</a><a href="#about">About</a></nav>
          <div className="header-actions"><Link to="/sign-in" className="public-sign-in">Sign in</Link><Link to="/dashboard" className="button button-primary">Get Started <ArrowRight size={16} /></Link></div>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="public-container hero-layout">
            <div className="hero-copy">
              <DemoBadge />
              <h1>Smarter product decisions. <span>Effortless marketplace selling.</span></h1>
              <p>MarketPilot AI brings product insights, pricing research, and marketplace listings into one workspace for independent sellers.</p>
              <div className="hero-actions"><Link className="button button-primary" to="/dashboard">Get Started <ArrowRight size={17} /></Link><Link className="button button-secondary" to="/dashboard">Try Demo <ArrowUpRight size={17} /></Link></div>
              <div className="hero-note"><Check size={15} /> Explore with sample products. No account required.</div>
            </div>
            <DashboardPreview />
          </div>
        </section>
        <div className="market-strip">
          <div className="public-container market-strip-inner">
            <span>Marketplace workflows in the demo</span>
            <div><strong className="wordmark-etsy">Etsy</strong></div>
            <div><strong className="wordmark-ebay">eBay</strong></div>
          </div>
        </div>
        <section id="features" className="public-section public-container">
          <div className="section-head"><h2>Research, price, and list in one workspace</h2><p>See how MarketPilot AI could support the decisions that go into every listing.</p></div>
          <div className="feature-grid">{featureCards.map(({ title, text, icon: Icon, color }) => (
            <article className="feature-card" key={title}><span className={`feature-icon icon-${color}`}><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></article>
          ))}</div>
        </section>
        <section id="how-it-works" className="public-section how-section">
          <div className="public-container">
            <div className="section-head"><h2>How it works</h2><p>Follow a product from the first photo to a seller-approved listing.</p></div>
            <ol className="steps-grid">{steps.map(({ title, text, icon: Icon }, index) => (
              <li key={title}><div className="step-top"><span>{String(index + 1).padStart(2, '0')}</span><Icon size={20} /></div><h3>{title}</h3><p>{text}</p></li>
            ))}</ol>
          </div>
        </section>
        <section id="about" className="public-section public-container about-section">
          <div className="about-card">
            <div><h2>About MarketPilot AI</h2><p>An academic AI Economy project exploring how independent sellers could use AI to make better-informed decisions. All marketplace data, recommendations, and publishing workflows in the prototype are simulated.</p></div>
            <Link className="button button-white" to="/dashboard">Try Demo <ArrowRight size={17} /></Link>
          </div>
        </section>
      </main>
      <footer className="public-footer"><div className="public-container footer-inner">
        <Brand /><p>Academic AI Economy prototype</p>
        <div><Link to="/sign-in">Demo sign-in</Link><a href="#top">Back to top <ArrowDown className="back-top-icon" size={14} /></a></div>
      </div></footer>
    </div>
  )
}

export function SignIn() {
  return (
    <main className="signin">
      <div className="signin-content">
        <div className="signin-top"><Brand /><DemoBadge /></div>
        <div className="signin-form">
          <Link to="/" className="text-link back-link"><ArrowLeft size={16} /> Back to website</Link>
          <h1>Sign in to the demo</h1>
          <p>Explore the seller workspace with a sample account.</p>
          <label>Email address<input type="email" placeholder="seller@example.com" readOnly /></label>
          <label>Password<input type="password" placeholder="••••••••" readOnly /></label>
          <Link className="button button-primary" to="/dashboard">Continue with Demo <ArrowRight size={17} /></Link>
          <div className="signin-note"><LockKeyhole size={16} /> These example fields are read-only. The demo needs no credentials.</div>
        </div>
        <div className="signin-footer">MarketPilot AI · Academic AI Economy prototype</div>
      </div>
      <aside className="signin-aside" aria-label="About the demo workspace">
        <div className="signin-aside-inner">
          <span className="signin-icon"><Sparkles size={25} /></span>
          <h2>See an independent seller’s workspace in action.</h2>
          <p>Browse a sample catalog, inspect revenue trends, and review simulated product recommendations.</p>
          <div className="signin-sample"><ProductPhoto product={sampleProducts[0]} /><div><strong>Handmade Wooden Elephant Sculpture</strong><span>Sample product · Home &amp; Living</span></div><b>{money(sampleProducts[0].price, false)}</b></div>
        </div>
      </aside>
    </main>
  )
}
