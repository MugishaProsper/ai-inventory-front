import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Edit, ArrowLeft, Mail, Phone, Globe, User, MapPin, Pencil } from 'lucide-react'
import { useSuppliers } from '@/context/SupplierContext'
import SupplierService from '@/services/supplier.service'

type EditableKey = 'name' | 'email' | 'phone' | 'website' | 'contactPerson' | 'street' | 'city' | 'state' | 'zipCode' | 'country' | 'logo'

const SupplierView: React.FC = () => {
  const { supplierId } = useParams()
  const navigate = useNavigate()
  const { suppliers, updateSupplier, refresh } = useSuppliers()

  const fromList = useMemo(() => suppliers.find(s => s.id === supplierId), [suppliers, supplierId])
  const [loading, setLoading] = useState(true)
  const [supplier, setSupplier] = useState<any>(fromList || null)
  const [editing, setEditing] = useState<Partial<Record<EditableKey, boolean>>>({})
  const [form, setForm] = useState<{ [k in EditableKey]?: string }>({})
  const [saving, setSaving] = useState<boolean>(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        if (!supplierId) return;
        const res = await SupplierService.getById(supplierId)
        setSupplier(res.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [supplierId, fromList])

  useEffect(() => {
    if (!supplier) return;
    setForm({
      name: supplier.name || '',
      email: supplier.contact?.email || '',
      phone: supplier.contact?.phone || '',
      website: supplier.contact?.website || '',
      contactPerson: supplier.contactPerson || supplier.contact?.contactPerson || '',
      street: supplier.address?.street || '',
      city: supplier.address?.city || '',
      state: supplier.address?.state || '',
      zipCode: supplier.address?.zipCode || '',
      country: supplier.address?.country || '',
    })
  }, [supplier])

  const startEdit = (key: EditableKey) => setEditing(prev => ({ ...prev, [key]: true }))
  const cancelEdit = (key: EditableKey) => {
    setEditing(prev => ({ ...prev, [key]: false }))
    // reset to current value
    if (!supplier) return
    const current: any = {
      name: supplier.name || '',
      email: supplier.contact?.email || '',
      phone: supplier.contact?.phone || '',
      website: supplier.contact?.website || '',
      contactPerson: supplier.contact?.contactPerson || '',
      street: supplier.address?.street || '',
      city: supplier.address?.city || '',
      state: supplier.address?.state || '',
      zipCode: supplier.address?.zipCode || '',
      country: supplier.address?.country || '',
      logoUrl: supplier?.logo
    }
    setForm(prev => ({ ...prev, [key]: current[key] }))
  }

  const saveAll = async () => {
    if (!supplierId) return
    setSaving(true)
    try {
      const fd = new FormData()
      if (logoFile) fd.append('logo', logoFile)
      if (form.name !== undefined) fd.append('name', form.name || '')
      const contact: Record<string, string> = {}
      if (form.email) contact.email = form.email
      if (form.phone) contact.phone = form.phone
      if (form.website) contact.website = form.website
      if (form.contactPerson) contact.contactPerson = form.contactPerson
      if (Object.keys(contact).length > 0) {
        fd.append('contact', JSON.stringify(contact))
      }
      const address: Record<string, string> = {}
      if (form.street) address.street = form.street
      if (form.city) address.city = form.city
      if (form.state) address.state = form.state
      if (form.zipCode) address.zipCode = form.zipCode
      if (form.country) address.country = form.country
      if (Object.keys(address).length > 0) {
        fd.append('address', JSON.stringify(address))
      }

      await updateSupplier(supplierId, fd)
      await refresh()
      const res = await SupplierService.getById(supplierId)
      setSupplier(res.data)
      setEditing({})
      setLogoFile(null)
      setLogoPreview(res.data.logo)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!supplier) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Supplier Details</h1>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo + Upload */}
            <div className="flex items-start gap-4 w-full">
              <div className="w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                {(logoPreview || supplier?.logo) ? (
                  <>
                    <div className="relative w-full h-full">
                      <img src={supplier.logo} alt="logo" className="w-full h-full object-cover" />
                      {/* Pencil icon to float over the image */}
                      <button
                        type="button"
                        className="absolute p-2 top-2 right-2 bg-gray-400 rounded-full shadow hover:bg-gray-500"
                        aria-label="Edit Logo"
                        tabIndex={0}
                      >
                        <Pencil className="w-4 h-4 text-gray-100 hover:text-gray-200" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-muted-foreground text-xs">No Logo</div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Upload Logo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setLogoFile(file)
                          if (file) {
                            const url = URL.createObjectURL(file)
                            setLogoPreview(url)
                          } else {
                            setLogoPreview(null)
                          }
                        }}
                        className="absolute p-2 top-2 right-2 bg-gray-400 rounded-full shadow hover:bg-gray-500"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Name + Code */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Name</div>
                <div className="flex items-center gap-2">
                  {!editing.name ? (
                    <>
                      <div className="text-foreground font-medium text-lg">{form.name}</div>
                      <button onClick={() => startEdit('name')} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input value={form.name || ''} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-80" />
                      <button onClick={() => cancelEdit('name')} className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs">Cancel</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Code</div>
                  <div className="text-sm font-medium text-foreground break-all">{supplier?.code || '-'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${supplier?.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : supplier?.status === 'inactive'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {supplier?.status || '-'}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Rating</div>
                  <div className="text-sm font-medium text-foreground">{supplier?.performance?.rating ?? 0}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Address */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Contact & Address</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4" /><span className="text-sm">Email</span></div>
                {!editing.email ? (
                  <button onClick={() => startEdit('email')} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                ) : null}
              </div>
              {!editing.email ? (
                <div className="text-foreground font-medium">{form.email || '-'}</div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={form.email || ''} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full" />
                  <button onClick={() => cancelEdit('email')} className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs">Cancel</button>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4" /><span className="text-sm">Phone</span></div>
                {!editing.phone ? (
                  <button onClick={() => startEdit('phone')} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                ) : null}
              </div>
              {!editing.phone ? (
                <div className="text-foreground font-medium">{form.phone || '-'}</div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={form.phone || ''} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full" />
                  <button onClick={() => cancelEdit('phone')} className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs">Cancel</button>
                </div>
              )}
            </div>

            {/* Website */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-muted-foreground"><Globe className="w-4 h-4" /><span className="text-sm">Website</span></div>
                {!editing.website ? (
                  <button onClick={() => startEdit('website')} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                ) : null}
              </div>
              {!editing.website ? (
                <div className="text-foreground font-medium break-all">{form.website || '-'}</div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={form.website || ''} onChange={(e) => setForm(prev => ({ ...prev, website: e.target.value }))} className="w-full" />
                  <button onClick={() => cancelEdit('website')} className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs">Cancel</button>
                </div>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-muted-foreground"><User className="w-4 h-4" /><span className="text-sm">Contact Person</span></div>
                {!editing.contactPerson ? (
                  <button onClick={() => startEdit('contactPerson')} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                ) : null}
              </div>
              {!editing.contactPerson ? (
                <div className="text-foreground font-medium">{form.contactPerson || '-'}</div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={form.contactPerson || ''} onChange={(e) => setForm(prev => ({ ...prev, contactPerson: e.target.value }))} className="w-full" />
                  <button onClick={() => cancelEdit('contactPerson')} className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs">Cancel</button>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2"><MapPin className="w-4 h-4" /><span className="text-sm">Address</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['street', 'city', 'state'] as EditableKey[]).map((key) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground capitalize">{key}</div>
                    {!editing[key] ? (
                      <button onClick={() => startEdit(key)} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                    ) : null}
                  </div>
                  {!editing[key] ? (
                    <div className="text-foreground font-medium">{form[key] || '-'}</div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input value={form[key] || ''} onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-full" />
                      <button onClick={() => cancelEdit(key)} className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs">Cancel</button>
                    </div>
                  )}
                </div>
              ))}
              {(['zipCode', 'country'] as EditableKey[]).map((key) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground capitalize">{key}</div>
                    {!editing[key] ? (
                      <button onClick={() => startEdit(key)} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                    ) : null}
                  </div>
                  {!editing[key] ? (
                    <div className="text-foreground font-medium">{form[key] || '-'}</div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input value={form[key] || ''} onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-full" />
                      <button onClick={() => cancelEdit(key)} className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs">Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button onClick={saveAll} disabled={saving} className="shadow-lg">Save Changes</Button>
      </div>
    </div>
  )
}

export default SupplierView


