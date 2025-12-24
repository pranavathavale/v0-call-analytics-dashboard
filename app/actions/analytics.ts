"use server"

import { createClient } from "@/lib/supabase/server"

export interface CustomMetrics {
  successRate: number
  avgHandlingTime: number
  totalCalls: number
  satisfactionScore: number
}

export async function saveUserAnalytics(email: string, customData: CustomMetrics) {
  const supabase = await createClient()

  const { data: existing, error: fetchError } = await supabase
    .from("user_analytics")
    .select("*")
    .eq("email", email)
    .maybeSingle()

  if (fetchError) {
    return { error: fetchError.message }
  }

  if (existing) {
    // Update existing record
    const { error: updateError } = await supabase
      .from("user_analytics")
      .update({
        custom_data: customData,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)

    if (updateError) {
      return { error: updateError.message }
    }

    return { success: true, previousData: existing.custom_data }
  } else {
    // Insert new record
    const { error: insertError } = await supabase.from("user_analytics").insert({
      email,
      custom_data: customData,
    })

    if (insertError) {
      return { error: insertError.message }
    }

    return { success: true, previousData: null }
  }
}

export async function getUserAnalytics(email: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("user_analytics").select("*").eq("email", email).maybeSingle()

  if (error) {
    return { error: error.message }
  }

  if (!data) {
    return { data: null }
  }

  return { data: data.custom_data as CustomMetrics }
}
