"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { loginSchema } from "@/app/(auth)/login/page";
import { signupSchema } from "@/app/(auth)/signup/page";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function login(loginData: z.infer<typeof loginSchema>) {
  const supabase = await createClient();

  const data = {
    email: loginData.email,
    password: loginData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/private", "layout");
  redirect("/private");
}

export async function signup(signupData: z.infer<typeof signupSchema>) {
  const supabase = await createClient();

  const data = {
    email: signupData.email,
    password: signupData.password,
    options: {
      data: {
        first_name: signupData.firstName,
        last_name: signupData.lastName,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/private", "layout");
  redirect("/private");
}
