import { getCurrentUserWithRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function TestAuthPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const currentUser = await getCurrentUserWithRole();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Auth Test</h1>
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Supabase Auth User:</h2>
          <pre className="text-sm overflow-auto">
            {authUser ? JSON.stringify(authUser, null, 2) : "Not authenticated"}
          </pre>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Current User (from getCurrentUser):</h2>
          <pre className="text-sm overflow-auto">
            {currentUser
              ? JSON.stringify(
                {
                  authUser: currentUser.supabaseUser ? {
                    id: currentUser.supabaseUser.id,
                    email: currentUser.supabaseUser.email,
                  } : null,
                  dbUser: {
                    id: currentUser.id,
                    email: currentUser.email,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                  },
                },
                null,
                2
              )
              : "Not authenticated"}
          </pre>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <h2 className="font-semibold mb-2">Environment Variables:</h2>
          <ul className="text-sm space-y-1">
            <li>
              NEXT_PUBLIC_SUPABASE_URL:{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_URL
                ? "✅ Set"
                : "❌ Not set"}
            </li>
            <li>
              NEXT_PUBLIC_SUPABASE_ANON_KEY:{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                ? "✅ Set"
                : "❌ Not set"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

