import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getCountry, insertCountry, updateCountry } from '@/sandbox/api/fx/countryApi'
import type { Country } from '@/sandbox/dto/fx/country'
import { ModalDialog } from '@/components/ModalDialog'

interface Props {
  isOpen: boolean
  countryCode: string
  onClose: (refresh: boolean) => void
  onToast: (msg: string, type: 'info' | 'error') => void
}

const emptyCountry = (): Country => ({
  code: '',
  name: '',
  currencyCode: '',
  nameEn: '',
  nameShort: '',
  sortOrder: 0,
})

type FormErrors = Partial<Record<keyof Country, boolean>>

export const CountryModal = ({ isOpen, countryCode, onClose, onToast }: Props) => {
  const { sandboxUser } = useAuth()
  const isAdmin = sandboxUser?.admin === true
  const isNew = countryCode === ''

  const [form, setForm] = useState<Country>(emptyCountry())
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!isOpen) return
    if (countryCode === '') {
      setForm(emptyCountry())
      setErrors({})
      return
    }
    let cancelled = false
    setIsLoading(true)
    getCountry(countryCode)
      .then((data) => {
        if (!cancelled) {
          setForm(data)
          setErrors({})
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          onToast(e.message, 'error')
          onClose(false)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isOpen, countryCode]) // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (key: keyof Country, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }) as Country)
    setErrors((prev) => ({ ...prev, [key]: false }))
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.code) errs.code = true
    if (!form.name) errs.name = true
    if (!form.currencyCode) errs.currencyCode = true
    if (!form.nameEn) errs.nameEn = true
    if (!form.nameShort) errs.nameShort = true
    if (isNaN(form.sortOrder)) errs.sortOrder = true
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      if (isNew) {
        await insertCountry(form)
        onToast(`[${form.code}] ${form.name} 登録しました。`, 'info')
      } else {
        await updateCountry(countryCode, form)
        onToast(`[${form.code}] ${form.name} 更新しました。`, 'info')
      }
      onClose(true)
    } catch (e) {
      onToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      isNew={isNew}
      title={isNew ? '国情報登録フォーム' : '国情報編集フォーム'}
      isLoading={isLoading}
      onClose={() => onClose(false)}
    >
      <form
        onSubmit={(e) => {
          void handleSubmit(e)
        }}
        className="modal-form"
      >
        <div className="modal-field">
          <label className="modal-label">Code</label>
          <input
            className={`modal-input${errors.code ? ' error' : ''}`}
            value={form.code}
            onChange={(e) => setField('code', e.target.value)}
            maxLength={8}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">Name</label>
          <input
            className={`modal-input${errors.name ? ' error' : ''}`}
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">CurrencyCode</label>
          <input
            className={`modal-input${errors.currencyCode ? ' error' : ''}`}
            value={form.currencyCode}
            onChange={(e) => setField('currencyCode', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">English</label>
          <input
            className={`modal-input${errors.nameEn ? ' error' : ''}`}
            value={form.nameEn}
            onChange={(e) => setField('nameEn', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">Short</label>
          <input
            className={`modal-input${errors.nameShort ? ' error' : ''}`}
            value={form.nameShort}
            onChange={(e) => setField('nameShort', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">Order</label>
          <input
            type="number"
            className={`modal-input${errors.sortOrder ? ' error' : ''}`}
            value={form.sortOrder}
            onChange={(e) => setField('sortOrder', Number(e.target.value))}
          />
        </div>
        {isAdmin && (
          <div className="modal-actions">
            <button type="submit" className={isNew ? 'btn-primary' : 'btn-success'}>
              {isNew ? '新規登録' : '更新'}
            </button>
          </div>
        )}
      </form>
    </ModalDialog>
  )
}
