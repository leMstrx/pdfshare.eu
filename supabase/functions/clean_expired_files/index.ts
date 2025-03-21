import { serve } from "https://deno.land/std@0.170.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// These environment variables are automatically injected when deployed
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseClient = createClient(
      SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
    )

    // Get current date
    const now = new Date()

    // Find expired documents
    const { data: expiredDocs, error: queryError } = await supabaseClient
      .from("documents")
      .select("id, storage_path")
      .lt("expiry_date", now.toISOString())

    if (queryError) {
      throw queryError
    }

    console.log(`Found ${expiredDocs.length} expired documents to delete`)

    // Delete each document and its associated records
    for (const doc of expiredDocs) {
      // First, delete the file from storage
      const { error: storageError } = await supabaseClient
        .storage
        .from("pdf")
        .remove([doc.storage_path])

      if (storageError) {
        console.error(`Error deleting file ${doc.storage_path}:`, storageError)
        continue
      }

      // Then, delete associated views
      const { error: viewsError } = await supabaseClient
        .from("views")
        .delete()
        .eq("document_id", doc.id)

      if (viewsError) {
        console.error(`Error deleting views for document ${doc.id}:`, viewsError)
      }

      // Finally, delete the document record
      const { error: docError } = await supabaseClient
        .from("documents")
        .delete()
        .eq("id", doc.id)

      if (docError) {
        console.error(`Error deleting document record ${doc.id}:`, docError)
      }

      console.log(`Successfully deleted document ${doc.id} with file ${doc.storage_path}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Processed ${expiredDocs.length} expired documents`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
})