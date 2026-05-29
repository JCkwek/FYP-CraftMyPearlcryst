const productService = require('../services/productService');

const getProducts = async (req, res) => {
    try {
        const { q, type, available, limit, latest } = req.query;

        // Validation for limit to prevent NaN errors
        const parsedLimit = (limit && !isNaN(limit)) ? parseInt(limit) : undefined;

        const products = await productService.getProducts({
            query: q,
            type,
            onlyAvailable: available === 'true',
            limit: limit? parseInt(limit) : undefined,
            latest: latest ==='true'
        });

        res.status(200).json(products);
    } catch (err) {
        console.error("Controller Error (getProducts):", err);
        res.status(500).json({ error: "Internal server error while fetching products" });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({ message: "Error fetching product details" });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

//admin
const createProduct = async (req, res) => {
try {
        // check if a file successfully intercepted by Multer
        let imagePath = null;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        // extract standard parameters and format FormData strings back to original types
        const {
            product_name,
            product_price,
            product_desc,
            product_availability,
            product_type,
            product_material,
            is_customisable,
            product_size
        } = req.body;

        // normalize data types explicitly
        const productPayload = {
            product_name,
            product_price: parseFloat(product_price),
            product_desc: product_desc || null,
            product_image: imagePath,
            product_availability: product_availability === 'true',
            product_type,
            product_material: product_material || null,
            is_customisable: is_customisable === 'true',

            option_type: req.body.option_type,
            sizeInput: req.body.sizeInput,   // 🔥 IMPORTANT FIX
            range_min: req.body.range_min,
            range_max: req.body.range_max,
            range_step: req.body.range_step,
            default_value: req.body.default_value
        };
        
        const newProduct = await productService.createProduct(productPayload);

        return res.status(201).json({
            message: "Product created successfully!",
            product: newProduct
        });
    } catch (err) {
        console.error("Error creating product:", err);
        return res.status(400).json({ error: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
    
        const productData = {
            ...req.body,
            ...(req.file && {
                product_image: `/uploads/${req.file.filename}`
            }),
            is_customisable: req.body.is_customisable === 'true',
            product_availability: req.body.product_availability === 'true'
        };

        const updatedResult = await productService.updateProduct(id, productData);
        
        return res.status(200).json({
            success: true,
            message: "Catalog entry synchronized successfully.",
            data: updatedResult
        });
    } catch (error) {
        console.error("Update Controller Exception Error: ", error);
        return res.status(error.message === 'Product not found' ? 404 : 500).json({
            success: false,
            error: error.message || "Internal transaction level processing failure."
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);

        res.json({
            message: 'Product permanently deleted'
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message || 'Failed to delete product'
        });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct};