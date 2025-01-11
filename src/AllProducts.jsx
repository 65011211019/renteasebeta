import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://rent-ease-api-beta.vercel.app/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        // Fetch images for each product
        const productImagesResponse = await fetch("https://rent-ease-api-beta.vercel.app/api/productimages");
        if (!productImagesResponse.ok) {
          throw new Error("Failed to fetch product images");
        }
        const productImagesData = await productImagesResponse.json();

        // Map products to include images
        const mappedProducts = data.map((product) => {
          const productImages = productImagesData
            .filter((image) => image.product_id === product.product_id)
            .map((image) => image.product_image_url);

          return {
            id: product.product_id,
            images: productImages.length > 0 ? productImages : ["https://via.placeholder.com/150"], // Default to placeholder if no images
            title: product.product_name,
            description: product.product_desc,
            price: product.product_price,
          };
        });

        setProducts(mappedProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <section className="py-16 px-4 sm:px-6 md:px-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8">
        สินค้าทั้งหมด
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <ProductCard
              images={product.images} // Pass images array here
              title={product.title}
              description={product.description}
              price={product.price}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default AllProducts;
