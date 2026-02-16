import type { Metadata } from "next"
import { AboutContent } from "@/components/about-content"

export const metadata: Metadata = {
  title: "About",
  description: "Kaameo 개발자 소개 페이지",
}

export default function AboutPage() {
  return <AboutContent />
}
