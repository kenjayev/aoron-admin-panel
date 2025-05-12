import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmToDeleteModal from "../components/ConfirmToDeleteModal";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import NoData from "../components/NoData";
import { fetchWithAuth } from "../services/fetchWithAuth";
const url = {
  productUrl: "https://testaoron.limsa.uz/api/product",
};
const CategoryUrl = "https://testaoron.limsa.uz/api/category";
const sizesUrl = "https://testaoron.limsa.uz/api/sizes";
const colorsUrl = "https://testaoron.limsa.uz/api/colors";
const discountUrl = "https://testaoron.limsa.uz/api/discount";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editedProduct, setEditedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //
  const [materials, setMaterials] = useState([{ name: "", value: "" }]);

  /* Modals isOpen */
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConfirmDeleted, setIsConfirmDeleted] = useState(false);

  /*  */
  const [categories, setCategories] = useState({});
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState("");
  const [discount, setDiscount] = useState({});
  /* */

  const handleMaterialChange = (index, event) => {
    const values = [...materials];
    values[index][event.target.name] = event.target.value;
    setMaterials(values);
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { name: "", value: "" }]);
  };

  const handleRemoveMaterial = (index) => {
    const values = [...materials];
    values.splice(index, 1);
    setMaterials(values);
  };

  /* Access Token */
  const accessToken = localStorage.getItem("access_token");

  /* Any closing Modal function */
  const closeModal = () => {
    setIsOpenModal(false);
    setEditedProduct(null);
    setIsConfirmDeleted(false);
  };
  /* */

  const getProducts = () => {
    setIsLoading(true);
    fetch(url.productUrl)
      .then((res) => res.json())
      .then((response) => {
        response.success
          ? setProducts(response?.data?.products || [])
          : toast.error("Something want error");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // For first loading and handler products
    getProducts();

    // For new Products add Modal
    fetch(CategoryUrl)
      .then((res) => res.json())
      .then((response) => {
        setCategories(response?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
    fetch(sizesUrl)
      .then((res) => res.json())
      .then((response) => {
        setSizes(response?.data || []); // ✅ to'g'ri holat
      })
      .catch((error) => {
        console.error("Error fetching sizes:", error);
        setSizes([]);
      });
    fetch(colorsUrl)
      .then((res) => res.json())
      .then((response) => {
        setColors(response?.data || []); // ✅ to‘g‘ri holat
      })
      .catch((error) => {
        console.error("Error fetching colors:", error);
        setColors([]);
      });
    fetch(discountUrl)
      .then((res) => res.json())
      .then((response) => {
        setDiscount(response?.data || {});
      })
      .catch((error) => {
        console.error("Error fetching colors:", error);
        setDiscount([]);
      });
  }, []);

  /**************** return data from FORM *****************/
  const getDataForm = (e) => {
    const formData = new FormData();
    formData.append("title_en", e.target.title_en.value);
    formData.append("title_ru", e.target.title_ru.value);
    formData.append("title_de", e.target.title_de.value);
    formData.append("description_en", e.target.description_en.value);
    formData.append("description_ru", e.target.description_ru.value);
    formData.append("description_de", e.target.description_de.value);
    formData.append("price", e.target.price.value);
    formData.append("min_sell", e.target.min_sell.value);
    formData.append("category_id", e.target.category_id.value);

    const materialsObject = materials.reduce((acc, item) => {
      if (item.name && item.value) {
        acc[item.name] = item.value;
      }
      return acc;
    }, {});
    formData.append("materials", JSON.stringify(materialsObject));

    sizes?.forEach?.((item) => {
      if (e.target[`size-${item.id}`].checked) {
        formData.append("sizes_id[]", item.id);
      }
    });
    colors?.forEach?.((item) => {
      if (e.target[`color-${item.id}`].checked) {
        formData.append("colors_id[]", item.id);
      }
    });
    e.target.discount_id.value !== "no" &&
      formData.append("discount_id{}", e.target.discount_id.value);

    formData.append("files", e.target.file.files[0]);
    return formData;
  };
  /**************** return data from FORM *****************/

  /* Add New Product */
  const addProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetchWithAuth("https://testaoron.limsa.uz/api/product", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: getDataForm(e),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Products added successfuly");
          closeModal();
          getProducts();
        } else {
          toast.error("Something want Error");
          toast.error(data.message.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error("Something want Error");
        toast.error(err.message);
        toast.error(err);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
    console.log(getDataForm(e));
  };
  /* Add New Product */

  /* Edit Product */
  const editProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetchWithAuth(
      `https://testaoron.limsa.uz/api/product/${editedProduct?.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: getDataForm(e),
      }
    )
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Product edited Successfuly");
          closeModal();
          getProducts();
        } else {
          toast.error("Something want error");
          toast.error(data.message?.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error("Something want error");
        toast.error(err.message);
        toast.error(err);
        setIsLoading(false);
      });
  };
  /* Edit Product */

  // Delete Color Func
  const deleteProduct = (id) => {
    setIsLoading(true);
    fetchWithAuth(`https://testaoron.limsa.uz/api/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((req) => req.json())
      .then((req) => {
        if (req.success) {
          toast.success("Deleted Product successfuly");
          getProducts();
        } else {
          toast.error(req.message.message);
        }
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        setIsLoading(false);
        closeModal();
      });
  };
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Products</h2>
        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition cursor-pointer"
        >
          Add Product
        </button>
      </div>

      {isOpenModal && (
        <Modal closeFunc={closeModal}>
          <h3 className="text-xl font-bold mb-4">
            {editedProduct ? "Edit" : "Add"} Product
          </h3>

          <form onSubmit={editedProduct ? editProduct : addProduct}>
            <div className="w-full max-h-[70vh] overflow-x-hidden overflow-y-auto custom-scrollbar">
              {/* START Product Title in 3 Lng */}
              <div className="mb-2">
                <label htmlFor="title_en" className="block text-gray-700">
                  Product Title (English)
                </label>
                <input
                  required
                  type="text"
                  id="title_en"
                  name="title_en"
                  defaultValue={editedProduct?.title_en ?? ""}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="title_ru" className="block text-gray-700">
                  Product Title (Russian)
                </label>
                <input
                  required
                  type="text"
                  id="title_ru"
                  name="title_ru"
                  defaultValue={editedProduct?.title_ru ?? ""}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="title_de" className="block text-gray-700">
                  Product Title (German)
                </label>
                <input
                  required
                  type="text"
                  id="title_de"
                  name="title_de"
                  defaultValue={editedProduct?.title_de ?? ""}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {/* End Product Title in 3 Lng */}

              {/* START Product Description in 3 Lng */}
              <div className="mb-2">
                <label htmlFor="description_en" className="block text-gray-700">
                  Product Description (English)
                </label>
                <textarea
                  required
                  type="text"
                  name="description_en"
                  id="description_en"
                  className="w-full p-2 border border-gray-300 rounded"
                  maxLength={500}
                  defaultValue={editedProduct?.description_en ?? ""}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="description_ru" className="block text-gray-700">
                  Product Description (Russian)
                </label>
                <textarea
                  required
                  type="text"
                  name="description_ru"
                  id="description_ru"
                  className="w-full p-2 border border-gray-300 rounded"
                  maxLength={500}
                  defaultValue={editedProduct?.description_ru ?? ""}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="description_de" className="block text-gray-700">
                  Product Description (German)
                </label>
                <textarea
                  required
                  type="text"
                  name="description_de"
                  id="description_de"
                  className="w-full p-2 border border-gray-300 rounded"
                  maxLength={500}
                  defaultValue={editedProduct?.description_de ?? ""}
                />
              </div>
              {/* END Product Description in 3 Lng */}
              <div className="mb-2">
                <label htmlFor="price" className="block text-gray-700">
                  Price
                </label>
                <input
                  required
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={editedProduct?.price ?? ""}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="min_sell" className="block text-gray-700">
                  Minimal nechta sotish
                </label>
                <input
                  required
                  type="number"
                  id="min_sell"
                  name="min_sell"
                  defaultValue={editedProduct?.min_sell ?? ""}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {/* Category */}
              <div className="mb-2">
                <label htmlFor="category_id" className="block text-gray-700">
                  Category
                </label>
                <select
                  required
                  name="category_id"
                  id="category_id"
                  defaultValue={editedProduct?.category_id ?? ""}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                >
                  {categories && categories.length > 0 ? (
                    categories.map(({ id, name_en }) => (
                      <option key={id} value={+id}>
                        {name_en}
                      </option>
                    ))
                  ) : (
                    <option>No categories available</option>
                  )}
                </select>
              </div>
              {/* Size */}
              <div className="mb-2">
                <label htmlFor="sizes_id" className="block text-gray-700">
                  Sizes
                </label>
                <div className="flex flex-wrap gap-4 mb-2">
                  {console.log(sizes)}
                  {sizes && sizes.length > 0 ? (
                    sizes.map(({ id, size }) => (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`size-${id}`}
                          name={`size-${id}`}
                          className="mr-2"
                          defaultValue={+id}
                        />
                        <label htmlFor={`size-${id}`} className="text-sm">
                          {size}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-red-400">No Size</p>
                  )}
                </div>
              </div>
              {/* Colors */}
              <div className="mb-2">
                <label htmlFor="colors_id" className="block text-gray-700">
                  Colors
                </label>
                <div className="flex flex-wrap gap-4 mb-2">
                  {console.log(colors)}
                  {colors && colors.length > 0 ? (
                    colors.map(({ id, color_en }) => (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`color-${id}`}
                          name={`color-${id}`}
                          className="mr-2"
                          defaultValue={+id}
                        />
                        <label htmlFor={`color-${id}`} className="text-sm">
                          {color_en}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-red-400">No Size</p>
                  )}
                </div>
              </div>
              {/* Discount */}
              <div className="mb-2">
                <label htmlFor="discount_id" className="block text-gray-700">
                  Discount
                </label>
                <select
                  name="discount_id"
                  id="discount_id"
                  defaultValue={editedProduct?.discount_id ?? ""}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                >
                  <option value="no">No Discount</option>
                  {discount &&
                    discount.map(({ id, discount }) => (
                      <option key={id} value={+id}>
                        {discount}
                      </option>
                    ))}
                </select>
              </div>
              {/* Materials */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Materials
                </label>
                {materials.map((material, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      name="name"
                      placeholder="Material Name"
                      onChange={(e) => handleMaterialChange(index, e)}
                      defaultValue={editedProduct?.materials?.cotton ?? ""}
                      className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      name="value"
                      step={1}
                      min={0}
                      max={100}
                      placeholder="Material Value"
                      defaultValue={editedProduct?.materials?.wool ?? ""}
                      onChange={(e) => handleMaterialChange(index, e)}
                      className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(index)}
                      className="mt-1 cursor-pointer bg-red-500 text-white p-2 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="mt-2 bg-green-500 cursor-pointer text-white p-1 px-2 rounded-md"
                >
                  Add Material
                </button>
              </div>

              <div className="mb-4">
                <label htmlFor="file" className="block text-gray-700">
                  Upload Image
                </label>
                <input
                  required
                  accept="image/*"
                  type="file"
                  name="file"
                  id="file"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full mt-2 text-white bg-green-500 p-2 text-center rounded-lg cursor-pointer disabled:cursor-progress disabled:bg-gray-400"
            >
              {isLoading
                ? "Loading..."
                : editedProduct
                ? "Edit Product"
                : "Add Product"}
            </button>
          </form>
        </Modal>
      )}

      {/* Confirm Modal for Deleted Size */}
      {isConfirmDeleted && (
        <ConfirmToDeleteModal
          type="product"
          isLoading={isLoading}
          closeModal={closeModal}
          deleteFunc={() => deleteProduct(editedProduct?.id)}
        >
          {editedProduct?.title_en} | {editedProduct?.description_en}
        </ConfirmToDeleteModal>
      )}

      {isLoading ? (
        <Loader />
      ) : !products ? (
        <NoData />
      ) : products.length === 0 ? (
        <NoData />
      ) : (
        <div className="relative max-w-full max-h-[55vh] lg:max-h-[60vh] h-full overflow-y-auto overflow-x-auto">
          <table className="table-auto text-sm">
            <thead className="sticky top-0 translate-x-[0.7px] -translate-y-[0.4px] w-full">
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">№</th>
                <th className="border border-gray-300 p-2">Images</th>
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Category</th>
                <th className="border border-gray-300 p-2">Colors</th>
                <th className="border border-gray-300 p-2">Sizes</th>
                <th className="border border-gray-300 p-2">Discount</th>
                <th className="border border-gray-300 p-2">Materials</th>
                <th className="border border-gray-300 p-1 w-[170px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map?.((product, i) => (
                <tr key={product.id} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{i + 1}</td>
                  <td className="border border-gray-300 p-2 cursor-pointer w-[150px] h-[100px]">
                    <img
                      className="w-full h-full rounded-sm"
                      src={`https://testaoron.limsa.uz/${product.images[0]}`}
                      alt={product.full_name}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.title_en || product.name_en || "No Title"}
                  </td>

                  <td className="border border-gray-300 p-2">
                    {product.description_en || "No Description"}
                  </td>

                  <td className="border border-gray-300 p-2">
                    ${product.price || "0"}
                  </td>

                  <td className="border border-gray-300 p-2">
                    {product.category?.name_en || "No Category"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {Array.isArray(product.colors)
                      ? product.colors.map((c) => c.color_en || c).join(", ")
                      : "No Colors"}
                    {product.colors.length === 0 && "No Colors"}
                  </td>

                  <td className="border border-gray-300 p-2">
                    {Array.isArray(product.sizes)
                      ? product.sizes.map((s) => s.size || s).join(", ")
                      : product.sizes?.size || "No Size"}
                    {product.sizes.length === 0 && "No Size"}
                  </td>

                  <td className="border border-gray-300 p-2">
                    {product.discount?.discount || "0"}%
                  </td>

                  <td className="border border-gray-300 p-2">
                    {Array.isArray(product.materials)
                      ? product.materials.join(", ")
                      : typeof product.materials === "object" &&
                        product.materials !== null
                      ? Object.values(product.materials).join(", ")
                      : product.materials || "No Materials"}
                  </td>

                  {/*  */}
                  <td className="border border-gray-300 p-2 w-[200px]">
                    <button
                      onClick={() => {
                        setIsOpenModal(true);
                        setEditedProduct({ ...product });
                      }}
                      className="px-4 py-2 mr-2 mb-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsConfirmDeleted(true);
                        setEditedProduct({ ...product });
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Products;
