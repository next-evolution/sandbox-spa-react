import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ModalDialog } from '@/components/ModalDialog'
import {
  getEconomicIndicator,
  insertEconomicIndicator,
  updateEconomicIndicator,
} from '@/sandbox/api/fx/economicIndicatorApi'
import type { EconomicIndicatorDto, KeyValue } from '@/sandbox/dto/fx/economicIndicator'
import { IMPORTANCE_TYPES } from '@/sandbox/dto/fx/economicIndicator'

interface IndicatorKey {
  code: string | null
  countryCode: string
}

interface Props {
  isOpen: boolean
  indicatorKey: IndicatorKey
  countryList: KeyValue[]
  onClose: (refresh: boolean) => void
  onToast: (msg: string, type: 'info' | 'error') => void
}

const emptyDto = (countryCode: string): EconomicIndicatorDto => ({
  code: '',
  countryCode,
  name: '',
  importance: 'H',
  description: '',
  unitOfValue: '',
})

type FormErrors = Partial<Record<keyof EconomicIndicatorDto, boolean>>

export const EconomicIndicatorModal = ({
  isOpen,
  indicatorKey,
  countryList,
  onClose,
  onToast,
}: Props) => {
  const { sandboxUser } = useAuth()
  const isAdmin = sandboxUser?.admin === true
  const isNew = indicatorKey.code === null

  const [form, setForm] = useState<EconomicIndicatorDto>(emptyDto(indicatorKey.countryCode))
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!isOpen) return
    if (indicatorKey.code === null) {
      setForm(emptyDto(indicatorKey.countryCode))
      setErrors({})
      return
    }
    let cancelled = false
    setIsLoading(true)
    getEconomicIndicator(indicatorKey.countryCode, indicatorKey.code)
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
  }, [isOpen, indicatorKey.code, indicatorKey.countryCode]) // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (key: keyof EconomicIndicatorDto, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: false }))
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.countryCode) errs.countryCode = true
    if (!form.importance) errs.importance = true
    if (!form.name) errs.name = true
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      if (isNew) {
        await insertEconomicIndicator(form)
        onToast(`[${form.countryCode}] ${form.name} 登録しました。`, 'info')
      } else {
        await updateEconomicIndicator(indicatorKey.countryCode, indicatorKey.code!, form)
        onToast(`[${form.countryCode}] ${form.name} 更新しました。`, 'info')
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
      title={isNew ? '経済指標 登録フォーム' : '経済指標 編集フォーム'}
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
          <label className="modal-label">国コード</label>
          <select
            className={`modal-input${errors.countryCode ? ' error' : ''}`}
            value={form.countryCode}
            onChange={(e) => setField('countryCode', e.target.value)}
          >
            {countryList.map((c) => (
              <option key={c.key} value={c.key}>
                {c.key} - {c.value}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label className="modal-label">重要度</label>
          <select
            className={`modal-input${errors.importance ? ' error' : ''}`}
            value={form.importance}
            onChange={(e) => setField('importance', e.target.value)}
          >
            {IMPORTANCE_TYPES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label className="modal-label">指標名</label>
          <input
            className={`modal-input${errors.name ? ' error' : ''}`}
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">詳細</label>
          <input
            className="modal-input"
            value={form.description ?? ''}
            onChange={(e) => setField('description', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">単位</label>
          <input
            className="modal-input"
            value={form.unitOfValue ?? ''}
            onChange={(e) => setField('unitOfValue', e.target.value)}
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
