import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    identifier,
    ageRange,
    biologicalSex,
    conditions,
    medications,
    protocolName,
    duration,
    protocolDescription,
    issues,
    adjustments,
    difficultyRating,
    healthChanges,
    formalTracking,
    overallEvaluation,
    anythingElse,
  } = body as Record<string, string>

  const { error } = await supabase.from('responses').insert({
    identifier: identifier || null,
    age_range: ageRange || null,
    biological_sex: biologicalSex || null,
    conditions: conditions || null,
    medications: medications || null,
    protocol_name: protocolName || null,
    duration: duration || null,
    protocol_description: protocolDescription || null,
    issues: issues || null,
    adjustments: adjustments || null,
    difficulty_rating: difficultyRating ? parseInt(difficultyRating) : null,
    health_changes: healthChanges || null,
    formal_tracking: formalTracking || null,
    overall_evaluation: overallEvaluation || null,
    anything_else: anythingElse || null,
  })

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Failed to save response' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
