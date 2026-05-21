import { redirect } from "next/navigation";

export default function MissingRoutePage() {
  redirect("/");
}
