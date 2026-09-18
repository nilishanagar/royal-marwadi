import { LuAward, LuHeart, LuUsers, LuLeaf } from 'react-icons/lu';
import './AboutPage.css';

export default function AboutPage() {
  const stats = [
    { value: '25+', label: 'Years of Excellence' },
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Artisan Partners' },
    { value: '50+', label: 'Design Awards' },
  ];

  return (
    <div className="page about-page">
      <section className="about-hero">
        <div className="container">
          <span className="section-label">Our Story</span>
          <h1>Crafting Heritage,<br />Defining Luxury</h1>
          <p>For over two decades, Royal Marwadi has been at the forefront of handcrafted furniture, blending the rich traditions of Rajasthani artistry with contemporary design sensibilities.</p>
        </div>
      </section>

      <section className="section container">
        <div className="about-grid">
          <div className="about-text">
            <h2>Rooted in Tradition</h2>
            <p>Founded in the heart of Jodhpur — India's furniture capital — Royal Marwadi began as a small workshop dedicated to preserving the intricate woodworking techniques passed down through generations of Marwadi craftsmen.</p>
            <p>Today, we partner with over 500 skilled artisans across Rajasthan, each bringing their unique expertise to every piece we create. From the selection of the finest teak and sheesham wood to the final hand-polished finish, every step is guided by a commitment to uncompromising quality.</p>
          </div>
          <div className="about-values">
            {[
              { icon: LuAward, title: 'Quality First', desc: 'Every piece undergoes rigorous quality checks before leaving our workshop.' },
              { icon: LuHeart, title: 'Made with Love', desc: 'Each product is a labour of love, crafted by artisans who take pride in their work.' },
              { icon: LuUsers, title: 'Community', desc: 'We support and uplift the artisan communities that make our work possible.' },
              { icon: LuLeaf, title: 'Sustainability', desc: 'We source wood responsibly and use eco-friendly finishes wherever possible.' },
            ].map((v, i) => (
              <div key={i} className="value-card">
                <v.icon size={24} color="var(--accent)" />
                <div>
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
