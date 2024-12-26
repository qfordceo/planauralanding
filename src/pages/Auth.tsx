import { useSearchParams, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })

        if (error) throw error

        // Check if user is admin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', data.user.id)
          .single()

        if (userError) throw userError

        toast({
          title: "Welcome back!",
          description: userData?.is_admin ? "Signed in as admin." : "You have successfully signed in.",
        })

      } else {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        })

        if (error) throw error

        toast({
          title: "Account created!",
          description: "Your account has been created successfully. Please check your email for verification.",
        })
      }

      navigate("/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
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