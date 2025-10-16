import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Edit, Check, X, ArrowLeft, Mail, Phone, Globe, User, MapPin } from 'lucide-react'
import { useSuppliers } from '@/context/SupplierContext'
import SupplierService from '@/services/supplier.service'

type EditableKey = 'name' | 'email' | 'phone' | 'website' | 'contactPerson' | 'street' | 'city' | 'state' | 'zipCode' | 'country'

const SupplierView: React.FC = () => {
  const { supplierId } = useParams()
  const navigate = useNavigate()
  const { suppliers, updateSupplier, refresh } = useSuppliers()

  const fromList = useMemo(() => suppliers.find(s => s.id === supplierId), [suppliers, supplierId])
  const [loading, setLoading] = useState(true)
  const [supplier, setSupplier] = useState<any>(fromList || null)
  const [editing, setEditing] = useState<Partial<Record<EditableKey, boolean>>>({})
  const [form, setForm] = useState<{ [k in EditableKey]?: string }>({})
  const [savingKey, setSavingKey] = useState<EditableKey | null>(null)

  useEffect(() => {
    (async () => {
      try {
        if (!supplierId) return
        if (!fromList) {
          const res = await SupplierService.getById(supplierId)
          setSupplier(res.data)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [supplierId, fromList])

  useEffect(() => {
    if (!supplier) return;
    setForm({
      name: supplier.name || '',
      email: supplier.email || supplier.contact?.email || '',
      phone: supplier.phone || supplier.contact?.phone || '',
      website: supplier.website || supplier.contact?.website || '',
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
      email: supplier.email || supplier.contact?.email || '',
      phone: supplier.phone || supplier.contact?.phone || '',
      website: supplier.website || supplier.contact?.website || '',
      contactPerson: supplier.contactPerson || supplier.contact?.contactPerson || '',
      street: supplier.address?.street || '',
      city: supplier.address?.city || '',
      state: supplier.address?.state || '',
      zipCode: supplier.address?.zipCode || '',
      country: supplier.address?.country || '',
    }
    setForm(prev => ({ ...prev, [key]: current[key] }))
  }

  const saveField = async (key: EditableKey) => {
    if (!supplierId) return
    setSavingKey(key)
    try {
      const payload: any = {}
      if (key === 'name') payload.name = form.name
      if (['email', 'phone', 'website', 'contactPerson'].includes(key)) {
        payload.contact = {
          email: form.email,
          phone: form.phone,
          website: form.website,
          contactPerson: form.contactPerson,
        }
      }
      if (['street', 'city', 'state', 'zipCode', 'country'].includes(key)) {
        payload.address = {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        }
      }
      await updateSupplier(supplierId, payload)
      await refresh()
      const res = await SupplierService.getById(supplierId)
      setSupplier(res.data)
      setEditing(prev => ({ ...prev, [key]: false }))
    } finally {
      setSavingKey(null)
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Supplier Details</h1>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Name</div>
            <div className="flex items-center gap-2">
              {!editing.name ? (
                <>
                  <div className="text-foreground font-medium">{form.name}</div>
                  <button onClick={() => startEdit('name')} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={form.name || ''} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-64" />
                  <button disabled={savingKey === 'name'} onClick={() => saveField('name')} className="p-1 rounded hover:bg-green-100"><Check className="w-4 h-4" /></button>
                  <button onClick={() => cancelEdit('name')} className="p-1 rounded hover:bg-red-100"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4" /><span className="text-sm">Email</span></div>
              {!editing.email ? (
                <div className="flex items-center gap-2">
                  <div className="text-foreground font-medium">{form.email}</div>
                  <button onClick={() => startEdit('email')} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={form.email || ''} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-64" />
                  <button disabled={savingKey === 'email'} onClick={() => saveField('email')} className="p-1 rounded hover:bg-green-100"><Check className="w-4 h-4" /></button>
                  <button onClick={() => cancelEdit('email')} className="p-1 rounded hover:bg-red-100"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>
            {/* Phone */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4" /><span className="text-sm">Phone</span></div>
              {!editing.phone ? (
                <div className="flex items-center gap-2">
                  <div className="text-foreground font-medium">{form.phone}</div>
                  <button onClick={() => startEdit('phone')} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={form.phone || ''} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} className="w-64" />
                  <button disabled={savingKey === 'phone'} onClick={() => saveField('phone')} className="p-1 rounded hover:bg-green-100"><Check className="w-4 h-4" /></button>
                  <button onClick={() => cancelEdit('phone')} className="p-1 rounded hover:bg-red-100"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>
            {/* Website */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground"><Globe className="w-4 h-4" /><span className="text-sm">Website</span></div>
              {!editing.website ? (
                <div className="flex items-center gap-2">
                  <div className="text-foreground font-medium break-all">{form.website}</div>
                  <button onClick={() => startEdit('website')} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={form.website || ''} onChange={(e) => setForm(prev => ({ ...prev, website: e.target.value }))} className="w-64" />
                  <button disabled={savingKey === 'website'} onClick={() => saveField('website')} className="p-1 rounded hover:bg-green-100"><Check className="w-4 h-4" /></button>
                  <button onClick={() => cancelEdit('website')} className="p-1 rounded hover:bg-red-100"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>
            {/* Contact Person */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground"><User className="w-4 h-4" /><span className="text-sm">Contact Person</span></div>
              {!editing.contactPerson ? (
                <div className="flex items-center gap-2">
                  <div className="text-foreground font-medium">{form.contactPerson}</div>
                  <button onClick={() => startEdit('contactPerson')} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={form.contactPerson || ''} onChange={(e) => setForm(prev => ({ ...prev, contactPerson: e.target.value }))} className="w-64" />
                  <button disabled={savingKey === 'contactPerson'} onClick={() => saveField('contactPerson')} className="p-1 rounded hover:bg-green-100"><Check className="w-4 h-4" /></button>
                  <button onClick={() => cancelEdit('contactPerson')} className="p-1 rounded hover:bg-red-100"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /><span className="text-sm">Address</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {(['street', 'city', 'state'] as EditableKey[]).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground capitalize">{key}</div>
                  {!editing[key] ? (
                    <div className="flex items-center gap-2">
                      <div className="text-foreground font-medium">{form[key]}</div>
                      <button onClick={() => startEdit(key)} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input value={form[key] || ''} onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-48" />
                      <button disabled={savingKey === key} onClick={() => saveField(key)} className="p-1 rounded hover:bg-green-100"><Check className="w-4 h-4" /></button>
                      <button onClick={() => cancelEdit(key)} className="p-1 rounded hover:bg-red-100"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              ))}
              {(['zipCode', 'country'] as EditableKey[]).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground capitalize">{key}</div>
                  {!editing[key] ? (
                    <div className="flex items-center gap-2">
                      <div className="text-foreground font-medium">{form[key]}</div>
                      <button onClick={() => startEdit(key)} className="p-1 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input value={form[key] || ''} onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))} className="w-48" />
                      <button disabled={savingKey === key} onClick={() => saveField(key)} className="p-1 rounded hover:bg-green-100"><Check className="w-4 h-4" /></button>
                      <button onClick={() => cancelEdit(key)} className="p-1 rounded hover:bg-red-100"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SupplierView


