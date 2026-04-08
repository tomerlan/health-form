'use client'

import { useState } from 'react'

type FormData = {
  // Section 1 – About You
  identifier: string
  ageRange: string
  biologicalSex: string
  conditions: string
  medications: string

  // Section 2 – The Protocol
  protocolName: string
  duration: string
  protocolDescription: string

  // Section 3 – Challenges & Adjustments
  issues: string
  adjustments: string
  difficultyRating: string

  // Section 4 – Outcomes
  healthChanges: string
  formalTracking: string
  overallEvaluation: string
  anythingElse: string
}

const INITIAL: FormData = {
  identifier: '',
  ageRange: '',
  biologicalSex: '',
  conditions: '',
  medications: '',
  protocolName: '',
  duration: '',
  protocolDescription: '',
  issues: '',
  adjustments: '',
  difficultyRating: '',
  healthChanges: '',
  formalTracking: '',
  overallEvaluation: '',
  anythingElse: '',
}

const STEPS = [
  'About You',
  'The Protocol',
  'Challenges & Adjustments',
  'Outcomes',
]

const AGE_RANGES = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+']
const SEX_OPTIONS = ['Male', 'Female', 'Intersex', 'Prefer not to say']
const DURATIONS = [
  'Less than 1 week',
  '1–2 weeks',
  '2–4 weeks',
  '1–3 months',
  '3–6 months',
  '6–12 months',
  '1+ year',
]
const DIFFICULTY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const EVALUATIONS = [
  'Very positive — significant improvement',
  'Positive — noticeable improvement',
  'Neutral — no clear change',
  'Mixed — some good, some bad',
  'Negative — things got worse',
  'Too early to tell',
]

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-sm font-medium text-stone-700 mb-1">
      {children}
      {optional && <span className="ml-1 text-xs text-stone-400 font-normal">(optional)</span>}
    </label>
  )
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 resize-none transition"
    />
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 transition"
    />
  )
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 transition appearance-none cursor-pointer"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(value === o ? '' : o)}
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            value === o
              ? 'bg-stone-800 text-white border-stone-800'
              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function RatingGroup({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {DIFFICULTY.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onChange(value === d ? '' : d)}
          className={`w-9 h-9 rounded-lg text-sm font-medium border transition ${
            value === d
              ? 'bg-stone-800 text-white border-stone-800'
              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
          }`}
        >
          {d}
        </button>
      ))}
      <div className="w-full flex justify-between text-xs text-stone-400 mt-0.5 px-1">
        <span>Easy</span>
        <span>Very hard</span>
      </div>
    </div>
  )
}

export default function HealthForm() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (field: keyof FormData) => (value: string) =>
    setData((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Response received</h2>
          <p className="text-stone-500 text-sm">Thank you for sharing your experience. Your response has been saved.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">Health Protocol Intake</h1>
          <p className="text-stone-500 text-sm">Share your experience to help others learn what works</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div
                  className={`w-full h-1 rounded-full transition-colors ${
                    i < step ? 'bg-stone-800' : i === step ? 'bg-stone-400' : 'bg-stone-200'
                  }`}
                />
                <span
                  className={`mt-1.5 text-xs hidden sm:block ${
                    i === step ? 'text-stone-700 font-medium' : 'text-stone-400'
                  }`}
                >
                  {s}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Step label (mobile) */}
        <p className="sm:hidden text-xs text-stone-500 mb-4 text-center">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sm:p-8 space-y-5">

          {/* ── Section 1 ── */}
          {step === 0 && (
            <>
              <div>
                <Label optional>Name or identifier</Label>
                <TextInput
                  value={data.identifier}
                  onChange={set('identifier')}
                  placeholder="e.g. Jane D., anonymous_42, or leave blank"
                />
              </div>
              <div>
                <Label optional>Age range</Label>
                <ChipGroup options={AGE_RANGES} value={data.ageRange} onChange={set('ageRange')} />
              </div>
              <div>
                <Label optional>Biological sex</Label>
                <ChipGroup options={SEX_OPTIONS} value={data.biologicalSex} onChange={set('biologicalSex')} />
              </div>
              <div>
                <Label optional>Relevant health conditions</Label>
                <TextArea
                  value={data.conditions}
                  onChange={set('conditions')}
                  placeholder="e.g. Type 2 diabetes, hypothyroidism, chronic fatigue…"
                />
              </div>
              <div>
                <Label optional>Current medications or supplements</Label>
                <TextArea
                  value={data.medications}
                  onChange={set('medications')}
                  placeholder="e.g. Metformin 500mg, Vitamin D 5000 IU…"
                />
              </div>
            </>
          )}

          {/* ── Section 2 ── */}
          {step === 1 && (
            <>
              <div>
                <Label>What protocol did you implement?</Label>
                <TextInput
                  value={data.protocolName}
                  onChange={set('protocolName')}
                  placeholder="e.g. Carnivore diet, cold exposure, berberine protocol…"
                />
              </div>
              <div>
                <Label>How long have you been following it?</Label>
                <Select
                  value={data.duration}
                  onChange={set('duration')}
                  options={DURATIONS}
                  placeholder="Select duration…"
                />
              </div>
              <div>
                <Label>Describe the protocol in detail</Label>
                <TextArea
                  rows={5}
                  value={data.protocolDescription}
                  onChange={set('protocolDescription')}
                  placeholder="Include specifics: timing, dosage, food choices, frequency, any rules you followed…"
                />
              </div>
            </>
          )}

          {/* ── Section 3 ── */}
          {step === 2 && (
            <>
              <div>
                <Label optional>What challenges or side effects did you encounter?</Label>
                <TextArea
                  rows={4}
                  value={data.issues}
                  onChange={set('issues')}
                  placeholder="e.g. Fatigue in the first week, digestive discomfort, social difficulties…"
                />
              </div>
              <div>
                <Label optional>What adjustments or workarounds did you try?</Label>
                <TextArea
                  rows={4}
                  value={data.adjustments}
                  onChange={set('adjustments')}
                  placeholder="e.g. Reduced dose, shifted timing, added electrolytes…"
                />
              </div>
              <div>
                <Label optional>Overall difficulty rating</Label>
                <RatingGroup value={data.difficultyRating} onChange={set('difficultyRating')} />
              </div>
            </>
          )}

          {/* ── Section 4 ── */}
          {step === 3 && (
            <>
              <div>
                <Label>Health changes observed</Label>
                <TextArea
                  rows={4}
                  value={data.healthChanges}
                  onChange={set('healthChanges')}
                  placeholder="Describe any changes — positive or negative — in how you feel, look, or perform…"
                />
              </div>
              <div>
                <Label optional>Any formal tracking or lab work?</Label>
                <TextArea
                  rows={3}
                  value={data.formalTracking}
                  onChange={set('formalTracking')}
                  placeholder="e.g. Blood glucose improved from 7.2 to 5.9 mmol/L, HbA1c dropped, weight down 8 lbs…"
                />
              </div>
              <div>
                <Label>Overall evaluation</Label>
                <Select
                  value={data.overallEvaluation}
                  onChange={set('overallEvaluation')}
                  options={EVALUATIONS}
                  placeholder="Select…"
                />
              </div>
              <div>
                <Label optional>Anything else you want to add?</Label>
                <TextArea
                  rows={3}
                  value={data.anythingElse}
                  onChange={set('anythingElse')}
                  placeholder="Recommendations, caveats, context that didn't fit above…"
                />
              </div>
            </>
          )}
        </div>

        {/* Error */}
        {error && <p className="mt-3 text-sm text-red-500 text-center">{error}</p>}

        {/* Navigation */}
        <div className="mt-5 flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="px-5 py-2.5 text-sm rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-0 transition"
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 text-sm rounded-lg bg-stone-800 text-white hover:bg-stone-700 transition font-medium"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 text-sm rounded-lg bg-stone-800 text-white hover:bg-stone-700 disabled:opacity-60 transition font-medium"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
