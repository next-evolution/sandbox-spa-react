interface Props {
  isOpen: boolean
  isNew: boolean
  title: string
  isLoading: boolean
  onClose: () => void
  children: React.ReactNode
  boxStyle?: React.CSSProperties
}

export const ModalDialog = ({
  isOpen,
  isNew,
  title,
  isLoading,
  onClose,
  children,
  boxStyle,
}: Props) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={boxStyle} onClick={(ev) => ev.stopPropagation()}>
        {isLoading && (
          <div className="modal-loading-overlay">
            <div className="loading-spinner" />
          </div>
        )}
        <div className={`modal-title ${isNew ? 'modal-title-new' : 'modal-title-edit'}`}>
          <span>{title}</span>
          <button className="modal-close-btn" type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
