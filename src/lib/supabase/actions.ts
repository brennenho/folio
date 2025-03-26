"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function login(loginData: { email: string; password: string }) {
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
}

export async function signup(signupData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}) {
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
}

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    return data;
  } catch (error) {
    console.error("Error checking authentication:", error);
  }
}
