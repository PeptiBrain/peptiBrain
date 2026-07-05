import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

// Link/useRouter/usePathname/redirect que ya saben anteponer el idioma correcto en la URL.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
