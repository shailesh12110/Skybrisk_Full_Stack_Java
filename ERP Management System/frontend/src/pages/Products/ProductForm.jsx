import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Paper, TextField, Typography, Grid, MenuItem } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { createProduct, updateProduct, getProductById } from '../../redux/slices/productsSlice';

const validationSchema = Yup.object({
  sku: Yup.string().required('SKU is required'),
  name: Yup.string().required('Name is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
  costPrice: Yup.number().min(0, 'Cost price must be positive').required('Cost price is required'),
  stock: Yup.number().min(0, 'Stock must be positive').required('Stock is required'),
  reorderLevel: Yup.number().min(0, 'Reorder level must be positive').required('Reorder level is required'),
  unit: Yup.string().required('Unit is required'),
});

const categories = ['Electronics', 'Furniture', 'Office Supplies', 'Hardware', 'Software', 'Other'];
const units = ['pcs', 'box', 'kg', 'lbs', 'set', 'dozen'];

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.products);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [id, dispatch]);

  const initialValues = {
    sku: product?.sku || '',
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price || 0,
    costPrice: product?.costPrice || 0,
    stock: product?.stock || 0,
    reorderLevel: product?.reorderLevel || 10,
    unit: product?.unit || 'pcs',
    isActive: product?.isActive !== undefined ? product.isActive : true,
  };

  const handleSubmit = async (values) => {
    if (isEditMode) {
      await dispatch(updateProduct({ id, data: values }));
    } else {
      await dispatch(createProduct(values));
    }
    navigate('/products');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="sku"
                    label="SKU"
                    value={values.sku}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sku && Boolean(errors.sku)}
                    helperText={touched.sku && errors.sku}
                    disabled={isEditMode}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Product Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    name="category"
                    label="Category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.category && Boolean(errors.category)}
                    helperText={touched.category && errors.category}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    name="unit"
                    label="Unit"
                    value={values.unit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.unit && Boolean(errors.unit)}
                    helperText={touched.unit && errors.unit}
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="price"
                    label="Selling Price"
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="costPrice"
                    label="Cost Price"
                    type="number"
                    value={values.costPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.costPrice && Boolean(errors.costPrice)}
                    helperText={touched.costPrice && errors.costPrice}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="stock"
                    label="Stock Quantity"
                    type="number"
                    value={values.stock}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.stock && Boolean(errors.stock)}
                    helperText={touched.stock && errors.stock}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="reorderLevel"
                    label="Reorder Level"
                    type="number"
                    value={values.reorderLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.reorderLevel && Boolean(errors.reorderLevel)}
                    helperText={touched.reorderLevel && errors.reorderLevel}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    name="isActive"
                    label="Status"
                    value={values.isActive}
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button type="submit" variant="contained" size="large">
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/products')}
                >
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default ProductForm;
