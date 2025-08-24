import AuthForm from "./_components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <AuthForm />
    </main>
  );
}
