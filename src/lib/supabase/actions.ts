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

  revalidatePath("/dashboard", "layout");
}

export async function signup(signupData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}) {
  const supabase = await createClient();

  // const { data: whitelistData } = await supabase
  //   .from("whitelist")
  //   .select("email")
  //   .eq("email", signupData.email)
  //   .single();

  // if (!whitelistData) {
  //   throw new Error("Sign up for our waitlist to get access.");
  // }

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

  revalidatePath("/dashboard", "layout");
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

export async function getLeaderboardData() {
  try {
    const supabase = await createClient();

    const { data: leaderboardData, error } = await supabase
      .from("profiles")
      .select("*")
      .order("account_value", { ascending: true });

    if (error) {
      throw error;
    }

    // transform the data to flatten the nested user object
    const transformedData = leaderboardData.map((entry) => ({
      cash: entry.cash,
      account_value: entry.account_value,
      display_name: entry.display_name,
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
}
