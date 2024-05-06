"use client";

import authApi from "@/apis/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthActions } from "@/store/auth-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function Page() {
  const { login } = useAuthActions();
  const router = useRouter();

  const { mutate: _login } = useMutation({
    mutationKey: ["login"],
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      login({
        accessToken: data.data.access_token,
        refreshToken: data.data.refresh_token,
        tokenType: "Bearer",
      });
      router.push("/hydrate");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const onLogin = () => {
    _login({
      email: "nguyteesky165@gmail.com",
      password: "123456",
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between space-y-2 font-mono">
        <div className={cn(["grid gap-2 grid-flow-col"])}>
          <Button onClick={onLogin}>Login</Button>
        </div>
      </div>
    </main>
  );
}

export default Page;
