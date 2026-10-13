import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Category from "./Category";
import "./App.css";

const API = "https://dummyjson.com";

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStore() {
      setLoading(true);
      setError("");

      try {
        const [categoryResponse, productResponse] = await Promise.all([
          axios.get(`${API}/products/category-list`),
          axios.get(`${API}/products?limit=100`),
        ]);

        if (!active) return;

        setCategories(categoryResponse.data);
        setProducts(productResponse.data.products);
      } catch {
        if (active) {
          setError("We couldn't load the collection. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStore();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        !category || product.category === category;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, category, search, sort]);

  const formatCategory = (value) =>
    value.replace(/-/g, " ");

  return (
    <div className="store">
      <div className="announcement">
        A MORE CONSIDERED WAY TO SHOP
        <span> — </span>
        DISCOVER SOMETHING EXCEPTIONAL
      </div>

      <header className="site-header">
        <a
          href="#home"
          className="brand"
          aria-label="Maison home"
          onClick={() => {
            setCategory("");
            setSearch("");
          }}
        >
          <span className="brand-mark">M.</span>
          <span className="brand-copy">
            <strong>MAISON</strong>
            <small>THE ART OF EVERYDAY</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#collection">Shop</a>
          <a href="#collection" onClick={() => setCategory("")}>
            Collections
          </a>
          <a href="#story">Our Philosophy</a>
        </nav>

        <div className="header-actions">
          <label className="header-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Find something..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                document
                  .getElementById("collection")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              aria-label="Search products"
            />
          </label>

          <button
            className="bag-button"
            onClick={() =>
              document
                .getElementById("collection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            aria-label={`Shopping bag, ${cartCount} items added`}
          >
            BAG <span className="bag-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="Carefully curated neutral-toned fashion collection"
          />

          <div className="hero-overlay" />

          <div className="hero-content">
            <span className="eyebrow hero-eyebrow">
              LESS, BUT BETTER
            </span>
            <h1>
              The beauty
              <br />
              of <em>considered</em>
              <br />
              living.
            </h1>
            <p>
              Timeless finds. Thoughtful details.
              <br />
              Everyday pieces, made to feel extraordinary.
            </p>
            <a className="primary-button" href="#collection">
              EXPLORE THE COLLECTION <span>↗</span>
            </a>
          </div>

          <div className="hero-index">
            <span>01</span>
            <span className="index-line" />
            <span>CURATED FOR YOU</span>
          </div>
        </section>

        <section className="trust-strip" aria-label="Our values">
          <span>✳ Thoughtfully curated</span>
          <span>✳ Exceptional everyday finds</span>
          <span>✳ A little luxury, always</span>
        </section>

        <section className="collection-section" id="collection">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE MAISON EDIT</span>
              <h2>Find your <em>something.</em></h2>
              <p>
                A collection of things worth keeping.
              </p>
            </div>

            <div className="collection-meta">
              <span>{filteredProducts.length} PIECES</span>
              <label className="sort-control">
                <span>SORT BY</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
              </label>
            </div>
          </div>

          <div className="shop-layout">
            <aside className="sidebar">
              <Category
                finalCategory={categories}
                catName={category}
                setcatName={setCategory}
              />

              <div className="sidebar-note">
                <span className="note-star">✳</span>
                <h3>Good things,</h3>
                <h3>chosen well.</h3>
                <p>
                  Discover everyday essentials and unexpected
                  favorites in our curated edit.
                </p>
              </div>
            </aside>

            <div className="product-area">
              <div className="active-filter">
                <span>
                  {category ? formatCategory(category) : "All products"}
                </span>
                {category && (
                  <button onClick={() => setCategory("")}>
                    CLEAR FILTER ×
                  </button>
                )}
              </div>

              {loading ? (
                <div className="state-message">
                  <span className="loader" />
                  <p>Curating your collection...</p>
                </div>
              ) : error ? (
                <div className="state-message">
                  <p>{error}</p>
                  <button
                    className="text-button"
                    onClick={() => window.location.reload()}
                  >
                    TRY AGAIN ↗
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="state-message">
                  <h3>Nothing here just yet.</h3>
                  <p>Try another search or explore the full collection.</p>
                  <button
                    className="text-button"
                    onClick={() => {
                      setSearch("");
                      setCategory("");
                    }}
                  >
                    VIEW ALL PRODUCTS ↗
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map((product, index) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      index={index}
                      onAdd={() => setCartCount((count) => count + 1)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="story-section" id="story">
          <span className="eyebrow">A DIFFERENT KIND OF RETAIL</span>
          <h2>Make room for <em>the meaningful.</em></h2>
          <p>
            We believe the best things aren't always the loudest.
            Discover pieces that bring beauty, function, and a little
            joy into the everyday.
          </p>
          <a href="#collection" className="story-link">
            DISCOVER OUR COLLECTION <span>↗</span>
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <a href="#home" className="footer-brand">MAISON<span>.</span></a>
        <p>Thoughtful finds for a life well considered.</p>
        <span>© {new Date().getFullYear()} MAISON. MADE FOR EVERYDAY.</span>
      </footer>
    </div>
  );
}

function ProductItem({ product, index, onAdd }) {
  const [added, setAdded] = useState(false);

  const discount = Math.round(product.discountPercentage || 0);

  function addToBag() {
    onAdd();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.thumbnail}
          alt={product.title}
          loading={index < 6 ? "eager" : "lazy"}
        />

        {index % 5 === 0 && (
          <span className="product-label">THE EDIT</span>
        )}

        {discount > 10 && (
          <span className="discount-label">{discount}% OFF</span>
        )}

        <button
          className="quick-add"
          onClick={addToBag}
          aria-label={`Add ${product.title} to bag`}
        >
          {added ? "ADDED ✓" : "ADD TO BAG +"}
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category.replace(/-/g, " ")}
        </span>
        <h3>{product.title}</h3>

        <div className="product-bottom">
          <span className="product-price">
            ${product.price.toFixed(2)}
          </span>
          <span className="product-rating">
            <span>★</span> {Number(product.rating || 0).toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default App;