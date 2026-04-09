'use client'

import { useState } from 'react'

type FormData = {
  identifier: string
  ageRange: string
  biologicalSex: string
  conditions: string
  medications: string
  cancerDiagnosis: string
  protocolName: string
  duration: string
  protocolDescription: string
  issues: string
  adjustments: string
  difficultyRating: string
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
  cancerDiagnosis: '',
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

const STEPS = ['About You', 'The Protocol', 'Challenges & Adjustments', 'Outcomes']

const AGE_RANGES = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+']
const SEX_OPTIONS = ['Male', 'Female', 'Other / Prefer not to say']
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}
    </label>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-slate-400 mb-1.5 leading-relaxed">{children}</p>
}

function TextArea({
  value, onChange, placeholder, rows = 3,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none transition"
    />
  )
}

function TextInput({
  value, onChange, placeholder,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
    />
  )
}

function Select({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition appearance-none cursor-pointer pr-8"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

function ChipGroup({
  options, value, onChange,
}: {
  options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(value === o ? '' : o)}
          className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
            value === o
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function RatingGroup({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="flex gap-1.5 flex-wrap">
        {DIFFICULTY.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onChange(value === d ? '' : d)}
            className={`w-9 h-9 rounded-lg text-sm font-medium border transition-all ${
              value === d
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1.5 px-0.5">
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Response received</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Thank you for sharing your experience. Your response has been saved and will contribute to the research.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Health Protocol Intake</h1>
        </div>

        {/* Intro */}
        <div className="mb-8 max-w-lg mx-auto space-y-3 text-center">
          <p className="text-sm text-slate-500 leading-relaxed">
            Many people have tried unconventional health protocols, often outside mainstream clinical practice. Some saw significant improvements. Some didn&apos;t. Either way, their experience is valuable data.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            We&apos;re collecting these accounts to identify patterns that clinical research hasn&apos;t yet formalized, with a particular focus on cancer patients — though experiences with any serious or chronic condition are equally welcome.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            The goal is to build a body of documented, structured accounts that can support wider recognition and formal validation of approaches that currently exist only as scattered anecdote. Your experience, recorded carefully, becomes evidence.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            This form is anonymous by default. Share only what you&apos;re comfortable sharing. There are no right or wrong answers — honest accounts of what didn&apos;t work are just as important as successes.
          </p>
          <p className="text-sm text-slate-700 font-semibold pt-1">
            All fields are optional. Skip anything you&apos;d rather not answer.
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full h-1 rounded-full transition-all duration-300 ${
                i < step ? 'bg-indigo-500' : i === step ? 'bg-indigo-300' : 'bg-slate-200'
              }`} />
              <span className={`text-xs hidden sm:block transition-colors ${
                i === step ? 'text-indigo-600 font-medium' : i < step ? 'text-slate-400' : 'text-slate-300'
              }`}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Step label (mobile) */}
        <p className="sm:hidden text-xs text-slate-400 mb-4 text-center">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100 p-6 sm:p-8 space-y-5 mt-4">

          {/* ── Section 1: About You ── */}
          {step === 0 && (
            <>
              <div>
                <Label>Name or identifier</Label>
                <TextInput
                  value={data.identifier}
                  onChange={set('identifier')}
                  placeholder="e.g. Jane D., anonymous_42, or leave blank"
                />
              </div>
              <div>
                <Label>Age range</Label>
                <ChipGroup options={AGE_RANGES} value={data.ageRange} onChange={set('ageRange')} />
              </div>
              <div>
                <Label>Biological sex</Label>
                <ChipGroup options={SEX_OPTIONS} value={data.biologicalSex} onChange={set('biologicalSex')} />
              </div>
              <div>
                <Label>Relevant health conditions</Label>
                <TextArea
                  value={data.conditions}
                  onChange={set('conditions')}
                  placeholder="e.g. Type 2 diabetes, hypothyroidism, chronic fatigue…"
                />
              </div>
              <div>
                <Label>Current medications or supplements</Label>
                <TextArea
                  value={data.medications}
                  onChange={set('medications')}
                  placeholder="e.g. Metformin 500mg, Vitamin D 5000 IU…"
                />
              </div>
              <div>
                <Label>Cancer diagnosis</Label>
                <Hint>If applicable — type, stage, and when diagnosed. Leave blank if not relevant.</Hint>
                <TextArea
                  value={data.cancerDiagnosis}
                  onChange={set('cancerDiagnosis')}
                  placeholder="e.g. Stage 3 breast cancer, diagnosed January 2023…"
                />
              </div>
            </>
          )}

          {/* ── Section 2: The Protocol ── */}
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

          {/* ── Section 3: Challenges ── */}
          {step === 2 && (
            <>
              <div>
                <Label>What challenges or side effects did you encounter?</Label>
                <TextArea
                  rows={4}
                  value={data.issues}
                  onChange={set('issues')}
                  placeholder="e.g. Fatigue in the first week, digestive discomfort, social difficulties…"
                />
              </div>
              <div>
                <Label>What adjustments or workarounds did you try?</Label>
                <TextArea
                  rows={4}
                  value={data.adjustments}
                  onChange={set('adjustments')}
                  placeholder="e.g. Reduced dose, shifted timing, added electrolytes…"
                />
              </div>
              <div>
                <Label>Overall difficulty rating</Label>
                <RatingGroup value={data.difficultyRating} onChange={set('difficultyRating')} />
              </div>
            </>
          )}

          {/* ── Section 4: Outcomes ── */}
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
                <Label>Any formal tracking or lab work?</Label>
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
                <Label>Anything else you want to add?</Label>
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
        {error && (
          <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
        )}

        {/* Navigation */}
        <div className="mt-5 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="px-5 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-0 transition"
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium shadow-sm"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition font-medium shadow-sm"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
