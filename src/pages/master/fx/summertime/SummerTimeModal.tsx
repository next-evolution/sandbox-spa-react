import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ModalDialog } from '@/components/ModalDialog'
import { getSummerTime, insertSummerTime, updateSummerTime } from '@/sandbox/api/fx/summerTimeApi'
import type { SummerTimeDto } from '@/sandbox/dto/fx/summerTime'

interface Props {
  isOpen: boolean
  targetYear: number | null
  onClose: (refresh: boolean) => void
  onToast: (msg: string, type: 'info' | 'error') => void
}

const emptyDto = (): SummerTimeDto => ({
  targetYear: new Date().getFullYear(),
  applyStart: '',
  applyEnd: '',
})

type FormErrors = Partial<Record<keyof SummerTimeDto, boolean>>

export const SummerTimeModal = ({ isOpen, targetYear, onClose, onToast }: Props) => {
  const { sandboxUser } = useAuth()
  const isAdmin = sandboxUser?.admin === true
  const isNew = targetYear === null

  const [form, setForm] = useState<SummerTimeDto>(emptyDto())
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!isOpen) return
    if (targetYear === null) {
      setForm(emptyDto())
      setErrors({})
      return
    }
    let cancelled = false
    setIsLoading(true)
    getSummerTime(targetYear)
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
  }, [isOpen, targetYear]) // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (key: keyof SummerTimeDto, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }) as SummerTimeDto)
    setErrors((prev) => ({ ...prev, [key]: false }))
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.targetYear || isNaN(form.targetYear)) errs.targetYear = true
    if (!form.applyStart) errs.applyStart = true
    if (!form.applyEnd) errs.applyEnd = true
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      if (isNew) {
        await insertSummerTime(form)
        onToast(`${form.targetYear} 年 登録しました。`, 'info')
      } else {
        await updateSummerTime(targetYear!, form)
        onToast(`${form.targetYear} 年 更新しました。`, 'info')
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
      title={isNew ? 'サマータイム 登録フォーム' : 'サマータイム 編集フォーム'}
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
          <label className="modal-label">Year</label>
          <input
            type="number"
            className={`modal-input${errors.targetYear ? ' error' : ''}`}
            value={form.targetYear}
            onChange={(e) => setField('targetYear', Number(e.target.value))}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">Apply Start</label>
          <input
            type="date"
            className={`modal-input${errors.applyStart ? ' error' : ''}`}
            value={form.applyStart}
            onChange={(e) => setField('applyStart', e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">Apply End</label>
          <input
            type="date"
            className={`modal-input${errors.applyEnd ? ' error' : ''}`}
            value={form.applyEnd}
            onChange={(e) => setField('applyEnd', e.target.value)}
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
