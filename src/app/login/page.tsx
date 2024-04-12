import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Page() {
  // const { login } = useActions();
  // const router = useRouter();

  // const { mutate: _login } = useMutation({
  //   mutationKey: ["login"],
  //   mutationFn: authApi.login,
  //   onSuccess: (data) => {
  //     login({
  //       accessToken: data.data.access_token,
  //       refreshToken: data.data.refresh_token,
  //     });
  //     router.push("/");
  //   },
  //   onError: (error) => {
  //     console.log(error.message);
  //   },
  // });

  // const onLogin = () => {
  //   _login({
  //     email: "nguyteesky165@gmail.com",
  //     password: "123456",
  //   });
  // };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono space-y-2">
        <div className={cn(["grid gap-2 grid-flow-col"])}>
          <Button>Login</Button>
        </div>
      </div>
    </main>
  );
}

export default Page;
