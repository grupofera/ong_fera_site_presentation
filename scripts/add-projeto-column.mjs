import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addProjetoColumn() {
  try {
    console.log("🔄 Attempting to add 'projeto' column to animais table...");

    // Try to add the column
    const { error } = await supabase.rpc("add_projeto_column", {});

    if (error) {
      // If RPC doesn't exist, we'll use a workaround
      console.log("ℹ️ RPC not available, using alternative approach...");
      
      // Check if column already exists by trying to query it
      const { data, error: checkError } = await supabase
        .from("animais")
        .select("projeto")
        .limit(1);

      if (checkError && checkError.message.includes("does not exist")) {
        console.log("❌ Column 'projeto' does not exist in animais table");
        console.log("📝 Please execute this SQL in Supabase SQL Editor:");
        console.log(`
ALTER TABLE animais
ADD COLUMN projeto VARCHAR(255) DEFAULT NULL;

CREATE INDEX idx_animais_projeto ON animais(projeto);
        `);
        process.exit(1);
      } else if (checkError) {
        throw checkError;
      } else {
        console.log("✅ Column 'projeto' already exists in animais table");
      }
    } else {
      console.log("✅ Column 'projeto' added successfully to animais table");
    }

    // Verify the column exists
    const { data: testData, error: testError } = await supabase
      .from("animais")
      .select("id, projeto")
      .limit(1);

    if (testError) {
      console.error("❌ Error verifying column:", testError);
      process.exit(1);
    }

    console.log("✅ Migration completed successfully!");
    console.log("✅ Column 'projeto' is now available in animais table");
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
}

addProjetoColumn();
