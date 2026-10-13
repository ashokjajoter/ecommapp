import React from "react";

export default function Category({
  finalCategory = [],
  setcatName,
  catName = "",
}) {
  return (
    <div className="category-panel">
      <div className="category-heading">
        <span className="eyebrow">DISCOVER</span>
        <h3>Categories</h3>
      </div>

      <ul className="category-list">
        <li>
          <button
            type="button"
            className={`category-button ${
              catName === "" ? "active" : ""
            }`}
            onClick={() => setcatName("")}
          >
            <span>All pieces</span>
            <span className="category-arrow">↗</span>
          </button>
        </li>

        {finalCategory.map((category) => (
          <li key={category}>
            <button
              type="button"
              className={`category-button ${
                catName === category ? "active" : ""
              }`}
              onClick={() => setcatName(category)}
            >
              <span>
                {category.replace(/-/g, " ")}
              </span>
              <span className="category-arrow">↗</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="category-caption">
        GOOD DESIGN. GOOD FINDS.
        <br />
        ALWAYS SOMETHING NEW.
      </p>
    </div>
  );
}
