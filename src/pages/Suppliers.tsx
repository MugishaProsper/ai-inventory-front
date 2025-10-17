import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSuppliers } from '@/context/SupplierContext'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Star, Package, Phone, Mail, MapPin, Edit, Trash2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Suppliers: React.FC = () => {
  const { suppliers, loading, createSupplier, deleteSupplier } = useSuppliers()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    contactPerson: '',
    street: '', city: '', state: '', zipCode: '', country: ''
  })
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!logo) { setLogoPreview(null); return; }
    const url = URL.createObjectURL(logo)
    setLogoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [logo])
  const submit = async () => {
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('contact', JSON.stringify({ email: form.email, phone: form.phone, website: form.website, contactPerson: form.contactPerson }))
    fd.append('address', JSON.stringify({ street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country }))
    if (logo) fd.append('logo', logo)
    await createSupplier(fd)
    setOpen(false)
    setForm({ name: '', email: '', phone: '', website: '', contactPerson: '', street: '', city: '', state: '', zipCode: '', country: '' })
    setLogo(null)
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
                      <Package className="h-6 w-6 text-white" />
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
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigate(`/suppliers/${supplier.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigate(`/suppliers/${supplier.id}/analytics`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this supplier?')) {
                        await deleteSupplier(supplier.id)
                      }
                    }}>
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
                <label className="mb-1 block">Logo</label>
                <input type="file" accept="image/*" onChange={(e) => setLogo((e.target.files?.[0] as File) || null)} />
                {logoPreview && (
                  <div className="mt-3">
                    <img src={logoPreview} alt="logo-preview" className="w-24 h-24 object-cover rounded border" />
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

      {/* Removed inline edit modal; edits happen on SupplierView */}
    </div>
  )
}

export default Suppliers