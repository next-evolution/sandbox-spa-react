import { useEffect, useState, type FormEvent } from 'react'
import { ModalDialog } from '@/components/ModalDialog'
import {
  getEconomicIndicatorData,
  insertEconomicIndicatorData,
  updateEconomicIndicatorData,
  fetchEconomicIndicatorListByCountry,
} from '@/sandbox/api/fx/economicIndicatorDataApi'
import type { EconomicIndicatorData } from '@/sandbox/dto/fx/economicIndicatorData'
import type { KeyValue } from '@/sandbox/dto/fx/economicIndicator'

interface DataKey {
  id: number | null
  publication: string | null
}

interface Props {
  isOpen: boolean
  dataKey: DataKey
  defaultCountryCode: string
  countryList: KeyValue[]
  onClose: (refresh: boolean) => void
  onToast: (msg: string, type: 'info' | 'error') => void
}

interface FormState {
  economicIndicatorId: number
  countryCode: string
  publicationDate: string
  publicationTime: string
  subTitle: string
  resultValue: string
  forecastValue: string
  previousValue: string
  memo: string
}

const emptyForm = (countryCode: string): FormState => ({
  economicIndicatorId: 0,
  countryCode,
  publicationDate: '',
  publicationTime: '',
  subTitle: '',
  resultValue: '-',
  forecastValue: '',
  previousValue: '',
  memo: '',
})

type FormErrors = Partial<Record<keyof FormState, boolean>>

export const EconomicIndicatorDataModal = ({
  isOpen,
  dataKey,
  defaultCountryCode,
  countryList,
  onClose,
  onToast,
}: Props) => {
  const isNew = dataKey.id === null

  const [form, setForm] = useState<FormState>(emptyForm(defaultCountryCode || 'US'))
  const [indicatorList, setIndicatorList] = useState<KeyValue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const loadIndicatorList = async (countryCode: string) => {
    try {
      const list = await fetchEconomicIndicatorListByCountry(countryCode)
      setIndicatorList(list)
      return list
    } catch {
      return []
    }
  }

  useEffect(() => {
    if (!isOpen) return
    setErrors({})
    let cancelled = false

    const init = async () => {
      setIsLoading(true)
      try {
        if (isNew) {
          const cc = defaultCountryCode || 'US'
          const list = await fetchEconomicIndicatorListByCountry(cc)
          if (!cancelled) {
            setIndicatorList(list)
            setForm({ ...emptyForm(cc), economicIndicatorId: list[0] ? Number(list[0].key) : 0 })
          }
        } else {
          const data = await getEconomicIndicatorData(dataKey.id!, dataKey.publication!)
          const list = await fetchEconomicIndicatorListByCountry(data.countryCode)
          if (!cancelled) {
            setIndicatorList(list)
            setForm({
              economicIndicatorId: data.id,
              countryCode: data.countryCode,
              publicationDate: data.publicationDate,
              publicationTime: data.publicationTime,
              subTitle: data.subTitle ?? '',
              resultValue: data.resultValue,
              forecastValue: data.forecastValue ?? '',
              previousValue: data.previousValue ?? '',
              memo: data.memo ?? '',
            })
          }
        }
      } catch (e) {
        if (!cancelled) {
          onToast((e as Error).message, 'error')
          onClose(false)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void init()
    return () => {
      cancelled = true
    }
  }, [isOpen, dataKey.id, dataKey.publication]) // eslint-disable-line react-hooks/exhaustive-deps

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: false }))
  }

  const handleCountryChange = async (countryCode: string) => {
    setField('countryCode', countryCode)
    setIsLoading(true)
    const list = await loadIndicatorList(countryCode)
    setForm((prev) => ({
      ...prev,
      countryCode,
      economicIndicatorId: list[0] ? Number(list[0].key) : 0,
    }))
    setIsLoading(false)
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.countryCode) errs.countryCode = true
    if (!form.economicIndicatorId) errs.economicIndicatorId = true
    if (!form.publicationDate) errs.publicationDate = true
    if (!form.publicationTime) errs.publicationTime = true
    if (!form.resultValue) errs.resultValue = true
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const publication = `${form.publicationDate} ${form.publicationTime}:00`
    const data: EconomicIndicatorData = {
      id: form.economicIndicatorId,
      countryCode: form.countryCode,
      name: '',
      importance: '',
      publication,
      publicationDate: form.publicationDate,
      publicationTime: form.publicationTime,
      dayOfWeek: 0,
      subTitle: form.subTitle || undefined,
      resultValue: form.resultValue,
      forecastValue: form.forecastValue || undefined,
      previousValue: form.previousValue || undefined,
      memo: form.memo || undefined,
    }

    setIsLoading(true)
    try {
      if (isNew) {
        await insertEconomicIndicatorData(data)
        onToast(`登録しました。`, 'info')
      } else {
        await updateEconomicIndicatorData(dataKey.id!, dataKey.publication!, data)
        onToast(`更新しました。`, 'info')
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
      title={isNew ? '経済指標データ 登録フォーム' : '経済指標データ 編集フォーム'}
      isLoading={isLoading}
      onClose={() => onClose(false)}
      boxStyle={{ minWidth: 520 }}
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
            onChange={(e) => {
              void handleCountryChange(e.target.value)
            }}
          >
            {countryList.map((c) => (
              <option key={c.key} value={c.key}>
                {c.key} - {c.value}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label className="modal-label">経済指標</label>
          <select
            className={`modal-input${errors.economicIndicatorId ? ' error' : ''}`}
            value={form.economicIndicatorId}
            onChange={(e) => setField('economicIndicatorId', Number(e.target.value))}
          >
            {indicatorList.map((item) => (
              <option key={item.key} value={item.key}>
                {item.value}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label className="modal-label">発表日時</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="date"
              className={`modal-input${errors.publicationDate ? ' error' : ''}`}
              value={form.publicationDate}
              onChange={(e) => setField('publicationDate', e.target.value)}
              style={{ width: 160 }}
            />
            <input
              type="time"
              step={900}
              className={`modal-input${errors.publicationTime ? ' error' : ''}`}
              value={form.publicationTime}
              onChange={(e) => setField('publicationTime', e.target.value)}
              style={{ width: 120 }}
            />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-label">サブタイトル</label>
          <input
            className="modal-input"
            value={form.subTitle}
            onChange={(e) => setField('subTitle', e.target.value)}
            placeholder="subtitle"
            style={{ width: 240 }}
          />
        </div>
        <div className="modal-field">
          <label className="modal-label">結果 / 予想 / 前回</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className={`modal-input${errors.resultValue ? ' error' : ''}`}
              value={form.resultValue}
              onChange={(e) => setField('resultValue', e.target.value)}
              placeholder="結果"
              style={{ width: 90 }}
            />
            <input
              className="modal-input"
              value={form.forecastValue}
              onChange={(e) => setField('forecastValue', e.target.value)}
              placeholder="予想"
              style={{ width: 90 }}
            />
            <input
              className="modal-input"
              value={form.previousValue}
              onChange={(e) => setField('previousValue', e.target.value)}
              placeholder="前回"
              style={{ width: 90 }}
            />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-label">MEMO</label>
          <textarea
            className="modal-input"
            value={form.memo}
            onChange={(e) => setField('memo', e.target.value)}
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>
        <div className="modal-actions">
          <button type="submit" className={isNew ? 'btn-primary' : 'btn-success'}>
            {isNew ? '新規登録' : '更新'}
          </button>
        </div>
      </form>
    </ModalDialog>
  )
}
