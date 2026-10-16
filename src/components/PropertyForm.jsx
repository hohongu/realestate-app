import { useState } from 'react'

// 物件の新規登録・編集フォーム（initial があれば編集、なければ新規）
export default function PropertyForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [rent, setRent] = useState(initial?.rent ?? '')
  const [area, setArea] = useState(initial?.area ?? '')
  const [floorPlan, setFloorPlan] = useState(initial?.floor_plan ?? '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    // 保存の成否は親側で処理する
    await onSubmit({
      name: name.trim(),
      rent: Number(rent),
      area: area.trim(),
      floor_plan: floorPlan.trim(),
    })
    setSubmitting(false)
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{initial ? '物件を編集' : '物件を登録'}</h2>
      <label>
        物件名
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        家賃（円）
        <input
          type="number"
          min="0"
          step="1"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          required
        />
      </label>
      <label>
        エリア名
        <input value={area} onChange={(e) => setArea(e.target.value)} required />
      </label>
      <label>
        間取り（例：1LDK）
        <input value={floorPlan} onChange={(e) => setFloorPlan(e.target.value)} required />
      </label>
      <div className="form-actions">
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? '保存中...' : '保存'}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
      </div>
    </form>
  )
}
