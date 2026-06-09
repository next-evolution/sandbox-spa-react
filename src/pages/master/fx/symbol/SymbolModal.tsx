import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ModalDialog } from '@/components/ModalDialog'
import { getSymbol, insertSymbol, updateSymbol } from '@/sandbox/api/fx/symbolApi'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'
import { SYMBOL_TYPES, type SymbolType } from '@/constants/symbolType'

interface Props {
  isOpen: boolean
  symbolKey: string | null
  defaultSymbolType: SymbolType
  onClose: (refresh: boolean) => void
  onToast: (msg: string, type: 'info' | 'error') => void
}

const emptyDto = (symbolType: SymbolType): SymbolDto => ({
  symbol: '',
  symbolType,
  name: '',
  validScale: 0,
  targetVolatility: 0,
  sortOrder: 0,
})

type FormErrors = Partial<Record<keyof SymbolDto, boolean>>

export const SymbolModal = ({ isOpen, symbolKey, defaultSymbolType, onClose, onToast }: Props) => {
  const { sandboxUser } = useAuth()
  const isAdmin = sandboxUser?.admin === true
  const isNew = symbolKey === null

  const [form, setForm] = useState<SymbolDto>(emptyDto(defaultSymbolType))
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!isOpen) return
    if (symbolKey === null) {
      setForm(emptyDto(defaultSymbolType))
      setErrors({})
      return
    }
    let cancelled = false
    setIsLoading(true)
    getSymbol(symbolKey)
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
  }, [isOpen, symbolKey, defaultSymbolType]) // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (key: keyof SymbolDto, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }) as SymbolDto)
    setErrors((prev) => ({ ...prev, [key]: false }))
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.symbol) errs.symbol = true
    if (!form.symbolType) errs.symbolType = true
    if (!form.name) errs.name = true
    if (isNaN(form.validScale)) errs.validScale = true
    if (isNaN(form.targetVolatility)) errs.targetVolatility = true
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
        await insertSymbol(form)
        onToast(`[${form.symbol}] ${form.name} 登録しました。`, 'info')
      } else {
        await updateSymbol(symbolKey!, form)
        onToast(`[${form.symbol}] ${form.name} 更新しました。`, 'info')
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
      title={isNew ? 'Symbol 登録フォーム' : 'Symbol 編集フォーム'}
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
          <label className="modal-label">Symbol</label>
          <input
            className={`modal-input${errors.symbol ? ' error' : ''}`}
            value={form.symbol}
            onChange={(e) => setField('symbol', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">Type</label>
          <select
            className={`modal-input${errors.symbolType ? ' error' : ''}`}
            value={form.symbolType}
            onChange={(e) => setField('symbolType', e.target.value)}
          >
            {SYMBOL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
          <label className="modal-label">Scale</label>
          <input
            type="number"
            className={`modal-input${errors.validScale ? ' error' : ''}`}
            value={form.validScale}
            onChange={(e) => setField('validScale', Number(e.target.value))}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">Volatility</label>
          <input
            type="number"
            step="0.001"
            className={`modal-input${errors.targetVolatility ? ' error' : ''}`}
            value={form.targetVolatility}
            onChange={(e) => setField('targetVolatility', Number(e.target.value))}
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
