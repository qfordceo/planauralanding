import { useSearchParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export default function Auth() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get("mode") || "signin"
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: mode === "signin" ? "Welcome back!" : "Account created!",
      description: mode === "signin" 
        ? "You have successfully signed in." 
        : "Your account has been created successfully.",
    })
    navigate("/")
  }

  return (
    <div className="container max-w-lg py-20 animate-fade-up">
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </CardTitle>
          <p className="text-muted-foreground">
            {mode === "signin" 
              ? "Welcome back! Please sign in to continue." 
              : "Create an account to get started."}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {mode === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}