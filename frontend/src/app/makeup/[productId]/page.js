const ProductDetails = async ({ params }) => {
  const { productId } = await params;

  const response = await fetch(
    `https://derma-care-rho.vercel.app/api/products/${productId}`,
    {
      cache: "no-store",
    },
  );

  const result = await response.json();

  const product = result.data.product;

  return (
    <div>
      <h1>Product Details: {productId}</h1>

      <ul>
        <li>Name: {product.name}</li>
        <li>Price: {product.price}</li>
        <li>Brand: {product.brand}</li>
        <li>Description: {product.description}</li>
      </ul>
    </div>
  );
};

export default ProductDetails;
