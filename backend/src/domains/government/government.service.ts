import { supabaseAdmin } from '../../lib/supabase'

type WaitlistEntryInput = {
  email: string
  organization: string
  role: string
  use_case: string
}

export function validateWaitlistEntry(data: WaitlistEntryInput): boolean {
  return Boolean(
    data.email?.trim()
      && data.organization?.trim()
      && data.role?.trim()
      && data.use_case?.trim(),
  )
}

export async function getWaitlistCount() {
  const { count, error } = await supabaseAdmin
    .from('waitlist')
    .select('*', { count: 'exact', head: true })

  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function addToWaitlist(entry: WaitlistEntryInput) {
  if (!validateWaitlistEntry(entry)) {
    throw new Error('Invalid waitlist entry payload')
  }

  const { data, error } = await supabaseAdmin
    .from('waitlist')
    .insert({
      email: entry.email,
      organization: entry.organization,
      role: entry.role,
      use_case: entry.use_case,
      submitted_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}
