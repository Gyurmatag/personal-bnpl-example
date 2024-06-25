import { streamComponent } from "@/app/actions";
import { auth, signIn } from "@/auth";

export default async function Home() {
  const session = await auth();
  let accessToken;
  let responseJson;

  if (session) {
    accessToken = session.accessToken;

    const response = await fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    responseJson = await response.json();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex max-w-5xl items-center justify-center text-sm">
        {session ? (
          <div>{await streamComponent(responseJson.bio)}</div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn();
            }}
          >
            <button
              className="p-3 border rounded-md hover:bg-gray-50"
              type="submit"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
