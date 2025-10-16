import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/context/ProductContext'
import { useCategories } from '@/context/CategoriesContext'
import { useSuppliers } from '@/context/SupplierContext'

const ProductForm: React.FC = () => {
  const navigate = useNavigate()
  const { productId } = useParams()
  const isEdit = Boolean(productId)
  const { products, createProduct, updateProduct } = useProducts()
  const { categories } = useCategories()
  const { suppliers } = useSuppliers()
  const editing = useMemo(() => products.find(p => p.id === productId), [products, productId])
  const [form, setForm] = useState({
    name: '', sku: '', category: '', supplier: '', description: '', price: '', cost: '', quantity: '', minStock: '', maxStock: '', location: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEdit && editing) {
      setForm({
        name: editing.name || '',
        sku: editing.sku || '',
        category: categories.some(c => c.id === editing.category) ? editing.category : '',
        supplier: suppliers.some(s => s.id === editing.supplier) ? editing.supplier : '',
        description: editing.description || '',
        price: String(editing.price ?? ''),
        cost: String(editing.cost ?? ''),
        quantity: String(editing.quantity ?? ''),
        minStock: String(editing.minStock ?? ''),
        maxStock: String(editing.maxStock ?? ''),
        location: editing.location || '',
      })
    }
  }, [isEdit, editing, categories, suppliers])

  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f))
    setPreviews(urls)
    return () => { urls.forEach(u => URL.revokeObjectURL(u)) }
  }, [files])

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files || []).slice(0, 10)
    setFiles(f)
  }

  const submit = async () => {
    const payload = {
      name: form.name,
      sku: form.sku,
      category: form.category || undefined,
      supplier: form.supplier || undefined,
      description: form.description,
      price: form.price ? parseFloat(form.price) : undefined,
      cost: form.cost ? parseFloat(form.cost) : undefined,
      quantity: form.quantity ? parseInt(form.quantity) : undefined,
      minStock: form.minStock ? parseInt(form.minStock) : undefined,
      maxStock: form.maxStock ? parseInt(form.maxStock) : undefined,
      location: form.location,
    }
    if (isEdit && productId) {
      await updateProduct(productId, payload, files)
    } else {
      await createProduct(payload, files)
    }
    navigate('/products')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        <p className="text-muted-foreground">Fill product details and upload up to 10 images.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block">Name</label>
          <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block">SKU</label>
          <Input value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block">Category</label>
          <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block">Supplier</label>
          <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={form.supplier} onChange={(e) => handleChange('supplier', e.target.value)}>
            <option value="">Select supplier</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block">Description</label>
          <Input value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block">Price</label>
          <Input type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block">Cost</label>
          <Input type="number" value={form.cost} onChange={(e) => handleChange('cost', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block">Quantity</label>
          <Input type="number" value={form.quantity} onChange={(e) => handleChange('quantity', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block">Min Stock</label>
          <Input type="number" value={form.minStock} onChange={(e) => handleChange('minStock', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block">Max Stock</label>
          <Input type="number" value={form.maxStock} onChange={(e) => handleChange('maxStock', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block">Location</label>
          <Input value={form.location} onChange={(e) => handleChange('location', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block">Images (max 10)</label>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFilesSelected} />
          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {previews.map((src, idx) => (
                <div key={src} className="relative group">
                  <img src={src} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          {files.length > 0 && (
            <div className="mt-2 flex justify-end">
              <button type="button" className="text-sm text-muted-foreground underline" onClick={() => setFiles([])}>Clear all</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate('/products')}>Cancel</Button>
        <Button onClick={submit}>{isEdit ? 'Update' : 'Create'}</Button>
      </div>
    </div>
  )
}

export default ProductForm


