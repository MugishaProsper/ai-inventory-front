import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSuppliers } from '@/context/SupplierContext'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Truck, Star, Package, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react'

const Suppliers: React.FC = () => {
  const { suppliers, loading, createSupplier, updateSupplier, deleteSupplier } = useSuppliers()
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    contactPerson: '',
    street: '', city: '', state: '', zipCode: '', country: ''
  })
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    // build preview urls
    const urls = images.map(file => URL.createObjectURL(file))
    setPreviews(urls)
    return () => {
      urls.forEach(u => URL.revokeObjectURL(u))
    }
  }, [images])
  const submit = async () => {
    await createSupplier({
      name: form.name,
      contact: { email: form.email, phone: form.phone, website: form.website, contactPerson: form.contactPerson },
      address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country }
    })
    setOpen(false)
    setForm({ name: '', email: '', phone: '', website: '', contactPerson: '', street: '', city: '', state: '', zipCode: '', country: '' })
    setImages([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getRatingColor = (rating: number = 0) => {
    if (rating >= 4.5) return 'text-green-500'
    if (rating >= 4.0) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
            <p className="text-muted-foreground">
              Manage your supplier relationships and performance
            </p>
          </div>
          <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </motion.div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {suppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {supplier.name}
                      </h3>
                      {supplier.email && (
                        <p className="text-sm text-muted-foreground">
                          {supplier.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setSelectedId(supplier.id); setViewOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteSupplier(supplier.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="grid grid-cols-1 gap-3">
                  {supplier.email && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{supplier.email}</span>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-start space-x-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-foreground">{supplier.address}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className={`h-4 w-4 ${getRatingColor(supplier.rating)}`} />
                      <span className="font-semibold text-foreground">
                        {supplier.rating ?? 0}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">
                        {supplier.productsSupplied ?? 0}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Products</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="success">
                    Active
                  </Badge>
                  {supplier.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      Since {supplier.createdAt.toLocaleDateString?.() || ''}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {/* Add Supplier Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-2xl mx-auto bg-background text-foreground rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Add Supplier</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Email</label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Website</label>
                <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Contact Person</label>
                <Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
              </div>
              <div className="md:col-span-2"><hr className="my-2 border-border" /></div>
              <div className="md:col-span-2">
                <label className="mb-1 block">Images (max 10)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []) as File[]
                    const limited = [...images, ...files].slice(0, 10)
                    setImages(limited)
                  }}
                />
                {previews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {previews.map((src, idx) => (
                      <div key={src} className="relative group">
                        <img src={src} alt={`preview-${idx}`} className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => {
                            const next = images.filter((_, i) => i !== idx)
                            setImages(next)
                          }}
                          className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {images.length > 0 && (
                  <div className="mt-2 flex justify-end">
                    <button type="button" className="text-sm text-muted-foreground underline" onClick={() => setImages([])}>Clear all</button>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1 block">Street</label>
                <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">City</label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">State</label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Zip Code</label>
                <Input value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Country</label>
                <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={!form.name.trim()}>Create</Button>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Supplier (simple edit modal reusing form) */}
      {viewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setViewOpen(false); setSelectedId(null); }} />
          <div className="relative w-full max-w-2xl mx-auto bg-background text-foreground rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Edit Supplier</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Email</label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Website</label>
                <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Contact Person</label>
                <Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
              </div>
              <div className="md:col-span-2"><hr className="my-2 border-border" /></div>
              <div>
                <label className="mb-1 block">Street</label>
                <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">City</label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">State</label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Zip Code</label>
                <Input value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block">Country</label>
                <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setViewOpen(false); setSelectedId(null); }}>Cancel</Button>
              <Button onClick={async () => {
                if (!selectedId) return
                await updateSupplier(selectedId, {
                  name: form.name,
                  contact: { email: form.email, phone: form.phone, website: form.website, contactPerson: form.contactPerson },
                  address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country }
                })
                setViewOpen(false)
                setSelectedId(null)
              }}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Suppliers